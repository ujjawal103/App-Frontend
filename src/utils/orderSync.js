// import axios from "axios";
// import { 
//   getPendingOrders, 
//   removePendingOrder 
// } from "../offline/pendingOrdersDB";
// import { toast } from "react-hot-toast";

// let isSyncing = false;

// export async function syncPendingOrders() {
//   if (isSyncing) return;
//   isSyncing = true;

//   try {
//     const pending = await getPendingOrders();

//     if (!pending || pending.length === 0) {
//       isSyncing = false;
//       return;
//     }

//     console.log("🔁 Syncing pending orders:", pending.length);

//     let successCount = 0;
//     let failedCount = 0;

//     // 🔥 Sync ALL orders — even if some fail
//     for (const order of pending) {
//       try {
//         await axios.post(
//           `${import.meta.env.VITE_BASE_URL}orders/create`,
//           order.data
//         );

//         // 🟢 Remove after success
//         await removePendingOrder(order.id);
//         successCount++;

//         console.log("✔ Synced order:", order.id);
//       } catch (err) {
//         // ❌ Do NOT delete failed order
//         failedCount++;

//         console.log("❌ Order sync failed (will retry):", order.id);
//       }
//     }

//     // 🟡 Show summary toast (single notification)
//     if (successCount > 0) {
//       toast.success(`${successCount} order(s) synced online`);
//     }
//     if (failedCount > 0) {
//       toast.error(`${failedCount} order(s) syncing failed, please try again`);
//     }

//   } catch (err) {
//     console.log("SYNC ERROR:", err);
//   } finally {
//     isSyncing = false;
//   }
// }






import axios from "axios";
import {
  getPendingOrders,
  removePendingOrder,
} from "../offline/pendingOrdersDB";
import { toast } from "../notification/Notification";

let isSyncing = false;

export async function syncPendingOrders() {
  if (isSyncing) return;
  isSyncing = true;

  try {
    const pending = await getPendingOrders();
    if (!pending || pending.length === 0) {
      isSyncing = false;
      return;
    }

    console.log("🔁 Syncing pending orders:", pending.length);

    // ------------------------------
    // 1️⃣ PREPARE payload for backend
    // ------------------------------
    const storeId = pending[0].order.storeId;

    const allOrdersPayload = pending.map((record) => ({
      ...record.order,        // contains tableId, username, items, billingSummary
      _localId: record.id,    // attach original unique ID
    }));

    // ------------------------------
    // 2️⃣ Call backend sync route
    // ------------------------------
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}orders/sync-orders`,
      {
        storeId,
        orders: allOrdersPayload,
      }
    );

    const results = res.data.results || [];

    let successCount = 0;
    let failedCount = 0;

    // ------------------------------
    // 3️⃣ Remove only successful ones
    // ------------------------------
    for (const result of results) {
      if (result.ok) {
        successCount++;
        await removePendingOrder(result.orderRef); // remove by _localId
      } else {
        failedCount++;
      }
    }

    // ------------------------------
    // 4️⃣ Show summary
    // ------------------------------
    if (successCount > 0)
      toast.success(`${successCount} order(s) synced successfully`);

    if (failedCount > 0)
      toast.error(`${failedCount} order(s) failed & will retry`);


  } catch (err) {
    console.log("❌ SYNC ERROR:", err.message);
    toast.error("orders sync failed, will retry later");
  } finally {
    isSyncing = false;
  }
}
