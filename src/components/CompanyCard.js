"use client";

import React from 'react';
import Link from 'next/link';
import { Star, Building2, Users, ChevronRight, TrendingUp, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function CompanyCard({ company }) {
  const { t } = useTranslation();

  const formatSalary = (salary) => {
    if (!salary) return null;
    if (salary >= 1000) {
      return `৳${(salary / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    }
    return `৳${salary}`;
  };

  return (
    <Link 
      href={`/company/${encodeURIComponent(company.name)}`}
      className="block group bg-card hover:bg-foreground/5 rounded-2xl p-4 border border-foreground/5 shadow-sm relative transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0 border border-foreground/10 group-hover:scale-105 transition-transform overflow-hidden">
          <Building2 className="w-6 h-6 text-foreground/40 group-hover:text-primary transition-colors" />
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-bold text-foreground text-[17px] truncate leading-tight group-hover:text-primary transition-colors">{company.name}</h3>
          <p className="text-[13px] text-foreground/50 mt-1 truncate font-medium">
            {company.reviewCount} {company.reviewCount === 1 ? 'entry' : 'entries'} 
            {company.averageSalary > 0 && (
              <>
                <span className="mx-1.5">•</span> 
                Avg {formatSalary(company.averageSalary)} BDT
              </>
            )}
            {company.averageRating > 0 && (
              <>
                <span className="mx-1.5">•</span> 
                ★ {company.averageRating.toFixed(1)}
              </>
            )}
          </p>
        </div>
        <div className="shrink-0 text-foreground/30 group-hover:text-foreground/70 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </Link>
  );
}
