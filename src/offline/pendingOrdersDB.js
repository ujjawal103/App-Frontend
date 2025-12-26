// import { openDB } from "./db";

// /**
//  * Save a pending order in IndexedDB (FIFO queue)
//  * Includes retry tracking to prevent infinite loops
//  */
// export async function savePendingOrder(order) {
//   const db = await openDB();
//   const tx = db.transaction("pendingOrders", "readwrite");
//   const store = tx.objectStore("pendingOrders");

//   const id = Date.now() + Math.random(); // unique id (timestamp + random)

//   await store.put({
//     id,
//     data: order,            // main order payload
//     retry: 0,               // retry counter
//     createdAt: Date.now(),  // sorting / debugging
//   });

//   return tx.complete;
// }


// /**
//  * Get all pending orders (sorted FIFO)
//  */
// export async function getPendingOrders() {
//   const db = await openDB();
//   const tx = db.transaction("pendingOrders", "readonly");
//   const store = tx.objectStore("pendingOrders");

//   return new Promise((resolve) => {
//     const req = store.getAll();
//     req.onsuccess = () => {
//       const list = req.result || [];
//       list.sort((a, b) => a.id - b.id); // FIFO
//       resolve(list);
//     };
//   });
// }


// /**
//  * Remove a pending order after successful sync
//  */
// export async function removePendingOrder(id) {
//   const db = await openDB();
//   const tx = db.transaction("pendingOrders", "readwrite");
//   tx.objectStore("pendingOrders").delete(id);
//   return tx.complete;
// }


// /**
//  * Increment retry count when a sync attempt fails
//  */
// export async function incrementRetry(id) {
//   const db = await openDB();
//   const tx = db.transaction("pendingOrders", "readwrite");
//   const store = tx.objectStore("pendingOrders");

//   return new Promise((resolve) => {
//     const req = store.get(id);

//     req.onsuccess = async () => {
//       const record = req.result;
//       if (!record) return resolve(false);

//       record.retry = (record.retry || 0) + 1;
//       await store.put(record);

//       resolve(true);
//     };
//   });
// }




import { openDB } from "./db";

/**
 * Save a pending order in IndexedDB (FIFO queue)
 */
export async function savePendingOrder(order) {
  const db = await openDB();
  const tx = db.transaction("pendingOrders", "readwrite");
  const store = tx.objectStore("pendingOrders");

  const id = Date.now() + Math.random(); // unique
  const _localId = id; // important reference for backend

  // order must contain billingSummary, createdAt, updatedAt
  const payload = {
    id,
    _localId,
    order: {
      ...order,
      _localId,
      createdAt: order.createdAt || new Date().toISOString(),
      updatedAt: order.updatedAt || new Date().toISOString(),
    },
  };

  await store.put(payload);
  return tx.complete;
}

/**
 * Get all pending orders (FIFO)
 */
export async function getPendingOrders() {
  const db = await openDB();
  const tx = db.transaction("pendingOrders", "readonly");
  const store = tx.objectStore("pendingOrders");

  return new Promise((resolve) => {
    const req = store.getAll();
    req.onsuccess = () => {
      const list = req.result || [];
      list.sort((a, b) => a.id - b.id);
      resolve(list);
    };
  });
}

/**
 * Remove a pending order after successful sync
 */
export async function removePendingOrder(id) {
  const db = await openDB();
  const tx = db.transaction("pendingOrders", "readwrite");
  tx.objectStore("pendingOrders").delete(id);
  return tx.complete;
}
