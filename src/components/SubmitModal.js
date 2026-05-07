"use client";

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { X, Star, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SubmitModal({ isOpen, onClose, onSuccess, initialCompany = '', initialRole = '' }) {
  const { t, lang } = useTranslation();
  
  const [formData, setFormData] = useState({
    company_name: '',
    role: '',
    salary: '',
    rating: 0,
    likes: [],
    dislikes: [],
    experience_text: '',
    hiring_difficulty: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        company_name: initialCompany,
        role: initialRole,
        salary: '',
        rating: 0,
        likes: [],
        dislikes: [],
        experience_text: '',
        hiring_difficulty: ''
      });
      setError(null);
    }
  }, [isOpen, initialCompany, initialRole]);

  if (!isOpen) return null;



  // For translation fallbacks inside component
  function getLikeOptions() {
    return [
      t('like_options', 'good_salary'),
      t('like_options', 'growth'),
      t('like_options', 'learning'),
      t('like_options', 'culture'),
      t('like_options', 'flexible_hours'),
      t('like_options', 'nothing')
    ];
  }

  function getDislikeOptions() {
    return [
      t('dislike_options', 'late_salary'),
      t('dislike_options', 'underpaid'),
      t('dislike_options', 'overwork'),
      t('dislike_options', 'toxic_environment'),
      t('dislike_options', 'poor_management'),
      t('dislike_options', 'nothing')
    ];
  }

  const toggleChip = (type, value) => {
    setFormData(prev => {
      const current = prev[type];
      if (current.includes(value)) {
        return { ...prev, [type]: current.filter(item => item !== value) };
      }
      if (current.length >= 3) return prev;
      return { ...prev, [type]: [...current, value] };
    });
  };

  const containsContactInfo = (text) => {
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
    const phoneRegex = /(?:\+?88)?01[3-9]\d{8}/;
    return emailRegex.test(text) || phoneRegex.test(text);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (containsContactInfo(formData.experience_text)) {
      setError("Please do not include emails or phone numbers.");
      return;
    }

    setIsSubmitting(true);

    const postData = {
      company_name: formData.company_name.trim(),
      role: formData.role.trim(),
      salary: formData.salary ? parseInt(formData.salary, 10) : null,
      rating: formData.rating > 0 ? formData.rating : null,
      likes: formData.likes,
      dislikes: formData.dislikes,
      experience_text: formData.experience_text.trim() || null,
      hiring_difficulty: formData.hiring_difficulty || null,
    };

    try {
      const { data, error: sbError } = await supabase
        .from('posts')
        .insert([postData])
        .select();

      if (sbError) throw sbError;
      
      onSuccess(data[0]);
      
      // Reset form
      setFormData({
        company_name: '', role: '', salary: '', rating: 0,
        likes: [], dislikes: [], experience_text: '',
        hiring_difficulty: ''
      });
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to share experience. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/90 flex flex-col sm:p-4 animate-in slide-in-from-bottom-full duration-300">
      <div className="flex-1 bg-background sm:bg-card sm:rounded-2xl sm:max-w-md sm:mx-auto sm:w-full flex flex-col relative sm:border sm:border-foreground/10 sm:shadow-2xl sm:max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-foreground/5 sticky top-0 bg-inherit z-10 sm:rounded-t-2xl">
          <h2 className="text-xl font-bold text-foreground">{t('share_experience')}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-foreground/10 transition-colors bg-foreground/5"
          >
            <X className="w-5 h-5 text-foreground/70" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
          <form id="experience-form" onSubmit={handleSubmit} className="space-y-6 pb-24">
            
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1.5">{t('company_name')} *</label>
                <input 
                  required
                  maxLength={50}
                  type="text"
                  value={formData.company_name}
                  onChange={e => setFormData({...formData, company_name: e.target.value})}
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                  placeholder="e.g. Acme Corp"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1.5">{t('role')} *</label>
                <input 
                  required
                  maxLength={50}
                  type="text"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                  placeholder="e.g. Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1.5">{t('salary')}</label>
                <input 
                  type="number"
                  min="0"
                  max="1000000"
                  value={formData.salary}
                  onChange={e => setFormData({...formData, salary: e.target.value})}
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                  placeholder="e.g. 50000"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">{t('rating')} *</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({...formData, rating: star})}
                    className="p-2 transition-transform tap-animation"
                  >
                    <Star 
                      className={`w-8 h-8 ${formData.rating >= star ? 'fill-[#FACC15] text-[#FACC15]' : 'text-foreground/30'}`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Hiring Difficulty Likert Scale */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-medium text-foreground/70">{t('hiring_difficulty_q')} *</label>
              </div>
              <div className="bg-foreground/5 rounded-xl p-4 border border-foreground/10">
                <div className="flex justify-between items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((level) => {
                    const isSelected = formData.hiring_difficulty === level.toString();
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData({...formData, hiring_difficulty: level.toString()})}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all tap-animation
                          ${isSelected 
                            ? 'bg-primary text-white shadow-md scale-110' 
                            : 'bg-background border border-foreground/10 text-foreground/60 hover:bg-foreground/10'}`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-foreground/50 font-medium px-1">
                  <span>Very Easy</span>
                  <span>Extremely Hard</span>
                </div>
              </div>
            </div>

            {/* Likes */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-medium text-foreground/70">{t('likes')} *</label>
                <span className="text-xs text-foreground/50">{formData.likes.length}/3</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {getLikeOptions().map(option => {
                  const isSelected = formData.likes.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleChip('likes', option)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border tap-animation
                        ${isSelected 
                          ? 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/50' 
                          : 'bg-foreground/5 text-foreground/60 border-foreground/10 hover:bg-foreground/10'}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dislikes */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-medium text-foreground/70">{t('dislikes')} *</label>
                <span className="text-xs text-foreground/50">{formData.dislikes.length}/3</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {getDislikeOptions().map(option => {
                  const isSelected = formData.dislikes.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleChip('dislikes', option)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border tap-animation
                        ${isSelected 
                          ? 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/50' 
                          : 'bg-foreground/5 text-foreground/60 border-foreground/10 hover:bg-foreground/10'}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Experience Text */}
            <div>
              <div className="flex justify-between items-end mb-1.5">
                <label className="block text-sm font-medium text-foreground/70">{t('short_experience')} (Max 120 characters) *</label>
                <span className={`text-xs ${formData.experience_text.length > 120 ? 'text-[#EF4444]' : 'text-foreground/50'}`}>
                  {formData.experience_text.length} / 120 characters
                </span>
              </div>
              <textarea 
                maxLength={120}
                rows={3}
                value={formData.experience_text}
                onChange={e => setFormData({...formData, experience_text: e.target.value})}
                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all resize-none"
                placeholder={t('respectful_warning')}
              />
            </div>
            
          </form>
        </div>

        {/* Sticky Footer */}
        <div className="p-4 border-t border-foreground/5 bg-background sm:bg-card sm:rounded-b-2xl pb-safe">
          <button
            type="submit"
            form="experience-form"
            disabled={isSubmitting || !formData.company_name || !formData.role || formData.likes.length === 0 || formData.dislikes.length === 0 || formData.experience_text.length > 120 || formData.rating === 0 || !formData.hiring_difficulty}
            className="w-full flex items-center justify-center gap-2 bg-secondary hover:opacity-90 text-foreground font-bold py-3.5 px-4 rounded-xl transition-all tap-animation disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
            ) : (
              <>
                <span>{t('submit')}</span>
                <Check className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
