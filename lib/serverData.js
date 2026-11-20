// lib/serverData.js
//
// طبقة بيانات ستاتيك 100%: كل بيانات الصفحات بتتقرأ من data/*.json وقت
// الـ build بس (next build). مفيش MongoDB ولا API ولا أي طلب وقت التشغيل.

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const cache = new Map();

function readCollection(name) {
  if (!/^[A-Za-z0-9_-]+$/.test(name)) return null;
  if (cache.has(name)) return cache.get(name);
  try {
    const raw = fs.readFileSync(path.join(DATA_DIR, `${name}.json`), 'utf8');
    const parsed = JSON.parse(raw);
    cache.set(name, parsed);
    return parsed;
  } catch {
    return null;
  }
}

function findProductInDocs(docs, id) {
  for (const doc of docs) {
    if (Array.isArray(doc.products)) {
      const product = doc.products.find((p) => String(p.id) === String(id));
      if (product) return product;
    }
    if (String(doc.id) === String(id)) return doc;
  }
  return null;
}

/**
 * Returns { success: true, data } or { success: false, error }.
 * - getCollectionData('laptop')           -> كل مستندات الكولكشن
 * - getCollectionData('laptop', { id })   -> منتج واحد بالـ id
 */
export async function getCollectionData(collectionName, { id } = {}) {
  const docs = readCollection(String(collectionName || ''));
  if (!docs) return { success: false, error: 'Collection not found' };

  if (id !== undefined && id !== null && id !== '') {
    const product = findProductInDocs(docs, id);
    return product
      ? { success: true, data: product }
      : { success: false, error: 'Document not found' };
  }
  return { success: true, data: docs };
}

/** كل المنتجات (مع مفتاح الفئة) - بتتستخدم في صفحة المفضلة الستاتيك. */
export const PRODUCT_CATEGORIES = [
  { key: 'laptop', href: 'laptop' },
  { key: 'accessories', href: 'accessories' },
  { key: 'component', href: 'component' },
  { key: 'monitors', href: 'monitors' },
  { key: 'other', href: 'other' },
  { key: 'pc-build', href: 'pc-builds' },
  { key: 'pos', href: 'pos' },
  { key: 'printers', href: 'printers' },
  { key: 'storage-devices', href: 'storage-devices' },
];

export async function getAllProducts() {
  const out = [];
  for (const cat of PRODUCT_CATEGORIES) {
    const res = await getCollectionData(cat.key);
    const products = res.success && Array.isArray(res.data) ? res.data[0]?.products : null;
    (products || []).forEach((p) => out.push({ ...p, categoryKey: cat.href }));
  }
  return out;
}
