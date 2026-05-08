"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { Globe, Search, Plus, Menu, X } from 'lucide-react';
import SubmitModal from '@/components/SubmitModal';

export default function Header() {
  const { lang, toggleLanguage, t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/companies?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 pt-4 pb-2">
        <header className={`w-full ${isMenuOpen ? 'max-w-full rounded-3xl' : 'sm:max-w-fit rounded-full'} mx-auto bg-card/90 backdrop-blur-xl border border-foreground/10 shadow-lg overflow-hidden transition-all duration-300`}>
          <div className="px-3 sm:px-5 h-14 flex items-center justify-between sm:justify-start gap-2 sm:gap-3">

            {/* Logo - Always visible */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group px-1">
              <div className="w-7 h-7 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <Image src="/logo.png" alt="Chakri Chini Logo" width={28} height={28} className="object-contain" />
              </div>
              <h1 className="text-base font-bold text-foreground tracking-tight whitespace-nowrap leading-none self-center translate-y-px">
                {t('app_title')}
              </h1>
            </Link>

            {/* Desktop Navigation & Search */}
            <div className="hidden sm:flex items-center gap-3 flex-1">
              <div className="w-px h-5 bg-foreground/10 shrink-0" />
              
              <nav className="flex items-center gap-1">
                <Link
                  href="/"
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all tap-animation whitespace-nowrap ${
                    pathname === '/'
                      ? 'bg-foreground/10 text-foreground'
                      : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/companies"
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all tap-animation whitespace-nowrap ${
                    pathname.startsWith('/company') || pathname === '/companies'
                      ? 'bg-foreground/10 text-foreground'
                      : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                  }`}
                >
                  Companies
                </Link>
              </nav>

              <div className="w-px h-5 bg-foreground/10 shrink-0" />

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary/90 hover:shadow-md transition-all tap-animation whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Share Experience</span>
              </button>

              <div className="w-px h-5 bg-foreground/10 shrink-0" />

              <form onSubmit={handleSearch} className="flex items-center relative">
                <Search className="absolute left-3 w-3.5 h-3.5 text-white pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  className="bg-primary text-white placeholder:text-white text-sm rounded-full pl-8 pr-3 py-1.5 w-24 focus:outline-none focus:ring-2 focus:ring-white/50 font-medium transition-all focus:w-32"
                />
              </form>

              <div className="w-px h-5 bg-foreground/10 shrink-0" />

              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/20 text-sm font-medium tap-animation text-primary whitespace-nowrap"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'বাংলা' : 'English'}</span>
              </button>
            </div>

            {/* Mobile Centered Search - Only visible on small screens */}
            <div className="flex-1 flex justify-center sm:hidden">
              <form onSubmit={handleSearch} className="flex items-center relative w-full max-w-[140px]">
                <Search className="absolute left-3 w-3.5 h-3.5 text-white pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  className="bg-primary text-white placeholder:text-white text-sm rounded-full pl-8 pr-3 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-white/50 font-medium"
                />
              </form>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden p-2 rounded-full hover:bg-foreground/5 text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu Content */}
          {isMenuOpen && (
            <div className="sm:hidden border-t border-foreground/5 bg-card/50 px-4 py-4 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-200">
              <nav className="flex flex-col gap-1">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-2xl text-base font-bold transition-all ${
                    pathname === '/'
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:bg-foreground/5'
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/companies"
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-2xl text-base font-bold transition-all ${
                    pathname.startsWith('/company') || pathname === '/companies'
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:bg-foreground/5'
                  }`}
                >
                  Companies
                </Link>
              </nav>

              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20"
              >
                <Plus className="w-5 h-5" />
                <span>Share Experience</span>
              </button>

              <button
                onClick={() => {
                  toggleLanguage();
                  setIsMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground font-bold"
              >
                <Globe className="w-5 h-5 text-primary" />
                <span>{lang === 'en' ? 'বাংলা' : 'English'}</span>
              </button>
            </div>
          )}
        </header>
      </div>

      <SubmitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {}}
      />
    </>
  );
}

