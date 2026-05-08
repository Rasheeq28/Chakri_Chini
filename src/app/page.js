"use client";

import React, { useState, useEffect, useMemo } from 'react';
import CompanyCard from '@/components/CompanyCard';
import HeroSection from '@/components/HeroSection';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const { t } = useTranslation();
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
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
          conCounts: {},
          recentPost: null,
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
        // Keep the most recent post's opinion fields
        comp.recentPost = {
          experience_text: post.experience_text || null,
          likes: post.likes || [],
          dislikes: post.dislikes || [],
          rating: post.rating || null,
          role: post.role || null,
        };
      }
    });

    const result = Array.from(map.values()).map(comp => {
      return {
        name: comp.name,
        reviewCount: comp.reviewCount,
        avgRating: comp.ratingCount > 0 ? (comp.totalRating / comp.ratingCount).toFixed(1) : 0,
        averageSalary: comp.salaryCount > 0 ? comp.totalSalary / comp.salaryCount : null,
        topPros: Object.entries(comp.proCounts).sort((a, b) => b[1] - a[1]).map(e => e[0]),
        topCons: Object.entries(comp.conCounts).sort((a, b) => b[1] - a[1]).map(e => e[0]),
        lastActivity: comp.lastActivity,
        recentPost: comp.recentPost,
        roles: Array.from(new Set(posts.filter(p => p.company_name === comp.name).map(p => p.role).filter(Boolean))),
      };
    });

    result.sort((a, b) => b.lastActivity - a.lastActivity);

    return result;
  }, [posts]);

  // 2 random posts from different companies that have actual opinion text
  const featuredPosts = React.useMemo(() => {
    const withText = posts.filter(p => p.experience_text && p.experience_text.trim().length > 0);
    const shuffled = [...withText].sort(() => Math.random() - 0.5);
    const picked = [];
    const usedCompanies = new Set();
    for (const post of shuffled) {
      const key = post.company_name.trim().toLowerCase();
      if (!usedCompanies.has(key)) {
        usedCompanies.add(key);
        picked.push(post);
        if (picked.length === 2) break;
      }
    }
    return picked;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts.length > 0]);

  const exploreRef = React.useRef(null);
  const handleExploreClick = () => exploreRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="flex flex-col min-h-screen relative pb-24">
      <HeroSection
        onExploreClick={handleExploreClick}
        companiesCount={companies.length}
        postsCount={posts.length}
        featuredCompanies={companies}
        featuredPosts={featuredPosts}
      />

      <main ref={exploreRef} className="flex-1 max-w-7xl w-full mx-auto px-4 pt-2 pb-8">

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

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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
    </div>
  );
}
