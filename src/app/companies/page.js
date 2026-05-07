"use client";

import React, { useState, useEffect } from 'react';
import FeedCard from '@/components/FeedCard';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import { Search } from 'lucide-react';

export default function CompaniesPage() {
  const { t } = useTranslation();
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_hidden', false)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => 
    post.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const FeedSkeleton = () => (
    <div className="bg-[#1A1025] rounded-3xl p-4 mb-3 border border-white/5 relative">
      <div className="flex justify-between items-start mb-2">
        <div className="h-5 w-32 bg-white/10 rounded animate-pulse"></div>
        <div className="h-4 w-12 bg-white/10 rounded animate-pulse"></div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <div className="h-3 w-24 bg-white/10 rounded animate-pulse"></div>
      </div>
      <div className="space-y-2 mb-3">
        <div className="flex gap-2">
          <div className="h-5 w-20 bg-white/10 rounded animate-pulse"></div>
          <div className="h-5 w-24 bg-white/10 rounded animate-pulse"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-white/10 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full bg-white/10 rounded animate-pulse"></div>
        <div className="h-3 w-2/3 bg-white/10 rounded animate-pulse"></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen relative pb-24 pt-20">
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-6">
        
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-white/70" />
          </div>
          <input
            type="text"
            placeholder="Search by company or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-primary border-none rounded-full pl-12 pr-4 py-3.5 text-white placeholder:text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all shadow-lg shadow-primary/20 font-medium text-sm"
          />
        </div>

        {filteredPosts.length === 0 && !loading && (
          <div className="text-center py-20 opacity-60">
            <p className="text-lg">No opinions found.</p>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            <FeedSkeleton />
            <FeedSkeleton />
            <FeedSkeleton />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <FeedCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
