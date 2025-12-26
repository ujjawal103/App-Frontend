import { openDB } from "./db";

export async function saveStoreItems(items) {
  const db = await openDB();
  const tx = db.transaction("storeItems", "readwrite");
  tx.objectStore("storeItems").put({ id: "items", list: items });
}

export async function getStoreItems() {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction("storeItems", "readonly");
    const req = tx.objectStore("storeItems").get("items");
    req.onsuccess = () => resolve(req.result?.list || null);
  });
}

export async function deleteStoreItems() {
  const db = await openDB();
  return db.transaction("storeItems", "readwrite")
           .objectStore("storeItems")
           .delete("items");
}
