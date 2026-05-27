import React from 'react';
import { Cloud, Search, ShoppingBag, Eye, HelpCircle } from 'lucide-react';

interface StoreHeaderProps {
  currentView: 'store' | 'track';
  setView: (view: 'store' | 'track') => void;
  cartCount: number;
  openCart: () => void;
  currency: string;
}

export default function StoreHeader({
  currentView,
  setView,
  cartCount,
  openCart,
  currency,
}: StoreHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#f3e9dc] bg-[#fcf8f4]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6" dir="rtl">
        
        {/* Right side: Logo & Brand Description */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ff7c5c] text-white shadow-md shadow-[#ff7c5c]/20 animate-float">
            <Cloud className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#2f251e] flex items-center gap-1.5">
              <span>سحاب</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#fce9d8] text-[#ff7c5c] border border-[#fde3d3]">للأطفال</span>
            </h1>
            <p className="text-[10px] text-[#8e7a6b] font-semibold tracking-wide">أرقى مستلزمات العناية وألعاب الأطفال الآمنة والشهادات المعتمدة</p>
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
            <span>تسوق المنتجات</span>
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
            <span>تتبع حالة الطلبات</span>
          </button>
        </nav>

        {/* Left side: Cart Actions */}
        <div className="flex items-center gap-3">
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
          
          <div className="hidden sm:flex text-xs font-semibold px-3 py-2 bg-[#fcf8f4]/50 border border-[#ecdcc9]/40 rounded-xl text-gray-500">
            <span>العملة: <strong className="text-orange-600 font-mono">{currency}</strong></span>
          </div>
        </div>

      </div>
    </header>
  );
}
