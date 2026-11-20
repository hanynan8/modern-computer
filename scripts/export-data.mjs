// scripts/export-data.mjs
// بيسحب كل الـ collections العامة من MongoDB ويحفظها كملفات JSON في فولدر data/
//
// التشغيل:   npm run export-data
// المتطلبات: MONGO_URI موجود في .env.local أو .env أو كمتغير بيئة.

import fs from 'node:fs';
import path from 'node:path';
import { MongoClient } from 'mongodb';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'data');

// ⚠️ collections فيها بيانات مستخدمين / دفع / جلسات — مش هتتصدّر أبدًا
// عشان ما تترفعش على GitHub أو تتوزع مع الموقع.
const EXCLUDE = new Set([
  'auth', 'users', 'user', 'accounts', 'sessions', 'verification_tokens',
  'carts', 'profile', 'payments', 'orders',
]);

// تحميل .env.local / .env بدون أي مكتبات
function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    const p = path.join(ROOT, file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)?\s*$/);
      if (!m || line.trim().startsWith('#')) continue;
      const key = m[1];
      let val = (m[2] ?? '').trim();
      if (/^(['"]).*\1$/.test(val)) val = val.slice(1, -1);
      if (process.env[key] === undefined) process.env[key] = val;
    }
  }
}

async function main() {
  loadEnv();
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGO_URI مش موجود. حطه في .env.local');
    process.exit(1);
  }

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
  await client.connect();
  const db = client.db();
  console.log(`✅ اتصل بقاعدة البيانات: ${db.databaseName}`);

  const cols = (await db.listCollections().toArray())
    .map((c) => c.name)
    .filter((n) => !n.startsWith('system.'));

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const exported = [];
  for (const name of cols) {
    if (EXCLUDE.has(name)) {
      console.log(`⏭️  تخطي (حساس): ${name}`);
      continue;
    }
    const docs = await db.collection(name).find({}).toArray();
    // JSON.stringify بيحوّل ObjectId و Date لنصوص — نفس اللي كان بيعمله toPlainJSON
    fs.writeFileSync(
      path.join(OUT_DIR, `${name}.json`),
      JSON.stringify(docs, null, 2),
      'utf8'
    );
    exported.push(name);
    console.log(`💾 ${name}.json  (${docs.length} document)`);
  }

  await client.close();
  console.log(`\n🎉 تم تصدير ${exported.length} collection في فولدر data/`);
}

main().catch((err) => {
  console.error('❌ فشل التصدير:', err.message);
  process.exit(1);
});
