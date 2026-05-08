"use client";

import React, { useState, useEffect, useMemo } from 'react';
import CompanyCard from '@/components/CompanyCard';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import { Search, Building2 } from 'lucide-react';

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
        .order('created_at', { ascending: false });

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
    const grouped = {};
    
    posts.forEach(post => {
      const name = post.company_name.trim();
      if (!grouped[name]) {
        grouped[name] = {
          name,
          totalRating: 0,
          ratingCount: 0,
          reviewCount: 0,
          pros: {},
          cons: {},
          roles: new Set()
        };
      }
      
      const company = grouped[name];
      company.reviewCount += 1;
      
      if (post.rating > 0) {
        company.totalRating += post.rating;
        company.ratingCount += 1;
      }
      
      if (post.likes && Array.isArray(post.likes)) {
        post.likes.forEach(tag => {
          if (tag !== 'Nothing') {
            company.pros[tag] = (company.pros[tag] || 0) + 1;
          }
        });
      }
      
      if (post.dislikes && Array.isArray(post.dislikes)) {
        post.dislikes.forEach(tag => {
          if (tag !== 'Nothing') {
            company.cons[tag] = (company.cons[tag] || 0) + 1;
          }
        });
      }
      
      if (post.role) company.roles.add(post.role.trim());
    });

    return Object.values(grouped).map(company => ({
      ...company,
      avgRating: company.ratingCount > 0 ? (company.totalRating / company.ratingCount).toFixed(1) : 0,
      topPros: Object.entries(company.pros).sort((a, b) => b[1] - a[1]).map(e => e[0]),
      topCons: Object.entries(company.cons).sort((a, b) => b[1] - a[1]).map(e => e[0]),
      roles: Array.from(company.roles)
    }));
  }, [posts]);

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.roles.some(role => role.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const Skeleton = () => (
    <div className="bg-card rounded-[32px] p-6 mb-4 border border-foreground/5 shadow-sm relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-foreground/5 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-5 w-32 bg-foreground/5 rounded animate-pulse"></div>
            <div className="h-3 w-24 bg-foreground/5 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="h-8 w-14 bg-foreground/5 rounded-xl animate-pulse"></div>
      </div>
      <div className="space-y-3 mb-4">
        <div className="flex gap-2">
          <div className="h-4 w-16 bg-foreground/5 rounded-lg animate-pulse"></div>
          <div className="h-4 w-20 bg-foreground/5 rounded-lg animate-pulse"></div>
        </div>
      </div>
      <div className="pt-4 border-t border-foreground/5 flex justify-between">
        <div className="h-3 w-24 bg-foreground/5 rounded animate-pulse"></div>
        <div className="h-5 w-5 bg-foreground/5 rounded animate-pulse"></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen relative pb-24 pt-20">
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-6">
        
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-foreground/30" />
          </div>
          <input
            type="text"
            placeholder="Search by company or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-foreground/5 rounded-[24px] pl-14 pr-6 py-4 text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm font-medium"
          />
        </div>

        <div className="flex items-center gap-2 mb-6 px-1">
          <Building2 className="w-4 h-4 text-primary" />
          <p className="text-xs font-black text-foreground/40 uppercase tracking-widest">
            {filteredCompanies.length} Featured Companies
          </p>
        </div>

        {filteredCompanies.length === 0 && !loading && (
          <div className="text-center py-20 opacity-40">
            <Building2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-bold">No companies found.</p>
            <p className="text-sm">Try a different search term.</p>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCompanies.map(company => (
              <CompanyCard key={company.name} company={company} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
