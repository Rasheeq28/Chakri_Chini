"use client";

import React from 'react';
import Link from 'next/link';
import { Star, Building2, ChevronRight, MessageSquare, Briefcase } from 'lucide-react';

export default function CompanyCard({ company }) {
  const { name, avgRating, reviewCount, topPros, topCons, roles } = company;

  return (
    <Link 
      href={`/company/${encodeURIComponent(name)}`}
      className="block bg-card rounded-[32px] p-6 mb-4 border border-foreground/5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Building2 className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-xl leading-tight group-hover:text-primary transition-colors">{name}</h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-foreground/50 font-medium">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {roles.length} {roles.length === 1 ? 'Role' : 'Roles'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 bg-yellow-400/10 px-3 py-1.5 rounded-xl border border-yellow-400/20">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-black text-foreground">{avgRating || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Top Highlights Preview */}
      <div className="space-y-3 mb-4">
        {topPros.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {topPros.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] bg-green-500/5 text-green-600 px-2.5 py-1 rounded-lg font-bold border border-green-500/10">
                {tag}
              </span>
            ))}
          </div>
        )}
        {topCons.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {topCons.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] bg-red-500/5 text-red-600 px-2.5 py-1 rounded-lg font-bold border border-red-500/10">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-foreground/5 mt-auto">
        <p className="text-xs font-bold text-foreground/30 uppercase tracking-widest">Tap to see full pulse</p>
        <ChevronRight className="w-5 h-5 text-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}
