"use client";

import React, { useState, useEffect, useMemo } from 'react';
import CompanyCard from '@/components/CompanyCard';
import SubmitModal from '@/components/SubmitModal';
import HeroSection from '@/components/HeroSection';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import { Plus } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // Fetch a larger number of posts to build a directory
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_hidden', false)
        .order('created_at', { ascending: false })
        .limit(1000);

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

  const handlePostSuccess = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const companies = useMemo(() => {
    const map = new Map();
    
    posts.forEach(post => {
      const key = post.company_name.trim().toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          name: post.company_name.trim(),
          reviewCount: 0,
          totalRating: 0,
          ratingCount: 0,
          lastActivity: new Date(post.created_at).getTime(),
          totalSalary: 0,
          salaryCount: 0,
          proCounts: {},
          conCounts: {}
        });
      }
      
      const comp = map.get(key);
      comp.reviewCount += 1;
      
      if (post.rating > 0) {
        comp.totalRating += post.rating;
        comp.ratingCount += 1;
      }

      if (post.salary && post.salary > 0) {
        comp.totalSalary += Number(post.salary);
        comp.salaryCount += 1;
      }

      if (post.likes && Array.isArray(post.likes)) {
        post.likes.forEach(tag => {
          comp.proCounts[tag] = (comp.proCounts[tag] || 0) + 1;
        });
      }

      if (post.dislikes && Array.isArray(post.dislikes)) {
        post.dislikes.forEach(tag => {
          comp.conCounts[tag] = (comp.conCounts[tag] || 0) + 1;
        });
      }

      const postTime = new Date(post.created_at).getTime();
      if (postTime > comp.lastActivity) {
        comp.lastActivity = postTime;
      }
    });

    const result = Array.from(map.values()).map(comp => {
      // Find top pro
      let topPro = null;
      const sortedPros = Object.entries(comp.proCounts).sort((a, b) => b[1] - a[1]);
      if (sortedPros.length > 0) topPro = sortedPros[0][0];

      // Find top con
      let topCon = null;
      const sortedCons = Object.entries(comp.conCounts).sort((a, b) => b[1] - a[1]);
      if (sortedCons.length > 0) topCon = sortedCons[0][0];

      return {
        name: comp.name,
        reviewCount: comp.reviewCount,
        averageRating: comp.ratingCount > 0 ? comp.totalRating / comp.ratingCount : 0,
        averageSalary: comp.salaryCount > 0 ? comp.totalSalary / comp.salaryCount : null,
        topPro,
        topCon,
        lastActivity: comp.lastActivity
      };
    });

    result.sort((a, b) => b.lastActivity - a.lastActivity);

    return result;
  }, [posts]);

  const exploreRef = React.useRef(null);
  const handleExploreClick = () => exploreRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="flex flex-col min-h-screen relative pb-24">
      <HeroSection onShareClick={() => setIsModalOpen(true)} onExploreClick={handleExploreClick} companiesCount={companies.length} postsCount={posts.length} />

      <main ref={exploreRef} className="flex-1 max-w-md w-full mx-auto px-4 py-8">
        
        {/* Search */}
        <div className="relative mb-6">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-white/70">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input 
            type="text" 
            placeholder="Search companies..." 
            className="w-full bg-primary border-none rounded-full py-3.5 pl-12 pr-4 text-white placeholder:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 transition-all shadow-lg shadow-primary/20"
          />
        </div>




        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Companies</h2>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-foreground/50">Sort</span>
            <select className="bg-transparent text-foreground font-medium outline-none cursor-pointer border-none p-0">
              <option>Most shared</option>
              <option>Recent</option>
            </select>
          </div>
        </div>
        
        {companies.length === 0 && !loading && (
          <div className="text-center py-20 opacity-60">
            <p className="text-lg">{t('no_posts')}</p>
          </div>
        )}

        <div className="space-y-4">
          {companies.map(company => (
            <CompanyCard key={company.name} company={company} />
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-20">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white font-bold py-3.5 px-6 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all tap-animation"
        >
          <Plus className="w-5 h-5" />
          <span>{t('share_experience')}</span>
        </button>
      </div>

      <SubmitModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handlePostSuccess}
      />
    </div>
  );
}
