"use client";

import React from 'react';
import Link from 'next/link';
import { Star, Building2, ChevronRight, MessageSquare, Briefcase } from 'lucide-react';

export default function CompanyCard({ company }) {
  // Support both property names for better compatibility across pages
  const { 
    name, 
    reviewCount = 0, 
    roles = [], 
    topPros = [], 
    topCons = [] 
  } = company;

  const avgRating = company.avgRating || company.averageRating || 0;

  return (
    <Link 
      href={`/company/${encodeURIComponent(name)}`}
      className="block bg-card rounded-[24px] p-5 mb-3 border border-foreground/5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group"
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-foreground text-lg leading-tight truncate group-hover:text-primary transition-colors">{name}</h3>
            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-foreground/40 font-bold uppercase tracking-wider">
              <span>{reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}</span>
              <span>•</span>
              <span>{roles.length} {roles.length === 1 ? 'Role' : 'Roles'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-lg border border-yellow-400/10 shrink-0">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-black text-foreground">{avgRating || 'N/A'}</span>
        </div>
      </div>

      {/* Top Highlights Preview */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {topPros.slice(0, 2).map(tag => (
          <span key={tag} className="text-[10px] bg-green-500/5 text-green-600 px-2 py-0.5 rounded-md font-bold border border-green-500/10">
            {tag}
          </span>
        ))}
        {topCons.slice(0, 1).map(tag => (
          <span key={tag} className="text-[10px] bg-red-500/5 text-red-600 px-2 py-0.5 rounded-md font-bold border border-red-500/10">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-foreground/5 mt-auto opacity-60">
        <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.15em]">Tap to see more</p>
        <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  );
}
