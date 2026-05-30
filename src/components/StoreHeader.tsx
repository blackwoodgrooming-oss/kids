import React from 'react';
import { Cloud, ShoppingBag, Eye } from 'lucide-react';
import { CountryOption, countryOptions, translations } from '../types';

interface StoreHeaderProps {
  currentView: 'store' | 'track';
  setView: (view: 'store' | 'track') => void;
  cartCount: number;
  openCart: () => void;
  selectedCountry: CountryOption;
  onChangeCountry: (country: CountryOption) => void;
  language: 'ar' | 'en';
  onChangeLanguage: (lang: 'ar' | 'en') => void;
}

export default function StoreHeader({
  currentView,
  setView,
  cartCount,
  openCart,
  selectedCountry,
  onChangeCountry,
  language,
  onChangeLanguage,
}: StoreHeaderProps) {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#f3e9dc] bg-[#fcf8f4]/95 backdrop-blur-md">
      <div className="mx-auto flex flex-col md:flex-row max-w-7xl items-center justify-between px-4 py-3 sm:px-6 gap-3">
        
        {/* Right/Left side: Logo & Brand Description */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ff7c5c] text-white shadow-md shadow-[#ff7c5c]/20 animate-float">
            <Cloud className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#2f251e] flex items-center gap-1.5">
              <span>{language === 'ar' ? 'سحاب' : 'Sahab'}</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#fce9d8] text-[#ff7c5c] border border-[#fde3d3]">
                {t.logo_sub}
              </span>
            </h1>
            <p className="text-[10px] text-[#8e7a6b] font-semibold tracking-wide">{t.logo_desc}</p>
          </div>
        </div>

        {/* Center: Customer Navigation Switcher */}
        <nav className="flex items-center gap-1.5 rounded-2xl bg-[#f5eade] p-1.5 border border-[#ecdcc9]">
          <button
            onClick={() => setView('store')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-300 ${
              currentView === 'store'
                ? 'bg-white text-[#ff7c5c] shadow-sm'
                : 'text-[#6c594c] hover:bg-white/40 hover:text-[#2f251e]'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{t.nav_shop}</span>
          </button>
          
          <button
            onClick={() => setView('track')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-300 ${
              currentView === 'track'
                ? 'bg-[#ff7c5c] text-white shadow-md shadow-[#ff7c5c]/10'
                : 'text-[#6c594c] hover:bg-white/40 hover:text-[#2f251e]'
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>{t.nav_track}</span>
          </button>
        </nav>

        {/* Left/Right side: Language, Country, and Cart Actions */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          
          {/* Compact Language Text Switcher */}
          <button
            onClick={() => onChangeLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-[#e1d5c9] hover:border-[#ff7c5c] hover:bg-[#faf6f2] transition-all duration-300 shadow-xs text-xs font-bold font-mono tracking-wider select-none text-[#6c594c] hover:text-[#ff7c5c]"
            title={language === 'ar' ? 'English' : 'العربية'}
          >
            {language === 'ar' ? 'En' : 'Ar'}
          </button>

          {/* Country Selection */}
          <div className="flex items-center gap-1.5 bg-white border border-[#e1d5c9] px-2.5 py-1.5 rounded-xl shadow-xs">
            <span className="text-xs sm:text-sm font-medium">{selectedCountry.flag}</span>
            <select
              value={selectedCountry.code}
              onChange={(e) => {
                const found = countryOptions.find(c => c.code === e.target.value);
                if (found) onChangeCountry(found);
              }}
              className="bg-transparent text-[10px] sm:text-[11px] font-bold text-[#6c594c] focus:outline-none cursor-pointer"
            >
              {countryOptions.map(country => (
                <option key={country.code} value={country.code}>
                  {country.flag} {language === 'ar' ? country.name : country.nameEn} ({language === 'ar' ? country.currency : country.currencyEn})
                </option>
              ))}
            </select>
          </div>

          {/* Cart Bag Trigger */}
          <button
            onClick={openCart}
            className="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-[#e8dcd0] text-[#2f251e] shadow-sm transition-all hover:border-[#ff7c5c] hover:text-[#ff7c5c]"
          >
            <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110" />
            
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff7c5c] text-[10px] font-bold text-white ring-2 ring-white animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
}
