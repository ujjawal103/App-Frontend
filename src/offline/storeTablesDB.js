import { openDB } from "./db";

// SAVE all tables in DB
export async function saveStoreTables(tables) {
  const db = await openDB();
  const tx = db.transaction("storeTables", "readwrite");
  tx.objectStore("storeTables").put({ id: "tables", list: tables });
  return tx.complete;
}

// GET tables from DB
export async function getStoreTables() {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction("storeTables", "readonly");
    const req = tx.objectStore("storeTables").get("tables");
    req.onsuccess = () => resolve(req.result?.list || null);
  });
}

// DELETE table offline data (on logout)
export async function deleteStoreTables() {
  const db = await openDB();
  const tx = db.transaction("storeTables", "readwrite");
  tx.objectStore("storeTables").delete("tables");
}
