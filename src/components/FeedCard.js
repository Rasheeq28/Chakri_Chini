"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, MoreHorizontal, AlertTriangle, ThumbsDown, ThumbsUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Helper for relative time
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
  if (!rating) return "Mixed Reviews";
  if (rating >= 4) return "Mostly Positive";
  if (rating <= 2) return "Mostly Negative";
  return "Mixed Reviews";
}

export default function FeedCard({ post }) {
  const [showMenu, setShowMenu] = useState(false);
  const [reported, setReported] = useState(false);

  const handleReport = async () => {
    if (reported) return;
    setReported(true);
    setShowMenu(false);

    try {
      const { data, error } = await supabase.rpc('increment_report', { row_id: post.id });
      if (error) {
        const { error: updateError } = await supabase
          .from('posts')
          .update({ report_count: post.report_count + 1 })
          .eq('id', post.id);
        if (updateError) {
           setReported(false);
        }
      }
    } catch (err) {
      setReported(false);
    }
  };

  const sentiment = getSentiment(post.rating);
  const timestamp = timeAgo(post.created_at);

  return (
    <div className="bg-card rounded-3xl p-4 mb-3 border border-foreground/5 shadow-sm relative transition-all">
      {/* 1 & 2: Company Name and Overall Rating */}
      <div className="flex justify-between items-start mb-1">
        <Link href={`/company/${encodeURIComponent(post.company_name)}`} className="hover:text-primary transition-colors">
          <h3 className="font-bold text-foreground text-lg leading-tight">{post.company_name}</h3>
        </Link>
        <div className="flex items-center gap-2">
          {post.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#FACC15] text-[#FACC15]" />
              <span className="text-sm font-bold text-foreground">{post.rating}.0</span>
            </div>
          )}
          {/* Context Menu inside Header */}
          <div className="relative ml-2">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-full hover:bg-foreground/10 text-foreground/50 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-background border border-foreground/10 rounded-xl shadow-xl overflow-hidden z-10">
                <button 
                  onClick={handleReport}
                  disabled={reported}
                  className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-foreground/5 transition-colors disabled:opacity-50"
                >
                  <AlertTriangle className={`w-3 h-3 ${reported ? 'text-foreground/50' : 'text-danger'}`} />
                  <span className={reported ? 'text-foreground/50 font-medium' : 'text-danger font-medium'}>
                    {reported ? 'Reported' : 'Report'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3: Sentiment Summary • Timestamp */}
      <div className="flex items-center text-xs text-foreground/60 mb-4 font-medium">
        <span className={sentiment === 'Mostly Negative' ? 'text-danger' : sentiment === 'Mostly Positive' ? 'text-[#22C55E]' : 'text-foreground/60'}>
          {sentiment}
        </span>
        <span className="mx-1.5">•</span>
        <span>{timestamp}</span>
      </div>

      {/* 4 & 5: Negative & Positive Tags */}
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

      {/* 6: Short Preview Text */}
      {post.experience_text && (
        <div className="mt-3">
          <p className="text-foreground/80 text-sm italic leading-relaxed">
            "{post.experience_text}"
          </p>
        </div>
      )}
    </div>
  );
}
