'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import LangSwitch from '@/app/components/site/LangSwitch';

export default function Navbar({ navbarData, lang }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const active = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const accountHref = session?.user ? '/profile' : '/login';

  const iconBtn = 'grid h-9 w-9 place-items-center rounded-full text-slate-600 hover:bg-slate-100 hover:text-brand-600';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-900 text-lg font-extrabold text-white">{navbarData.brandLetter}</span>
          <span className="text-xl font-extrabold text-brand-900">{navbarData.brand}</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navbarData.links.map((l) => (
            <Link key={l.href} href={l.href} className={`text-sm font-semibold transition-colors hover:text-brand-600 ${active(l.href) ? 'text-brand-600' : 'text-slate-600'}`}>
              {l.text}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LangSwitch lang={lang} />
          <Link href="/cart" className={iconBtn} aria-label="Cart"><ShoppingCart className="h-5 w-5" /></Link>
          <Link href={accountHref} className={iconBtn} aria-label="Account"><User className="h-5 w-5" /></Link>
          <a href={`mailto:${navbarData.email}`} className="ms-2 rounded-full bg-brand-600 px-5 py-2 text-sm font-bold text-white hover:bg-brand-700">{navbarData.quote}</a>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
      </div>

      {open && (
        <div className="space-y-1 border-t border-slate-100 bg-white px-4 py-3 md:hidden">
          {navbarData.links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50">{l.text}</Link>
          ))}
          <div className="flex items-center justify-between pt-2">
            <LangSwitch lang={lang} />
            <div className="flex items-center gap-1">
              <Link href="/cart" onClick={() => setOpen(false)} className={iconBtn}><ShoppingCart className="h-5 w-5" /></Link>
              <Link href={accountHref} onClick={() => setOpen(false)} className={iconBtn}><User className="h-5 w-5" /></Link>
            </div>
          </div>
          <a href={`mailto:${navbarData.email}`} className="mt-2 block rounded-full bg-brand-600 px-5 py-2 text-center text-sm font-bold text-white">{navbarData.quote}</a>
        </div>
      )}
    </header>
  );
}
