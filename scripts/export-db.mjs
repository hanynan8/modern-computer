// Usage:  npm run export-db
// Dumps every collection of the database in MONGO_URI to data/<collection>.json
// Run it once on a network that can reach Atlas (VPN / other Wi-Fi).
import fs from "node:fs/promises";
import dns from "node:dns";
import { MongoClient } from "mongodb";

if (!process.env.MONGO_SYSTEM_DNS) {
  try { dns.setServers(["8.8.8.8", "1.1.1.1"]); } catch {}
}

const uri = process.env.MONGO_URI;
if (!uri) { console.error("MONGO_URI is not set"); process.exit(1); }

// Private collections are skipped so user data doesn't end up in the repo.
const SKIP = new Set(["auth", "users", "accounts", "sessions", "payments"]);

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
try {
  await client.connect();
  const db = client.db(); // database name comes from the URI (techlap)
  await fs.mkdir("data", { recursive: true });
  const cols = (await db.listCollections().toArray())
    .map((c) => c.name)
    .filter((n) => !n.startsWith("system."));
  for (const name of cols) {
    if (SKIP.has(name)) { console.log(`- skipped ${name}`); continue; }
    const docs = await db.collection(name).find({}).toArray();
    await fs.writeFile(`data/${name}.json`, JSON.stringify(docs, null, 2), "utf-8");
    console.log(`✅ ${name}: ${docs.length} documents`);
  }
} catch (e) {
  console.error("❌", e.name, e.message);
  process.exitCode = 1;
} finally {
  await client.close();
}
