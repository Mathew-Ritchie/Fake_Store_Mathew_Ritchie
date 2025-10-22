// db.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function openDb() {
  const db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      item_id TEXT NOT NULL,
      title TEXT,
      image TEXT,
      price REAL,
      quantity INTEGER DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  await db.exec(`
  CREATE TABLE IF NOT EXISTS favourites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    title TEXT,
    image TEXT,
    price REAL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

  return db;
}
