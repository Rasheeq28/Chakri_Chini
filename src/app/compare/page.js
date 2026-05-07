"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, Building2, AlertTriangle, Flag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useTranslation } from '@/lib/i18n';

export default function ComparePage() {
  const [compareList, setCompareList] = useState([]);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('compareList') || '[]');
    setCompareList(list);
    
    if (list.length > 0) {
      fetchData(list);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchData = async (companies) => {
    setLoading(true);
    try {
      const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .in('company_name', companies)
        .eq('is_hidden', false);

      if (error) throw error;

      // Group posts by company
      const companyData = {};
      companies.forEach(c => companyData[c] = []);
      posts.forEach(p => {
        if (companyData[p.company_name]) {
          companyData[p.company_name].push(p);
        }
      });

      setData(companyData);
    } catch (err) {
      console.error("Error fetching compare data:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeCompany = (company) => {
    const newList = compareList.filter(c => c !== company);
    setCompareList(newList);
    localStorage.setItem('compareList', JSON.stringify(newList));
    window.dispatchEvent(new Event('compare-updated'));
  };

  const calculateStats = (posts) => {
    if (!posts || posts.length === 0) return null;
    
    let totalRating = 0;
    let ratingCount = 0;
    let minSalary = Infinity;
    let maxSalary = -Infinity;
    let totalHiringDiff = 0;
    let hiringDiffCount = 0;
    
    const proCounts = {};
    const conCounts = {};

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
      count: posts.length,
      avgRating,
      minSalary: minSalary === Infinity ? null : minSalary,
      maxSalary: maxSalary === -Infinity ? null : maxSalary,
      topPro,
      topCon,
      hiringDiffText
    };
  };

  const formatSalary = (salary) => {
    if (!salary) return 'N/A';
    if (salary >= 1000) {
      return `${(salary / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    }
    return `${salary}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background text-foreground">
        <p className="font-bold text-foreground/50 animate-pulse">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative pb-24 bg-background">
      <header className="border-b border-foreground/5 bg-background sticky top-0 z-40">
        <div className="max-w-md w-full mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-foreground font-medium hover:text-foreground/70 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <div className="text-foreground/50 text-sm font-medium">Compare</div>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto px-4 py-6 max-w-4xl overflow-x-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Compare Companies</h1>
        
        {compareList.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-foreground/50 mb-4">No companies selected for comparison.</p>
            <Link href="/" className="bg-primary hover:opacity-90 text-white font-bold py-2.5 px-6 rounded-xl transition-all">
              Discover Companies
            </Link>
          </div>
        ) : (
          <div className="flex gap-4 pb-8 min-w-max">
            {compareList.map(company => {
              const stats = calculateStats(data[company]);
              return (
                <div key={company} className="w-72 shrink-0 bg-card border border-foreground/5 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                  {/* Header */}
                  <div className="p-5 border-b border-foreground/5 relative">
                    <button 
                      onClick={() => removeCompany(company)}
                      className="absolute top-4 right-4 text-foreground/20 hover:text-red-500 transition-colors"
                      title="Remove from comparison"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground leading-tight truncate pr-6">{company}</h2>
                    <p className="text-xs text-foreground/50 font-medium mt-1">Based on {stats ? stats.count : 0} reviews</p>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5 flex flex-col gap-5 flex-1 bg-foreground/[0.02]">
                    {!stats ? (
                      <p className="text-sm text-foreground/40 italic text-center my-auto">Not enough data.</p>
                    ) : (
                      <>
                        {/* Rating */}
                        <div>
                          <p className="text-xs text-foreground/50 font-bold uppercase tracking-wider mb-1">Overall Rating</p>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-foreground">{stats.avgRating}</span>
                            <span className="text-sm text-foreground/40">/ 5.0</span>
                          </div>
                        </div>
                        
                        {/* Salary */}
                        <div>
                          <p className="text-xs text-foreground/50 font-bold uppercase tracking-wider mb-1">Salary Range</p>
                          <p className="text-lg font-bold text-foreground">
                            {stats.minSalary && stats.maxSalary 
                              ? `${formatSalary(stats.minSalary)}${stats.minSalary !== stats.maxSalary ? `–${formatSalary(stats.maxSalary)}` : ''} BDT`
                              : 'N/A'
                            }
                          </p>
                        </div>
                        
                        {/* Hiring Difficulty */}
                        <div>
                          <p className="text-xs text-foreground/50 font-bold uppercase tracking-wider mb-1">Hiring Difficulty</p>
                          <p className={`inline-block px-2.5 py-1 rounded-lg text-sm font-bold border 
                            ${stats.hiringDiffText === 'Extremely Hard' || stats.hiringDiffText === 'Hard' ? 'bg-red-500/10 text-red-600 border-red-500/20' : 
                              stats.hiringDiffText === 'Very Easy' || stats.hiringDiffText === 'Easy' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 
                              'bg-orange-500/10 text-orange-600 border-orange-500/20'
                            }`}
                          >
                            {stats.hiringDiffText}
                          </p>
                        </div>
                        
                        {/* Top Pro */}
                        <div>
                          <p className="text-xs text-foreground/50 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><Flag className="w-3.5 h-3.5"/> Top Highlight</p>
                          <p className="text-sm font-bold text-foreground truncate">{stats.topPro || 'N/A'}</p>
                        </div>
                        
                        {/* Top Con */}
                        <div>
                          <p className="text-xs text-foreground/50 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5"/> Top Concern</p>
                          <p className="text-sm font-bold text-foreground truncate">{stats.topCon || 'N/A'}</p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Action */}
                  <div className="p-4 bg-background border-t border-foreground/5">
                    <Link href={`/company/${encodeURIComponent(company)}`} className="block w-full py-2.5 text-center text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-colors">
                      View Full Profile
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
