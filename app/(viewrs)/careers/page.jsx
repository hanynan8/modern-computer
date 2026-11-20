import { Briefcase, MapPin } from 'lucide-react';
import { getDoc, getLang, pickI18n } from '@/lib/site';

export default async function CareersPage() {
  const [careers, lang] = await Promise.all([getDoc('careers'), getLang()]);
  if (!careers) return <p className="p-10 text-center">No data</p>;
  const t = pickI18n(careers, lang);
  const email = careers.contactEmail;

  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <span className="inline-block rounded-full bg-brand-100 px-4 py-1.5 text-sm font-bold text-brand-700">{t.badge}</span>
      <h1 className="mt-5 text-4xl font-extrabold leading-tight text-brand-900">{t.heroTitle}</h1>
      <p className="mt-4 text-lg leading-8 text-slate-600">{t.heroText}</p>

      <h2 className="mt-14 text-2xl font-extrabold text-brand-900">{t.openRolesTitle}</h2>
      <div className="mt-6 space-y-4">
        {careers.items.map(({ slug }) => {
          const r = t.items?.[slug];
          if (!r) return null;
          return (
            <article key={slug} className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-bold text-brand-900">{r.title}</h3>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1.5"><Briefcase className="h-4 w-4" />{r.type}</span>
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{r.location}</span>
                </div>
                <p className="mt-3 leading-7 text-slate-600">{r.description}</p>
              </div>
              <a href={`mailto:${email}?subject=${encodeURIComponent(r.title)}`} className="shrink-0 rounded-full bg-brand-600 px-6 py-2.5 text-center text-sm font-bold text-white hover:bg-brand-700">{t.applyNow}</a>
            </article>
          );
        })}
      </div>

      <p className="mt-10 text-slate-600">
        {t.noRoleText} <a href={`mailto:${email}`} className="font-bold text-brand-600 hover:underline">{email}</a> {t.noRoleTail}
      </p>
    </section>
  );
}
