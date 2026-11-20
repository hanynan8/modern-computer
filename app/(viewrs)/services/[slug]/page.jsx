import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import { getDoc, getLang, pickI18n } from '@/lib/site';
import Icon from '@/app/components/site/Icon';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const [services, lang] = await Promise.all([getDoc('services'), getLang()]);
  const it = pickI18n(services, lang).items?.[slug];
  return it ? { title: `${it.title} | Qualx`, description: it.short } : {};
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const [services, footer, lang] = await Promise.all([getDoc('services'), getDoc('footer'), getLang()]);
  const meta = services?.items.find((s) => s.slug === slug);
  const t = pickI18n(services, lang);
  const it = t.items?.[slug];
  if (!meta || !it) notFound();

  const email = footer?.contact?.email || '';
  const others = services.items.filter((s) => s.slug !== slug);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <Link href="/services" className="text-sm font-bold text-brand-600 hover:underline">{t.allServices}</Link>

      <div className="mt-6 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <span className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600"><Icon name={meta.icon} className="h-7 w-7" /></span>
          <h1 className="text-4xl font-extrabold text-brand-900">{it.title}</h1>
          <p className="mt-3 text-lg text-slate-500">{it.short}</p>

          <h2 className="mt-10 text-xl font-extrabold text-brand-900">{t.howItWorks}</h2>
          <p className="mt-3 leading-8 text-slate-600">{it.description}</p>

          <h2 className="mt-10 text-xl font-extrabold text-brand-900">{t.whatsIncluded}</h2>
          <ul className="mt-4 space-y-3">
            {it.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-slate-700">
                <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-600"><Check className="h-3.5 w-3.5" /></span>{h}
              </li>
            ))}
          </ul>

          <a href={`mailto:${email}?subject=${encodeURIComponent(it.title)}`} className="mt-10 inline-block rounded-full bg-brand-600 px-7 py-3 font-bold text-white hover:bg-brand-700">{t.askAboutService}</a>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="mb-4 font-extrabold text-brand-900">{t.otherServices}</h3>
          <ul className="space-y-4">
            {others.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="group flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600"><Icon name={s.icon} className="h-5 w-5" /></span>
                  <span className="font-semibold text-slate-700 group-hover:text-brand-600">{t.items?.[s.slug]?.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/services" className="mt-5 inline-block text-sm font-bold text-brand-600">{t.learnMore}</Link>
        </aside>
      </div>
    </section>
  );
}
