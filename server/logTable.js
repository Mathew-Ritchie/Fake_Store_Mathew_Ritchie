import { openDb } from "./db.js";

const logUsers = async () => {
  const db = await openDb();
  const users = await db.all("SELECT * FROM cart");
  console.table(users);
};

logUsers();
