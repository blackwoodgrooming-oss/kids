import React, { useState, useEffect } from 'react';
import StoreHeader from './components/StoreHeader';
import PublicStore from './components/PublicStore';
import TrackOrder from './components/TrackOrder';
import { BabyProduct, Order, ImportConfig, CountryOption, countryOptions, translations } from './types';
import { Cloud } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'store' | 'track'>('store');
  const [products, setProducts] = useState<BabyProduct[]>([]);
  const [cart, setCart] = useState<{ product: BabyProduct; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [language, setLanguage] = useState<'ar' | 'en'>(() => {
    const saved = localStorage.getItem('selectedLanguage');
    if (saved === 'en' || saved === 'ar') return saved;
    return 'ar'; // defaults to Arabic
  });

  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(() => {
    const saved = localStorage.getItem('selectedCountryCode');
    if (saved) {
      const found = countryOptions.find(c => c.code === saved);
      if (found) return found;
    }
    return countryOptions[0]; // defaults to SA 🇸🇦
  });

  const handleCountryChange = (country: CountryOption) => {
    setSelectedCountry(country);
    localStorage.setItem('selectedCountryCode', country.code);
  };

  const handleLanguageChange = (lang: 'ar' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  };

  // Configuration for shop styling and parameters
  const [config, setConfig] = useState<ImportConfig>({
    markupMultiplier: 1.8,
    targetCurrency: 'SAR',
    autoFulfill: true,
    defaultStock: 100
  });

  // Common Orders state
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch initial products and orders from server database (Supabase backed)
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load persistent products from server
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data && data.products) {
          setProducts(data.products);
        }

        // Load persistent orders from server database
        const ordersResponse = await fetch('/api/orders');
        const ordersData = await ordersResponse.json();
        if (ordersData && ordersData.orders) {
          setOrders(ordersData.orders);
        }
      } catch (err) {
        console.error("Error loading deep store data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const t = translations[language];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fcf8f4]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Top sticky promotional header - purely customer-centric */}
      <div className="bg-[#2f251e] py-1.5 text-center text-[10px] sm:text-xs font-bold text-[#faf2e9] tracking-wide relative z-50 flex items-center justify-center gap-2">
        <span>{t.promo_text}</span>
      </div>

      {isLoading ? (
        /* Cute bouncy baby customized loader */
        <div className="flex-1 flex flex-col items-center justify-center p-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#ff7c5c] text-white shadow-xl shadow-[#ff7c5c]/25 animate-float mb-4">
            <Cloud className="h-9 w-9" />
          </div>
          <h3 className="text-md font-extrabold text-[#2f251e]">{t.preparing_warehouse}</h3>
          <p className="text-xs text-[#8e7a6b] mt-1 font-bold">{t.bouncy_p1}</p>
          <div className="mt-4 flex gap-1 items-center justify-center">
            <span className="h-2 w-2 rounded-full bg-[#ff7c5c] animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="h-2 w-2 rounded-full bg-[#ff7c5c] animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="h-2 w-2 rounded-full bg-[#ff7c5c] animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      ) : (
        /* App Main Shell */
        <div className="flex-1 flex flex-col">
          
          {/* Global Navbar Header */}
          <StoreHeader
            currentView={currentView}
            setView={setCurrentView}
            cartCount={cart.reduce((ac, item) => ac + item.quantity, 0)}
            openCart={() => setIsCartOpen(true)}
            selectedCountry={selectedCountry}
            onChangeCountry={handleCountryChange}
            language={language}
            onChangeLanguage={handleLanguageChange}
          />

          {/* Conditional Layout View */}
          <main className="flex-1">
            {currentView === 'store' ? (
              <PublicStore
                products={products}
                setProducts={setProducts}
                orders={orders}
                setOrders={setOrders}
                config={config}
                cart={cart}
                setCart={setCart}
                isCartOpen={isCartOpen}
                setIsCartOpen={setIsCartOpen}
                selectedCountry={selectedCountry}
                language={language}
              />
            ) : (
              <TrackOrder language={language} />
            )}
          </main>

        </div>
      )}

      {/* Global Bottom Footer */}
      <footer className="bg-[#2f251e] border-t border-[#f3e9dc]/10 py-10 text-center text-xs text-[#bdaf9e]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-1">
              <div className="flex items-center gap-2">
                <Cloud className="h-6 w-6 text-[#ff7c5c] animate-float" />
                <span className="font-extrabold text-[#faf2e9] text-md">{t.brand_main} {language === 'ar' ? '' : t.brand_sub}</span>
              </div>
              <p className="text-[10px] text-[#a49182] mt-1">{t.footer_p1}</p>
            </div>
            
            <div className="flex items-center gap-4 text-[11px] font-semibold text-[#c8b6a3]">
              <span>{t.footer_p2}</span>
              <span className="text-gray-600">|</span>
              <span>{t.rights}</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
