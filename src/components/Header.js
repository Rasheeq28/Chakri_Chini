"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { Globe, Search } from 'lucide-react';

export default function Header() {
  const { lang, toggleLanguage, t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/companies?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pb-2">
      <header className="max-w-fit mx-auto bg-card/80 backdrop-blur-xl border border-foreground/10 rounded-full shadow-lg">
        <div className="px-5 h-14 flex items-center gap-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-7 h-7 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <Image src="/logo.png" alt="Chakri Chini Logo" width={28} height={28} className="object-contain" />
            </div>
            <h1 className="text-base font-bold text-foreground tracking-tight whitespace-nowrap leading-none self-center translate-y-px">
              {t('app_title')}
            </h1>
          </Link>

          {/* Divider */}
          <div className="w-px h-5 bg-foreground/10" />

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all tap-animation ${
                pathname === '/'
                  ? 'bg-foreground/10 text-foreground'
                  : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
              }`}
            >
              Home
            </Link>
            <Link
              href="/companies"
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all tap-animation ${
                pathname.startsWith('/company') || pathname === '/companies'
                  ? 'bg-foreground/10 text-foreground'
                  : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
              }`}
            >
              Companies
            </Link>
          </nav>

          {/* Divider */}
          <div className="w-px h-5 bg-foreground/10" />

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center relative">
            <Search className="absolute left-3 w-3.5 h-3.5 text-white pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="bg-primary text-white placeholder:text-white text-sm rounded-full pl-8 pr-3 py-1.5 w-24 focus:outline-none focus:ring-2 focus:ring-white/50 font-medium"
            />
          </form>

          {/* Divider */}
          <div className="w-px h-5 bg-foreground/10" />

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/20 text-sm font-medium tap-animation text-primary whitespace-nowrap"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'বাংলা' : 'English'}</span>
          </button>

        </div>
      </header>
    </div>
  );
}
