"use client";

import React from 'react';
import Link from 'next/link';
import { Building2, TrendingUp, Users, ArrowRight, Star, AlertTriangle, Plus } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import SubmitModal from '@/components/SubmitModal';

// ─── Inline FeedCard (matches exact FeedCard style) ─────────────────────────
function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function getSentiment(rating) {
  if (!rating) return 'Mixed Reviews';
  if (rating >= 4) return 'Mostly Positive';
  if (rating <= 2) return 'Mostly Negative';
  return 'Mixed Reviews';
}

function HeroFeedCard({ post }) {
  const [reported, setReported] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);

  const handleReport = async () => {
    if (reported) return;
    setReported(true);
    setShowMenu(false);
    try {
      await supabase.rpc('increment_report', { row_id: post.id });
    } catch { setReported(false); }
  };

  const sentiment = getSentiment(post.rating);
  const sentimentColor =
    sentiment === 'Mostly Negative' ? 'text-red-500' :
    sentiment === 'Mostly Positive' ? 'text-green-500' :
    'text-foreground/60';

  return (
    <div className="bg-card rounded-3xl p-4 border border-foreground/5 shadow-sm relative transition-all flex flex-col gap-0">
      {/* Header */}
      <div className="flex justify-between items-start mb-1">
        <Link
          href={`/company/${encodeURIComponent(post.company_name)}`}
          className="hover:text-primary transition-colors"
          onClick={e => e.stopPropagation()}
        >
          <h3 className="font-bold text-foreground text-lg leading-tight">{post.company_name}</h3>
        </Link>
        <div className="flex items-center gap-2">
          {post.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#FACC15] text-[#FACC15]" />
              <span className="text-sm font-bold text-foreground">{post.rating}.0</span>
            </div>
          )}
          {/* Three-dot menu */}
          <div className="relative ml-2">
            <button
              onClick={() => setShowMenu(v => !v)}
              className="p-1 rounded-full hover:bg-foreground/10 text-foreground/50 transition-colors"
            >
              <span className="text-foreground/40 font-bold tracking-widest text-xs leading-none">···</span>
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-background border border-foreground/10 rounded-xl shadow-xl overflow-hidden z-10">
                <button
                  onClick={handleReport}
                  disabled={reported}
                  className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-foreground/5 transition-colors disabled:opacity-50"
                >
                  <AlertTriangle className={`w-3 h-3 ${reported ? 'text-foreground/50' : 'text-red-500'}`} />
                  <span className={`font-medium ${reported ? 'text-foreground/50' : 'text-red-500'}`}>
                    {reported ? 'Reported' : 'Report'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sentiment + timestamp */}
      <div className="flex items-center text-xs text-foreground/60 mb-4 font-medium">
        <span className={sentimentColor}>{sentiment}</span>
        <span className="mx-1.5">•</span>
        <span>{timeAgo(post.created_at)}</span>
      </div>

      {/* Tags */}
      {(post.dislikes?.length > 0 || post.likes?.length > 0) && (
        <div className="space-y-1.5 mb-3">
          {/* Dislike Tags — Red */}
          {post.dislikes?.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {post.dislikes.map(tag => (
                <span key={tag} className="text-[11px] bg-red-50 border border-red-200 text-red-600 px-2 py-0.5 rounded font-bold">
                  {tag === 'Nothing' ? 'Disliked Nothing' : tag}
                </span>
              ))}
            </div>
          )}
          {/* Like Tags — Green */}
          {post.likes?.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {post.likes.map(tag => (
                <span key={tag} className="text-[11px] bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded font-bold">
                  {tag === 'Nothing' ? 'Liked Nothing' : tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Opinion quote */}
      {post.experience_text && (
        <div className="mt-1">
          <p className="text-foreground/80 text-sm italic leading-relaxed">
            &ldquo;{post.experience_text}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main HeroSection ────────────────────────────────────────────────────────
export default function HeroSection({
  onExploreClick,
  companiesCount = 0,
  postsCount = 0,
  featuredPosts = [],
}) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <section className="relative pt-24 pb-0 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-start gap-10 pt-2 pb-6">

        {/* ── Left: Hero copy & CTA ── */}
        <div className="flex-1 text-center lg:text-left pt-2 lg:max-w-lg">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight tracking-tight mb-6">
            Know Companies <br className="hidden lg:block" />
            <span className="text-primary">Before You Apply</span>
          </h1>

          <p className="text-base sm:text-lg text-foreground/70 mb-4 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Explore real interview experiences, workplace culture, salaries, and honest company insights shared by students and professionals across Bangladesh.
          </p>

          <p className="text-sm sm:text-base text-foreground/90 font-medium mb-8 max-w-2xl mx-auto lg:mx-0">
            Stop applying blindly. Make smarter career decisions through transparent, community-driven experiences.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 tap-animation"
            >
              <span>Explore Experiences</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-card border border-foreground/10 text-foreground font-bold hover:bg-foreground/5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 tap-animation"
            >
              <Plus className="w-5 h-5 text-primary" />
              <span>Share Experience</span>
            </button>
          </div>
        </div>

        <SubmitModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => window.location.reload()} 
        />

        {/* ── Right: Feed cards + Live stats ── */}
        <div className="w-full lg:flex-1 flex flex-col gap-4">

          {/* Label with LIVE indicator */}
          <div className="flex items-center gap-2 justify-center lg:justify-start">
            <span className="live-dot inline-block w-2 h-2 rounded-full bg-primary shrink-0" />
            <p className="text-xs font-bold text-foreground/40 uppercase tracking-wider">
              Recent Experiences
            </p>
          </div>

          {/* 2 feed cards side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Skeleton while loading */}
            {featuredPosts.length === 0 && [1, 2].map(i => (
              <div key={i} className={`bg-card rounded-3xl p-4 border border-foreground/5 shadow-sm animate-pulse space-y-3 ${i === 1 ? 'hero-card-1' : 'hero-card-2'}`}>
                <div className="flex justify-between items-start">
                  <div className="h-4 w-32 bg-foreground/10 rounded" />
                  <div className="h-4 w-10 bg-foreground/10 rounded" />
                </div>
                <div className="h-3 w-24 bg-foreground/10 rounded" />
                <div className="flex gap-2">
                  <div className="h-5 w-20 bg-foreground/10 rounded" />
                  <div className="h-5 w-16 bg-foreground/10 rounded" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-full bg-foreground/10 rounded" />
                  <div className="h-3 w-3/4 bg-foreground/10 rounded" />
                </div>
              </div>
            ))}

            {/* Real posts as feed cards — animated */}
            {featuredPosts.map((post, idx) => (
              <div key={post.id} className={idx === 0 ? 'hero-card-1' : 'hero-card-2'}>
                <HeroFeedCard post={post} />
              </div>
            ))}
          </div>

          {/* Live stats — Responsive grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-card rounded-2xl border border-foreground/10 shadow-sm p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-foreground leading-none">{companiesCount}</p>
                <p className="text-[9px] sm:text-[10px] font-medium text-foreground/50 mt-0.5 uppercase tracking-wide">Companies</p>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-foreground/10 shadow-sm p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Users className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-primary leading-none">{postsCount}</p>
                <p className="text-[9px] sm:text-[10px] font-medium text-foreground/50 mt-0.5 uppercase tracking-wide">Experiences</p>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-foreground/10 shadow-sm p-3 sm:p-4 flex items-center gap-2 sm:gap-3 col-span-2 sm:col-span-1">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                <TrendingUp className="text-green-600 w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-bold text-foreground leading-none">Anonymous</p>
                <p className="text-[9px] sm:text-[10px] font-medium text-foreground/50 mt-0.5">Community Driven</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
