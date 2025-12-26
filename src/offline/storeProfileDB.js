// function openDB() {
//   return new Promise((res) => {
//     const req = indexedDB.open("TapRestoDB", 2);
//     req.onupgradeneeded = (e) => {
//       const db = e.target.result;
//       if (!db.objectStoreNames.contains("storeProfile")) {
//         db.createObjectStore("storeProfile", { keyPath: "id" });
//       }
//     };
//     req.onsuccess = () => res(req.result);
//   });
// }

// export async function saveStoreProfile(profile) {
//   const db = await openDB();
//   const tx = db.transaction("storeProfile", "readwrite");
//   tx.objectStore("storeProfile").put({ id: "store", profile });
//   return tx.complete;
// }

// export async function getStoreProfile() {
//   const db = await openDB();
//   return new Promise((res) => {
//     const tx = db.transaction("storeProfile", "readonly");
//     const req = tx.objectStore("storeProfile").get("store");
//     req.onsuccess = () => res(req.result?.profile || null);
//   });
// }

// export async function clearStoreProfile() {
//   const db = await openDB();
//   return db.transaction("storeProfile", "readwrite").objectStore("storeProfile").clear();
// }



// export async function deleteStoreProfile() {
//   const db = await openDB();
//   return new Promise((resolve, reject) => {
//     const tx = db.transaction("storeProfile", "readwrite");
//     const store = tx.objectStore("storeProfile");
//     const req = store.delete("store");

//     req.onsuccess = () => resolve(true);
//     req.onerror = () => reject(req.error);
//   });
// }


import { openDB } from "./db";

export async function saveStoreProfile(profile) {
  const db = await openDB();
  const tx = db.transaction("storeProfile", "readwrite");
  tx.objectStore("storeProfile").put({ id: "store", profile });
  return tx.complete;
}

export async function getStoreProfile() {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction("storeProfile", "readonly");
    const req = tx.objectStore("storeProfile").get("store");
    req.onsuccess = () => resolve(req.result?.profile || null);
  });
}

export async function deleteStoreProfile() {
  const db = await openDB();
  return db.transaction("storeProfile", "readwrite")
           .objectStore("storeProfile")
           .delete("store");
}
