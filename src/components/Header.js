"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { Globe, Search, Plus } from 'lucide-react';
import SubmitModal from '@/components/SubmitModal';

export default function Header() {
  const { lang, toggleLanguage, t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/companies?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 pt-4 pb-2">
        <header className="w-full sm:max-w-fit mx-auto bg-card/80 backdrop-blur-xl border border-foreground/10 rounded-full shadow-lg overflow-hidden">
          <div className="px-3 sm:px-5 h-14 flex items-center gap-1.5 sm:gap-3 justify-between sm:justify-start">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group px-1">
              <div className="w-7 h-7 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <Image src="/logo.png" alt="Chakri Chini Logo" width={28} height={28} className="object-contain" />
              </div>
              <h1 className="hidden xs:block text-base font-bold text-foreground tracking-tight whitespace-nowrap leading-none self-center translate-y-px">
                {t('app_title')}
              </h1>
            </Link>

            {/* Divider */}
            <div className="w-px h-5 bg-foreground/10 shrink-0" />

            {/* Navigation */}
            <nav className="flex items-center gap-0.5 sm:gap-1">
              <Link
                href="/"
                className={`px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all tap-animation ${
                  pathname === '/'
                    ? 'bg-foreground/10 text-foreground'
                    : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                <span className="hidden sm:inline">Home</span>
                <span className="sm:hidden">🏠</span>
              </Link>
              <Link
                href="/companies"
                className={`px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all tap-animation ${
                  pathname.startsWith('/company') || pathname === '/companies'
                    ? 'bg-foreground/10 text-foreground'
                    : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                <span className="hidden sm:inline">Companies</span>
                <span className="sm:hidden text-[10px]">🏢</span>
              </Link>
            </nav>

            {/* Divider */}
            <div className="w-px h-5 bg-foreground/10 shrink-0" />

            {/* My Experience Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-primary text-white text-xs sm:text-sm font-bold hover:bg-primary/90 hover:shadow-md transition-all tap-animation whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">My Experience</span>
              <span className="xs:hidden">Add</span>
            </button>

            {/* Divider */}
            <div className="hidden sm:block w-px h-5 bg-foreground/10 shrink-0" />

            {/* Search Bar - Hidden on small mobile */}
            <form onSubmit={handleSearch} className="hidden sm:flex items-center relative">
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
            <div className="w-px h-5 bg-foreground/10 shrink-0" />

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/20 text-xs sm:text-sm font-medium tap-animation text-primary whitespace-nowrap"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'en' ? 'বাংলা' : 'English'}</span>
              <span className="sm:hidden uppercase">{lang === 'en' ? 'BN' : 'EN'}</span>
            </button>

          </div>
        </header>
      </div>

      {/* Global Submit Modal */}
      <SubmitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {}}
      />
    </>
  );
}
