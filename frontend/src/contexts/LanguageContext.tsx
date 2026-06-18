"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Language = "en" | "te" | "hi";

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

const translations: Translations = {
  // Navigation
  nav_home: { en: "Home", te: "హోమ్", hi: "होम" },
  nav_marketplace: { en: "Marketplace", te: "మార్కెట్ ప్లేస్", hi: "बाज़ार" },
  nav_about: { en: "About Us", te: "మా గురించి", hi: "हमारे बारे में" },
  nav_contact: { en: "Contact", te: "సంప్రదించండి", hi: "संपर्क" },
  nav_login: { en: "Login", te: "లాగిన్", hi: "लॉग इन" },
  nav_dashboard: { en: "Dashboard", te: "డాష్‌బోర్డ్", hi: "डैशबोर्ड" },
  
  // Home Page
  hero_title: { 
    en: "\"Transforming traditional spice trade into a data-driven, global powerhouse.\"", 
    te: "\"సాంప్రదాయ సుగంధ ద్రవ్యాల వ్యాపారాన్ని డేటా-ఆధారిత ప్రపంచ శక్తిగా మారుస్తున్నాము.\"", 
    hi: "\"पारंपरिक मसाला व्यापार को डेटा-संचालित वैश्विक पावरहाउस में बदलना।\"" 
  },
  hero_subtitle: {
    en: "Trade Mirchi is built for farmers, traders, and international exporters who demand transparency, speed, and uncompromising quality.",
    te: "ట్రేడ్ మిర్చి అనేది పారదర్శకత, వేగం మరియు రాజీలేని నాణ్యతను కోరుకునే రైతులు, వ్యాపారులు మరియు అంతర్జాతీయ ఎగుమతిదారుల కోసం నిర్మించబడింది.",
    hi: "ट्रेड मिर्ची किसानों, व्यापारियों और अंतरराष्ट्रीय निर्यातकों के लिए बनाई गई है जो पारदर्शिता, गति और समझौता न करने वाली गुणवत्ता की मांग करते हैं।"
  },
  join_network: { en: "Join the Network", te: "నెట్‌వర్క్‌లో చేరండి", hi: "नेटवर्क से जुड़ें" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("trade_mirchi_lang") as Language;
    if (savedLang && ["en", "te", "hi"].includes(savedLang)) {
      setLanguage(savedLang);
    }
    setMounted(true);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("trade_mirchi_lang", lang);
  };

  const t = (key: string): string => {
    if (!mounted) return translations[key]?.["en"] || key; // Prevent hydration mismatch by defaulting to English initially
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
