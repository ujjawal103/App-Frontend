import { openDB } from "./db";

export async function saveStoreCategories(categories) {
  const db = await openDB();

  const tx = db.transaction("storeCategories", "readwrite");

  tx.objectStore("storeCategories").put({
    id: "categories",
    list: categories,
  });

  return tx.complete;
}

export async function getStoreCategories() {
  const db = await openDB();

  return new Promise((resolve) => {
    const tx = db.transaction("storeCategories", "readonly");

    const req = tx.objectStore("storeCategories")
      .get("categories");

    req.onsuccess = () =>
      resolve(req.result?.list || null);
  });
}

export async function deleteStoreCategories() {
  const db = await openDB();

  return db
    .transaction("storeCategories", "readwrite")
    .objectStore("storeCategories")
    .delete("categories");
}