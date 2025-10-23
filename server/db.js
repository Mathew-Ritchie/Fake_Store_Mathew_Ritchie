// db.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function openDb() {
  const db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });

  // 1. USERS Table (No Change)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);

  // 2. CART Table (Image and Price REMOVED)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      item_id TEXT NOT NULL,
      title TEXT,
      quantity INTEGER DEFAULT 1,
      UNIQUE(user_id, item_id), 
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // 3. FAVOURITES Table (Image and Price REMOVED)
  await db.exec(`
  CREATE TABLE IF NOT EXISTS favourites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        item_id INTEGER NOT NULL,
        title TEXT,
        UNIQUE(user_id, item_id) 
    );
`);

  return db;
}
