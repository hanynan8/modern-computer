// lib/site.js — قراءة محتوى الموقع (navbar / footer / home / services / careers)
// من data/*.json عن طريق نفس طبقة lib/serverData.js (وضع static).
import { cookies } from 'next/headers';
import { getCollectionData } from '@/lib/serverData';

export async function getDoc(name) {
  const r = await getCollectionData(name);
  if (!r.success) return null;
  return Array.isArray(r.data) ? r.data[0] ?? null : r.data;
}

export async function getLang() {
  const v = (await cookies()).get('lang')?.value;
  return v === 'en' ? 'en' : 'ar'; // العربي هو الافتراضي زي باقي المتجر
}

export function pickI18n(doc, lang) {
  return doc?.i18n?.[lang] ?? doc?.i18n?.en ?? {};
}
