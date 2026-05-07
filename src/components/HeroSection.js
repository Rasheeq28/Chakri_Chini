"use client";

import React from 'react';
import { Building2, TrendingUp, Users, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function HeroSection({ onShareClick, onExploreClick, companiesCount = 0, postsCount = 0 }) {
  const { t } = useTranslation();

  return (
    <section className="relative pt-28 pb-16 overflow-hidden">
      {/* Background Decor handled globally in globals.css now */}

      <div className="max-w-6xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
        {/* Left: Copy & CTAs */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
            <ShieldCheck className="w-4 h-4" />
            <span>Community-Powered Transparency</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight tracking-tight mb-6">
            Know Companies <br className="hidden md:block" />
            <span className="text-primary">Before You Apply</span>
          </h1>
          
          <p className="text-lg text-foreground/70 mb-4 max-w-2xl mx-auto md:mx-0 leading-relaxed">
            Explore real interview experiences, workplace culture, salaries, and honest company insights shared by students and professionals across Bangladesh.
          </p>
          
          <p className="text-foreground/90 font-medium mb-8 max-w-2xl mx-auto md:mx-0">
            Stop applying blindly. Make smarter career decisions through transparent, community-driven experiences.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <button 
              onClick={onExploreClick}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 tap-animation"
            >
              <span>Explore Experiences</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button 
              onClick={onShareClick}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-card border-2 border-foreground/10 text-foreground font-bold hover:bg-foreground/5 hover:border-foreground/20 transition-all flex items-center justify-center gap-2 tap-animation"
            >
              <span>Share Experience</span>
            </button>
          </div>

          {/* Live Stats */}
          <div className="flex items-center gap-6 mt-8 md:justify-start justify-center">
            <div>
              <p className="text-2xl font-black text-foreground">{companiesCount}</p>
              <p className="text-xs font-medium text-foreground/50 uppercase tracking-wide">Companies</p>
            </div>
            <div className="w-px h-8 bg-foreground/10" />
            <div>
              <p className="text-2xl font-black text-primary">{postsCount}</p>
              <p className="text-xs font-medium text-foreground/50 uppercase tracking-wide">Experiences Shared</p>
            </div>
          </div>
        </div>

        {/* Right: Floating Insight Cards Visuals */}
        <div className="flex-1 w-full max-w-md md:max-w-none relative h-[400px] hidden sm:block">
          {/* Card 1 — Hiring Difficulty */}
          <div className="absolute top-4 right-10 bg-card rounded-2xl p-5 shadow-xl border border-foreground/5 w-[280px] rotate-2 hover:rotate-0 transition-transform z-20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-primary">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Hiring Difficulty · Grameenphone</p>
                <p className="font-bold text-foreground">Extremely Competitive</p>
              </div>
            </div>
            <div className="flex gap-1 mt-1">
              {[1,2,3,4,5].map(i => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 5 ? 'bg-primary' : 'bg-foreground/10'}`} />
              ))}
            </div>
          </div>

          {/* Card 2 — Workplace Culture */}
          <div className="absolute top-1/2 left-4 -translate-y-1/2 bg-card rounded-2xl p-5 shadow-xl border border-foreground/5 w-[300px] -rotate-3 hover:rotate-0 transition-transform z-30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#E0F2FE] flex items-center justify-center text-[#0284C7]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Anonymous Review · bKash</p>
                <p className="font-bold text-foreground">"Great WLB, slow promotions"</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="text-[11px] bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full font-bold">Work-Life Balance</span>
              <span className="text-[11px] bg-orange-50 text-primary border border-orange-100 px-2 py-0.5 rounded-full font-bold">Avg Growth</span>
            </div>
          </div>

          {/* Card 3 — Salary Signal */}
          <div className="absolute bottom-10 right-4 bg-card rounded-2xl p-5 shadow-xl border border-foreground/5 w-[260px] rotate-6 hover:rotate-0 transition-transform z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Salary Range · BRAC Bank</p>
                <p className="font-bold text-foreground">40k – 70k BDT / mo</p>
              </div>
            </div>
            <p className="text-xs text-foreground/40 mt-1">Based on 12 shared experiences</p>
          </div>
          
        </div>
      </div>
    </section>
  );
}
