"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { Globe, Search, Plus, Menu, X, Home, Building2 } from 'lucide-react';
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
        <header className="w-full sm:max-w-fit mx-auto bg-card/95 backdrop-blur-xl border border-foreground/10 shadow-xl rounded-[28px] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
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

              {!pathname.startsWith('/company/') && (
                <>
                  <div className="w-px h-5 bg-foreground/10 shrink-0" />
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/20 text-sm font-medium tap-animation text-primary whitespace-nowrap"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'বাংলা' : 'English'}</span>
                  </button>
                </>
              )}
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
              className="sm:hidden p-2 rounded-full hover:bg-foreground/5 text-foreground transition-all duration-300 z-[60]"
              aria-label="Toggle menu"
            >
              <div className={`transition-all duration-300 ${isMenuOpen ? 'rotate-90 scale-110' : 'rotate-0 scale-100'}`}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </div>
            </button>
          </div>
        </header>
      </div>

      {/* Mobile Right-Side Drawer */}
      <div 
        className={`fixed inset-0 z-40 sm:hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMenuOpen ? 'visible' : 'invisible pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/5 backdrop-blur-sm transition-opacity duration-500 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Drawer Panel - Sleek & Modern floating design */}
        <div 
          className={`absolute right-3 top-20 bottom-3 w-[240px] bg-card/80 backdrop-blur-2xl border border-foreground/10 shadow-2xl rounded-[32px] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden flex flex-col ${
            isMenuOpen ? 'translate-x-0 scale-100' : 'translate-x-[110%] scale-95'
          }`}
        >
          <div className="flex flex-col h-full p-5">
            <div className="flex items-center gap-2 px-2 mb-8 mt-2">
              <div className="w-1.5 h-6 bg-primary rounded-full" />
              <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">Menu</p>
            </div>
            
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-base font-bold transition-all ${
                  pathname === '/'
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                <Home className={`w-5 h-5 ${pathname === '/' ? 'text-white' : 'text-primary'}`} />
                <span>Home</span>
              </Link>
              <Link
                href="/companies"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-base font-bold transition-all ${
                  pathname.startsWith('/company') || pathname === '/companies'
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                <Building2 className={`w-5 h-5 ${pathname === '/companies' ? 'text-white' : 'text-primary'}`} />
                <span>Companies</span>
              </Link>
            </nav>

            <div className="mt-auto space-y-3">
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-primary text-white font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span>SHARE EXPERIENCE</span>
              </button>

              {!pathname.startsWith('/company/') && (
                <button
                  onClick={() => {
                    toggleLanguage();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground font-black text-xs tracking-wider transition-colors"
                >
                  <Globe className="w-4 h-4 text-primary" />
                  <span>{lang === 'en' ? 'বাংলা' : 'ENGLISH'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <SubmitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {}}
      />
    </>
  );
}
