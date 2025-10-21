// createdb.js
import { openDb } from "./db.js";

async function createTables() {
  const db = await openDb();

  const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
  console.log(
    "📦 Tables in database:",
    tables.map((t) => t.name)
  );

  await db.close();
  console.log("✅ Database connection closed");
}

createTables().catch((err) => console.error("❌ Error creating tables:", err));
