export function openDB() {
  return new Promise((resolve) => {
    const req = indexedDB.open("TapRestoDB", 7); // increment version

    req.onupgradeneeded = (e) => {
      const db = e.target.result;

      // store profile
      if (!db.objectStoreNames.contains("storeProfile")) {
        db.createObjectStore("storeProfile", { keyPath: "id" });
      }

      // store items
      if (!db.objectStoreNames.contains("storeItems")) {
        db.createObjectStore("storeItems", { keyPath: "id" });
      }

      // store tables (NEW)
      if (!db.objectStoreNames.contains("storeTables")) {
        db.createObjectStore("storeTables", { keyPath: "id" });
      }

      // pending orders
      if (!db.objectStoreNames.contains("pendingOrders")) {
        db.createObjectStore("pendingOrders", { keyPath: "id" });
      }
    };

    req.onsuccess = () => resolve(req.result);
  });
}
