import { openDb } from "./db.js";

const logUsers = async () => {
  const db = await openDb();
  const users = await db.all("SELECT * FROM users");
  console.table(users);
};

logUsers();
