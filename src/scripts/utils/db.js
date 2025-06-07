import { openDB } from "idb";

const DB_NAME = "talkstory-db";
const STORE_NAME = "stories";

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME, { keyPath: "id" });
  },
});

export const saveStory = async (story) => {
  const db = await dbPromise;
  return db.put(STORE_NAME, story);
};

export const getAllStories = async () => {
  const db = await dbPromise;
  return db.getAll(STORE_NAME);
};

export const deleteStory = async (id) => {
  const db = await dbPromise;
  return db.delete(STORE_NAME, id);
};
