"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const dictionaries = {
  en: {
    app_title: "Chakri Chini",
    share_experience: "Share Experience",
    company_name: "Company Name",
    role: "Role",
    salary: "Salary (Optional, BDT)",
    rating: "Overall Rating",
    likes: "Top 3 things you LIKE?",
    dislikes: "Top 3 things you DISLIKE?",
    short_experience: "Short Experience",
    submit: "Share Anonymously",
    cancel: "Cancel",
    report: "Report",
    reported_msg: "Post reported.",
    no_posts: "No posts yet. Be the first to share your experience!",
    loading: "Loading...",
    char_count: "chars max",
    like_options: {
      good_salary: "Good Salary",
      growth: "Growth",
      learning: "Learning",
      culture: "Culture",
      flexible_hours: "Flexible Hours",
      nothing: "Nothing"
    },
    dislike_options: {
      late_salary: "Late Salary",
      underpaid: "Underpaid",
      overwork: "Overwork",
      toxic_environment: "Toxic Environment",
      poor_management: "Poor Management",
      nothing: "Nothing"
    },
    max_3_selections: "Max 3 selections",
    respectful_warning: "Please keep it respectful",
    hiring_difficulty_q: "Hiring Difficulty",
    hiring_options: {
      easy: "Easy",
      moderate: "Moderate",
      hard: "Hard",
      competitive: "Extremely Competitive"
    }
  },
  bn: {
    app_title: "চাকরি চিনি",
    share_experience: "অভিজ্ঞতা শেয়ার করুন",
    company_name: "কোম্পানির নাম",
    role: "পদবি",
    salary: "বেতন (ঐচ্ছিক, টাকা)",
    rating: "সার্বিক রেটিং",
    likes: "আপনার কী ভালো লেগেছে? (সর্বোচ্চ ৩টি)",
    dislikes: "আপনার কী খারাপ লেগেছে? (সর্বোচ্চ ৩টি)",
    short_experience: "সংক্ষিপ্ত অভিজ্ঞতা",
    submit: "বেনামে শেয়ার করুন",
    cancel: "বাতিল করুন",
    report: "রিপোর্ট করুন",
    reported_msg: "পোস্ট রিপোর্ট করা হয়েছে।",
    no_posts: "কোনো পোস্ট নেই। আপনার অভিজ্ঞতা শেয়ার করে প্রথম হোন!",
    loading: "লোড হচ্ছে...",
    char_count: "অক্ষর সর্বোচ্চ",
    like_options: {
      good_salary: "ভালো বেতন",
      growth: "উন্নতি",
      learning: "শেখার সুযোগ",
      culture: "সংস্কৃতি",
      flexible_hours: "নমনীয় সময়",
      nothing: "কিছু না"
    },
    dislike_options: {
      late_salary: "দেরিতে বেতন",
      underpaid: "কম বেতন",
      overwork: "অতিরিক্ত কাজ",
      toxic_environment: "বিষাক্ত পরিবেশ",
      poor_management: "দুর্বল ব্যবস্থাপনা",
      nothing: "কিছু না"
    },
    max_3_selections: "সর্বোচ্চ ৩টি নির্বাচন",
    respectful_warning: "দয়া করে সম্মানজনক ভাষা ব্যবহার করুন",
    hiring_difficulty_q: "নিয়োগের কাঠিন্য",
    hiring_options: {
      easy: "সহজ",
      moderate: "মাঝারি",
      hard: "কঠিন",
      competitive: "অত্যন্ত প্রতিযোগিতামূলক"
    }
  }
};

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem('language');
    if (saved && (saved === 'en' || saved === 'bn')) {
      setLang(saved);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'bn' : 'en';
    setLang(newLang);
    localStorage.setItem('language', newLang);
  };

  const t = (key, nestedKey = null) => {
    if (nestedKey) {
      return dictionaries[lang][key][nestedKey] || dictionaries['en'][key][nestedKey];
    }
    return dictionaries[lang][key] || dictionaries['en'][key];
  };

  return (
    <I18nContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => useContext(I18nContext);
