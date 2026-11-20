// lib/mongoAuth.js
// Shared mongoose connection helper. Reuses the same cached connection
// pattern used by the NextAuth route/register route (globalThis._mongoAuth)
// so we don't open a second connection pool in the same runtime.

import dns from 'node:dns';

// Use public DNS so mongodb+srv:// lookups work on mobile hotspots that block SRV queries.
// Set MONGO_SYSTEM_DNS=1 in the env to skip this and use the system DNS.
if (!process.env.MONGO_SYSTEM_DNS) {
  try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch {}
}

import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!globalThis._mongoAuth) {
  globalThis._mongoAuth = { conn: null, promise: null };
}

export async function connectMongoDB() {
  if (globalThis._mongoAuth.conn) return globalThis._mongoAuth.conn;
  if (!MONGO_URI) throw new Error('MONGO_URI not set');

  if (!globalThis._mongoAuth.promise) {
    globalThis._mongoAuth.promise = mongoose
      .connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 })
      .catch((err) => {
        globalThis._mongoAuth.promise = null; // don't cache a failed connection
        throw err;
      });
  }

  globalThis._mongoAuth.conn = await globalThis._mongoAuth.promise;
  return globalThis._mongoAuth.conn;
}

export default connectMongoDB;