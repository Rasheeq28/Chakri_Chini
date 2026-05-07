"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { Globe, Hexagon, Search } from 'lucide-react';

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
      <header className="max-w-4xl mx-auto bg-card/80 backdrop-blur-xl border border-foreground/10 rounded-full shadow-lg">
        <div className="px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <Hexagon className="w-5 h-5 text-white fill-white/20" />
            </div>
            <h1 className="text-lg font-bold text-foreground hidden sm:block tracking-tight">
              {t('app_title')}
            </h1>
          </Link>

          {/* Centered Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2 px-4">
            <Link 
              href="/"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all tap-animation ${
                pathname === '/' 
                  ? 'bg-foreground/10 text-foreground' 
                  : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/companies"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all tap-animation ${
                pathname.startsWith('/company') || pathname === '/companies'
                  ? 'bg-foreground/10 text-foreground' 
                  : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
              }`}
            >
              Companies
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center relative mx-2">
            <Search className="absolute left-3 w-4 h-4 text-white pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="bg-primary text-white placeholder:text-white text-sm rounded-full pl-9 pr-3 py-1.5 w-28 focus:outline-none focus:ring-2 focus:ring-white/50 font-medium"
            />
          </form>

          {/* Right Actions */}
          <div className="flex items-center shrink-0">
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-4 sm:py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/20 text-sm font-medium tap-animation text-primary gap-2"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'en' ? 'বাংলা' : 'English'}</span>
            </button>
          </div>

        </div>
      </header>
    </div>
  );
}
