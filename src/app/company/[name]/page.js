"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Flag, AlertTriangle, Plus } from 'lucide-react';
import FeedCard from '@/components/FeedCard';
import { supabase } from '@/lib/supabase';
import { useTranslation } from '@/lib/i18n';
import SubmitModal from '@/components/SubmitModal';

export default function CompanyPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  
  const companyName = decodeURIComponent(params.name);
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoleForModal, setSelectedRoleForModal] = useState("");
  const [addedToCompare, setAddedToCompare] = useState(false);

  useEffect(() => {
    const fetchCompanyPosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('is_hidden', false)
          .ilike('company_name', companyName)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error("Error fetching company posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyPosts();

    // Check if already in compare list
    const currentList = JSON.parse(localStorage.getItem('compareList') || '[]');
    if (currentList.includes(companyName)) {
      setAddedToCompare(true);
    }
  }, [companyName]);

  const stats = useMemo(() => {
    if (!posts.length) return null;
    
    let totalRating = 0;
    let ratingCount = 0;
    let minSalary = Infinity;
    let maxSalary = -Infinity;
    
    let totalHiringDiff = 0;
    let hiringDiffCount = 0;
    
    const proCounts = {};
    const conCounts = {};
    const roleStats = {};

    posts.forEach(post => {
      if (post.rating > 0) {
        totalRating += post.rating;
        ratingCount += 1;
      }
      
      const sal = Number(post.salary);
      if (sal > 0) {
        if (sal < minSalary) minSalary = sal;
        if (sal > maxSalary) maxSalary = sal;
      }

      if (post.hiring_difficulty) {
        const diffNum = Number(post.hiring_difficulty);
        if (!isNaN(diffNum)) {
          totalHiringDiff += diffNum;
          hiringDiffCount += 1;
        }
      }
      
      if (post.likes && Array.isArray(post.likes)) {
        post.likes.forEach(tag => proCounts[tag] = (proCounts[tag] || 0) + 1);
      }
      if (post.dislikes && Array.isArray(post.dislikes)) {
        post.dislikes.forEach(tag => conCounts[tag] = (conCounts[tag] || 0) + 1);
      }
      
      const role = post.role ? post.role.trim() : 'Unknown Role';
      if (!roleStats[role]) roleStats[role] = { count: 0, min: Infinity, max: -Infinity };
      roleStats[role].count += 1;
      if (sal > 0) {
        if (sal < roleStats[role].min) roleStats[role].min = sal;
        if (sal > roleStats[role].max) roleStats[role].max = sal;
      }
    });

    const avgRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0;
    
    let topPro = null;
    let topCon = null;
    const sortedPros = Object.entries(proCounts).sort((a, b) => b[1] - a[1]);
    if (sortedPros.length > 0) topPro = sortedPros[0][0];
    const sortedCons = Object.entries(conCounts).sort((a, b) => b[1] - a[1]);
    if (sortedCons.length > 0) topCon = sortedCons[0][0];
    
    const avgHiringDiff = hiringDiffCount > 0 ? (totalHiringDiff / hiringDiffCount) : null;
    let hiringDiffText = 'N/A';
    if (avgHiringDiff !== null) {
      if (avgHiringDiff <= 1.5) hiringDiffText = 'Very Easy';
      else if (avgHiringDiff <= 2.5) hiringDiffText = 'Easy';
      else if (avgHiringDiff <= 3.5) hiringDiffText = 'Moderate';
      else if (avgHiringDiff <= 4.5) hiringDiffText = 'Hard';
      else hiringDiffText = 'Extremely Hard';
    }
    
    return {
      avgRating,
      minSalary: minSalary === Infinity ? null : minSalary,
      maxSalary: maxSalary === -Infinity ? null : maxSalary,
      topPro,
      topCon,
      avgHiringDiff,
      hiringDiffText,
      roleStats: Object.entries(roleStats)
        .map(([role, data]) => ({ role, ...data }))
        .sort((a, b) => b.count - a.count)
    };
  }, [posts]);

  const formatSalary = (salary) => {
    if (!salary) return 'N/A';
    if (salary >= 1000) {
      return `${(salary / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    }
    return `${salary}`;
  };

  const FeedSkeleton = () => (
    <div className="bg-card rounded-2xl p-4 mb-3 border border-foreground/5 shadow-sm">
      <div className="h-5 w-32 bg-foreground/10 rounded animate-pulse mb-2"></div>
      <div className="h-4 w-24 bg-foreground/10 rounded animate-pulse mb-4"></div>
      <div className="h-3 w-full bg-foreground/10 rounded animate-pulse mb-2"></div>
      <div className="h-3 w-2/3 bg-foreground/10 rounded animate-pulse"></div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen relative pb-24 pt-16">
      
      {/* App Bar matches betonkemon */}
      <header className="border-b border-foreground/5 bg-background sticky top-0 z-40">
        <div className="max-w-md w-full mx-auto px-4 h-14 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-foreground font-medium hover:text-foreground/70 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex items-center gap-4">
            {/* Action buttons could go here */}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-6">
        {/* Company Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground leading-tight">{companyName}</h1>
              <p className="text-foreground/50 text-sm mt-1">Tech / Corporate</p>
            </div>
          </div>
          <button 
            disabled={addedToCompare}
            onClick={() => {
              const currentList = JSON.parse(localStorage.getItem('compareList') || '[]');
              if (!currentList.includes(companyName) && currentList.length < 3) {
                currentList.push(companyName);
                localStorage.setItem('compareList', JSON.stringify(currentList));
                window.dispatchEvent(new Event('compare-updated'));
                setAddedToCompare(true);
              } else if (currentList.length >= 3) {
                // We'll just quietly fail or do a subtle UI update, but alert is bad UX.
                // For now, let's just not add it if it's 3.
              }
            }}
            className={`text-xs font-bold px-3 py-2 rounded-xl transition-colors
              ${addedToCompare 
                ? 'bg-green-500/10 text-green-600 cursor-default' 
                : 'text-primary bg-primary/10 hover:bg-primary/20'}`}
          >
            {addedToCompare ? '✓ Added' : '+ Compare'}
          </button>
        </div>

        {/* Top Summary Cards */}
        {stats && (
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-card rounded-2xl p-4 border border-foreground/5 shadow-sm text-center">
              <p className="text-2xl font-black text-foreground mb-1">{posts.length}</p>
              <p className="text-xs font-medium text-foreground/50">people shared</p>
            </div>
            <div className="bg-card rounded-2xl p-4 border border-foreground/5 shadow-sm text-center">
              <p className="text-2xl font-black text-foreground mb-1">
                {stats.minSalary && stats.maxSalary 
                  ? `${formatSalary(stats.minSalary)}${stats.minSalary !== stats.maxSalary ? `–${formatSalary(stats.maxSalary)}` : ''}`
                  : 'N/A'
                }
              </p>
              <p className="text-xs font-medium text-foreground/50">Salary range (BDT)</p>
            </div>
          </div>
        )}

        {/* Company Features Grid */}
        {stats && (
          <div className="mb-8">
            <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-3">Company Insights</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card rounded-xl p-3 border border-foreground/5 shadow-sm">
                <p className="text-xs text-foreground/50 mb-1 flex items-center gap-1.5"><Flag className="w-3.5 h-3.5 text-foreground/40"/> Top Highlight</p>
                <p className="font-bold text-foreground text-sm truncate">{stats.topPro || 'N/A'}</p>
              </div>
              <div className="bg-card rounded-xl p-3 border border-foreground/5 shadow-sm">
                <p className="text-xs text-foreground/50 mb-1 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-foreground/40"/> Top Concern</p>
                <p className="font-bold text-foreground text-sm truncate">{stats.topCon || 'N/A'}</p>
              </div>
              <div className="bg-card rounded-xl p-3 border border-foreground/5 shadow-sm">
                <p className="text-xs text-foreground/50 mb-1">Overall Rating</p>
                <p className="font-bold text-foreground text-sm">{stats.avgRating > 0 ? `★ ${stats.avgRating} / 5.0` : 'N/A'}</p>
              </div>
              <div className="bg-card rounded-xl p-3 border border-foreground/5 shadow-sm flex flex-col justify-center">
                <p className="text-xs text-foreground/50 mb-1">Hiring Difficulty</p>
                <p className="font-bold text-foreground text-sm truncate">{stats.hiringDiffText}</p>
              </div>
            </div>
          </div>
        )}

        {/* Roles List */}
        {stats && stats.roleStats.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-3">Roles & Salaries</p>
            <div className="bg-card rounded-2xl border border-foreground/5 shadow-sm overflow-hidden">
              {stats.roleStats.map((role, idx) => (
                <div key={role.role} className={`p-4 sm:px-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${idx !== stats.roleStats.length - 1 ? 'border-b border-foreground/5' : ''}`}>
                  <div>
                    <h3 className="font-bold text-foreground text-base leading-tight mb-1">{role.role}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-foreground">
                        {role.min !== Infinity && role.max !== -Infinity 
                          ? `${formatSalary(role.min)}${role.min !== role.max ? `–${formatSalary(role.max)}` : ''} BDT`
                          : 'Hidden'
                        }
                      </span>
                      <span className="text-xs text-foreground/50 font-medium">• {role.count} {role.count === 1 ? 'person' : 'people'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-3 sm:gap-2">
                    <button 
                      onClick={() => {
                        setSelectedRoleForModal(role.role);
                        setIsModalOpen(true);
                      }}
                      className="text-primary font-bold text-sm hover:text-primary/80 transition-colors flex items-center gap-1"
                    >
                      + Add experience
                    </button>
                    <button className="text-foreground/30 hover:text-foreground/70 transition-colors" title="Flag as suspicious">
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Posts Feed */}
        <div className="mb-8">
          <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-3">Recent Experiences</p>
          {loading ? (
            <div className="space-y-3">
              <FeedSkeleton />
              <FeedSkeleton />
              <FeedSkeleton />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-10 opacity-60">
              <p className="text-sm">No posts found for this company.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map(post => (
                <FeedCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-4 z-20 pointer-events-none flex justify-end">
        <button
          onClick={() => {
            setSelectedRoleForModal("");
            setIsModalOpen(true);
          }}
          className="pointer-events-auto flex items-center justify-center gap-2 bg-primary text-white font-bold py-3.5 px-6 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all tap-animation"
        >
          <Plus className="w-5 h-5" />
          <span>My Experience</span>
        </button>
      </div>

      <SubmitModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={(newPost) => setPosts(prev => [newPost, ...prev])}
        initialCompany={companyName}
        initialRole={selectedRoleForModal}
      />
    </div>
  );
}
