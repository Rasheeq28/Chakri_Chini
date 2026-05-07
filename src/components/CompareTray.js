"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layers, X } from 'lucide-react';

export default function CompareTray() {
  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = JSON.parse(localStorage.getItem('compareList') || '[]');
      setCompareList(stored);
    };

    handleStorageChange();
    
    // Listen for custom event from other components
    window.addEventListener('compare-updated', handleStorageChange);
    return () => window.removeEventListener('compare-updated', handleStorageChange);
  }, []);

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-40 pointer-events-none flex justify-center animate-in slide-in-from-bottom-10">
      <div className="pointer-events-auto bg-card border border-foreground/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl p-4 flex items-center justify-between gap-4 max-w-md w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-sm text-foreground">{compareList.length} {compareList.length === 1 ? 'Company' : 'Companies'}</p>
            <p className="text-xs text-foreground/50">Selected for comparison</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {compareList.length >= 2 ? (
            <Link 
              href="/compare"
              className="bg-primary hover:opacity-90 text-white font-bold py-2 px-4 rounded-xl text-sm transition-opacity"
            >
              Compare
            </Link>
          ) : (
            <Link href="/" className="text-xs font-bold text-primary px-3 py-2 bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors">
              Find another
            </Link>
          )}
          <button 
            onClick={() => {
              localStorage.setItem('compareList', JSON.stringify([]));
              window.dispatchEvent(new Event('compare-updated'));
            }}
            className="p-2 text-foreground/40 hover:text-foreground/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
