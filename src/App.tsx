import React, { useState, useEffect } from 'react';
import StoreHeader from './components/StoreHeader';
import PublicStore from './components/PublicStore';
import TrackOrder from './components/TrackOrder';
import { BabyProduct, Order, ImportConfig } from './types';
import { Cloud } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'store' | 'track'>('store');
  const [products, setProducts] = useState<BabyProduct[]>([]);
  const [cart, setCart] = useState<{ product: BabyProduct; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fcf8f4]">
      
      {/* Top sticky promotional header - purely customer-centric */}
      <div className="bg-[#2f251e] py-1.5 text-center text-[10px] sm:text-xs font-bold text-[#faf2e9] tracking-wide relative z-50 flex items-center justify-center gap-2">
        <span>✨ عروض حصرية للأمهات: شحن سريع ومجاني لجميع مدن الخليج العربي عند تجاوز سلتك 150 ريال 🌟</span>
      </div>

      {isLoading ? (
        /* Cute bouncy baby customized loader */
        <div className="flex-1 flex flex-col items-center justify-center p-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#ff7c5c] text-white shadow-xl shadow-[#ff7c5c]/25 animate-float mb-4">
            <Cloud className="h-9 w-9" />
          </div>
          <h3 className="text-md font-extrabold text-[#2f251e]">جاري تحضير مستودع سحاب للأطفال...</h3>
          <p className="text-xs text-[#8e7a6b] mt-1 font-bold">نقوم الآن بفرز المنتجات وتأمين اتصال مشفر بقاعدة البيانات</p>
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
            currency={config.targetCurrency}
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
              />
            ) : (
              <TrackOrder />
            )}
          </main>

        </div>
      )}

      {/* Global Bottom Footer */}
      <footer className="bg-[#2f251e] border-t border-[#f3e9dc]/10 py-10 text-center text-xs text-[#bdaf9e]" dir="rtl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-1">
              <div className="flex items-center gap-2">
                <Cloud className="h-6 w-6 text-[#ff7c5c] animate-float" />
                <span className="font-extrabold text-[#faf2e9] text-md">سحاب للأطفال Sahab Kids</span>
              </div>
              <p className="text-[10px] text-[#a49182] mt-1">الخيار الأمثل للأمهات الخليجيات الباحثات عن معايير الأمان وخامات البامبو الطبيعي للرضع.</p>
            </div>
            
            <div className="flex items-center gap-4 text-[11px] font-semibold text-[#c8b6a3]">
              <span>شحن سريع للرياض، دبي، المنامة، مسقط وبقية مدن الخليج</span>
              <span className="text-gray-600">|</span>
              <span>جميع الحقوق محفوظة © ٢٠٢٦</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
