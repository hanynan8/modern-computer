import Link from 'next/link';
import { getDoc, getLang, pickI18n } from '@/lib/site';
import Icon from '@/app/components/site/Icon';

export default async function ServicesPage() {
  const [services, lang] = await Promise.all([getDoc('services'), getLang()]);
  if (!services) return <p className="p-10 text-center">No data</p>;
  const t = pickI18n(services, lang);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <span className="inline-block rounded-full bg-brand-100 px-4 py-1.5 text-sm font-bold text-brand-700">{t.pageBadge}</span>
      <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-brand-900">{t.pageTitle}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{t.pageIntro}</p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {services.items.map((s) => {
          const it = t.items?.[s.slug];
          return (
            <article key={s.slug} className="flex flex-col rounded-2xl border border-slate-100 p-7 shadow-sm">
              <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600"><Icon name={s.icon} /></span>
              <h2 className="text-xl font-bold text-brand-900">{it?.title}</h2>
              <p className="mt-2 flex-1 leading-8 text-slate-600">{it?.short}</p>
              <Link href={`/services/${s.slug}`} className="mt-5 self-start rounded-full bg-brand-600 px-5 py-2 text-sm font-bold text-white hover:bg-brand-700">{t.seeHowItWorks}</Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
