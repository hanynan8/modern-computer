'use client';
import { useRouter } from 'next/navigation';
import { Languages } from 'lucide-react';

export default function LangSwitch({ lang }) {
  const router = useRouter();
  const next = lang === 'ar' ? 'en' : 'ar';
  return (
    <button
      onClick={() => {
        document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`;
        router.refresh();
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:border-brand-500 hover:text-brand-600"
      aria-label="Switch language"
    >
      <Languages className="h-4 w-4" />
      {next === 'ar' ? 'العربية' : 'English'}
    </button>
  );
}
