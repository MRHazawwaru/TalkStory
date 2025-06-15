const DB_NAME = "TalkStoryBookmarkDB";
const DB_VERSION = 1;
const STORE_NAME = "bookmarks";

const openDB = () => {
  console.log("openDB: Memulai pembukaan database...");
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      console.log("openDB: onupgradeneeded dipanggil.");
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        console.log("openDB: Membuat object store 'bookmarks'.");
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      console.log("openDB: Database berhasil dibuka.");
      resolve(request.result);
    };

    request.onerror = () => {
      console.error("openDB: Kesalahan saat membuka database:", request.error);
      reject(request.error);
    };

    request.onblocked = () => {
        console.warn("openDB: Pembukaan database diblokir.");
    };
  });
};

export const addBookmark = async (story) => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(story);
    console.log(`addBookmark: Berhasil menambahkan/memperbarui bookmark ${story.id}`);
    return tx.complete;
  } catch (err) {
    console.error("addBookmark: Gagal menambahkan bookmark:", err);
    throw err;
  }
};

export const removeBookmark = async (id) => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    console.log(`removeBookmark: Berhasil menghapus bookmark ${id}`);
    return tx.complete;
  } catch (err) {
    console.error("removeBookmark: Gagal menghapus bookmark:", err);
    throw err;
  }
};

export const getAllBookmarks = async () => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        console.log("getAllBookmarks: Berhasil mendapatkan semua bookmark.");
        resolve(request.result || []);
      };
      request.onerror = () => {
        console.error("getAllBookmarks: Gagal mendapatkan semua bookmark:", request.error);
        reject(request.error);
      };
    });
  } catch (err) {
    console.error("getAllBookmarks: Gagal membuka DB untuk getAllBookmarks:", err);
    throw err;
  }
};

export const isBookmarked = async (id) => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      
      request.onsuccess = () => {
        console.log(`isBookmarked: Status bookmark untuk ${id}: ${request.result !== undefined}`);
        resolve(request.result !== undefined);
      };
      
      request.onerror = () => {
        console.error("isBookmarked: Gagal memeriksa bookmark:", request.error);
        reject(request.error);
      };
    });
  } catch (err) {
    console.error("isBookmarked: Gagal membuka DB untuk memeriksa bookmark:", err);
    throw err;
  }
};