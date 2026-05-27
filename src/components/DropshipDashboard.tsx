import React, { useState } from 'react';
import { 
  ArrowRightLeft, Sparkles, Sliders, Layers, 
  Trash2, RefreshCw, Play, CheckCircle2, 
  ExternalLink, HelpCircle, Compass, 
  CheckCircle, ShieldCheck, ShoppingCart, 
  Loader2, Radio, Info 
} from 'lucide-react';
import { BabyProduct, Order, ImportConfig, SyncLog } from '../types';

interface DropshipDashboardProps {
  products: BabyProduct[];
  setProducts: React.Dispatch<React.SetStateAction<BabyProduct[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  config: ImportConfig;
  setConfig: React.Dispatch<React.SetStateAction<ImportConfig>>;
  syncLogs: SyncLog[];
  setSyncLogs: React.Dispatch<React.SetStateAction<SyncLog[]>>;
}

export default function DropshipDashboard({
  products,
  setProducts,
  orders,
  setOrders,
  config,
  setConfig,
  syncLogs,
  setSyncLogs,
}: DropshipDashboardProps) {
  // Input states
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    product?: BabyProduct;
    isFallback?: boolean;
  } | null>(null);

  // Active sub-view within dashboard
  const [subTab, setSubTab] = useState<'import' | 'products' | 'orders' | 'logs'>('import');

  // Edit states for products
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  // Fulfill simulation states
  const [activeFulfillOrder, setActiveFulfillOrder] = useState<Order | null>(null);
  const [fulfillStep, setFulfillStep] = useState<number>(0);
  const [isFulfilling, setIsFulfilling] = useState(false);
  const [generatedTracking, setGeneratedTracking] = useState('');

  // Example links helper
  const exampleLinks = [
    { title: "حامل أطفال ومقعد مريح", url: "https://www.aliexpress.com/item/baby-carrier-ergonomic-hipseat-carrier.html" },
    { title: "أكواب تدريب الرضع المضادة للانسكاب", url: "https://cjdropshipping.com/product/toddler-anti-spill-sippy-cups.html" },
    { title: "مجموعة العناية بصحة الطفل 10 قطع", url: "https://www.aliexpress.com/item/baby-grooming-kit-infant-health-care.html" }
  ];

  // Import handler calling backend API
  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importUrl) return;

    setIsImporting(true);
    setImportResult(null);

    try {
      const res = await fetch('/api/import-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: importUrl,
          multiplier: config.markupMultiplier,
          targetCurrency: config.targetCurrency,
        }),
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        // Add product to state
        const importedProd = data.product as BabyProduct;
        setProducts(prev => [importedProd, ...prev]);
        
        // Log event
        const logId = 'log_' + Math.random().toString(36).substring(2, 9);
        const newLog: SyncLog = {
          id: logId,
          timestamp: new Date().toLocaleTimeString('ar-SA'),
          type: 'import',
          platform: importedProd.source === 'Manual' ? 'AliExpress' : importedProd.source,
          status: 'success',
          message: `تم استيراد منتج جديد بنجاح وتعيين السعر ر.س ${importedProd.price} عن طريق الذكاء الاصطناعي `
        };
        setSyncLogs(prev => [newLog, ...prev]);

        setImportResult({
          success: true,
          message: data.fallback 
            ? 'تم استيراد وتوطين تفاصيل خصائص المنتج من مستودعات الموردين بنجاح (وضع العرض التفاعلي).' 
            : 'بنجاح فائق! قام الذكاء الاصطناعي Gemini بتحليل الرابط ووضع تسمية ومواصفات تسويقية فاخرة باللغة العربية.',
          product: importedProd,
          isFallback: data.fallback
        });
        setImportUrl('');
      } else {
        throw new Error(data.error || 'حدث خطأ غير معروف');
      }
    } catch (err: any) {
      setImportResult({
        success: false,
        message: err.message || 'تعذر الاتصال بالخادم لمسح الرابط.'
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Quick preset loader
  const loadPresetLink = (url: string) => {
    setImportUrl(url);
  };

  // Fulfill simulation starter
  const startFulfillSimulation = (order: Order) => {
    setActiveFulfillOrder(order);
    setIsFulfilling(true);
    setFulfillStep(1);
    
    // Simulate steps sequentially
    setTimeout(() => {
      setFulfillStep(2); // SKUs and shipping analysis
      
      setTimeout(() => {
        setFulfillStep(3); // Payments simulation
        
        setTimeout(() => {
          // Final generation
          const suffix = order.dropshipSource === 'AliExpress' ? 'AE' : 'CJ';
          const randNums = Math.floor(10000000 + Math.random() * 90000000);
          const trk = `${suffix}_${randNums}_SA`;
          setGeneratedTracking(trk);
          setFulfillStep(4);
          
          // Save database state on server disk
          fetch('/api/orders/fulfill', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: order.id, status: 'fulfilled', trackingNumber: trk }),
          }).catch(err => console.error("Error updating order fulfillment on server:", err));

          // Apply to order state
          setOrders(prev => prev.map(o => {
            if (o.id === order.id) {
              return {
                ...o,
                status: 'fulfilled',
                trackingNumber: trk
              };
            }
            return o;
          }));

          // Append log
          const newLog: SyncLog = {
            id: 'log_' + Math.random().toString(36).substring(2, 9),
            timestamp: new Date().toLocaleTimeString('ar-SA'),
            type: 'fulfill',
            platform: order.dropshipSource === 'None' ? 'AliExpress' : order.dropshipSource as any,
            status: 'success',
            message: `تم ترحيل الطلب #${order.id} للعميل ${order.customerName} وتوليد بوليصة الشحن بنجاح.`
          };
          setSyncLogs(prev => [newLog, ...prev]);

        }, 1500);
      }, 1500);
    }, 1500);
  };

  const closeFulfillSimulation = () => {
    setIsFulfilling(false);
    setActiveFulfillOrder(null);
    setFulfillStep(0);
    setGeneratedTracking('');
  };

  // Inline edit products
  const startEditing = (p: BabyProduct) => {
    setEditingId(p.id);
    setEditPrice(p.price);
    setEditStock(p.stock);
  };

  const saveProductEdit = async (id: string) => {
    try {
      await fetch('/api/products/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, price: editPrice, stock: editStock }),
      });
    } catch (err) {
      console.error("Error saving product edit to backend:", err);
    }

    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, price: editPrice, stock: editStock };
      }
      return p;
    }));
    setEditingId(null);

    // Append Sync log
    const newLog: SyncLog = {
      id: 'log_' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString('ar-SA'),
      type: 'inventory_sync',
      platform: 'AliExpress',
      status: 'success',
      message: `تم تحديث السعر والمخزون للمنتج ذو الرقم التعريفي ${id} بنجاح.`
    };
    setSyncLogs(prev => [newLog, ...prev]);
  };

  const deleteProduct = async (id: string) => {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا المنتج من متجر العرض الخاص بك؟')) {
      try {
        await fetch('/api/products/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
      } catch (err) {
        console.error("Error deleting product from backend:", err);
      }
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12" dir="rtl">
      
      {/* Title & Introduction */}
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-[#2f251e] sm:text-3xl flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-[#ff7c5c]" />
            <span>لوحة تحكم الدروبشيبينغ الفعالة</span>
          </h2>
          <p className="mt-2 text-sm text-[#7e6b5c]">
            استورد المنتجات مباشرة عبر روابط <span className="font-bold text-[#ea1c24]">AliExpress</span> أو <span className="font-bold text-[#f7b500]">CJ Dropshipping</span>، وقم بتلقي الطلبات وتحويلها للموردين بلمسة زر واحدة.
          </p>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center gap-3 rounded-2xl bg-white p-3 border border-[#ecdcc9] shadow-sm">
          <div className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </div>
          <div>
            <div className="text-[10px] text-[#A69384] font-bold uppercase tracking-wide">رابط الاتصال (API Gateway)</div>
            <div className="text-xs font-bold text-[#44382e]">متصل ونشط مع مستودعات CJ والـ AliExpress</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Control Tabs on Right / Content on Left */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        
        {/* Navigation panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-3xl bg-white border border-[#e8dcd0] p-4 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#a49182] px-3 mb-3">حجرة العمليات</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSubTab('import')}
                className={`w-full text-right flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  subTab === 'import'
                    ? 'bg-[#ff7c5c]/10 text-[#ff7c5c] shadow-sm'
                    : 'text-[#6c594c] hover:bg-[#faf2e9] hover:text-[#2f251e]'
                }`}
              >
                <ArrowRightLeft className="h-4 w-4" />
                <span>استيراد برابط ذكي (Ali & CJ)</span>
              </button>
              
              <button
                onClick={() => setSubTab('products')}
                className={`w-full text-right flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  subTab === 'products'
                    ? 'bg-[#ff7c5c]/10 text-[#ff7c5c] shadow-sm'
                    : 'text-[#6c594c] hover:bg-[#faf2e9] hover:text-[#2f251e]'
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>إجازة المنتجات المنشورة ({products.length})</span>
              </button>

              <button
                onClick={() => setSubTab('orders')}
                className={`w-full text-right flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  subTab === 'orders'
                    ? 'bg-[#ff7c5c]/10 text-[#ff7c5c] shadow-sm'
                    : 'text-[#6c594c] hover:bg-[#faf2e9] hover:text-[#2f251e]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-4 w-4" />
                  <span>طلبات العملاء وتعليق الربط</span>
                </div>
                {orders.filter(o => o.status === 'pending').length > 0 && (
                  <span className="bg-[#ff7c5c] text-white text-[10px] px-2 py-0.5 rounded-full">
                    {orders.filter(o => o.status === 'pending').length} معلق
                  </span>
                )}
              </button>

              <button
                onClick={() => setSubTab('logs')}
                className={`w-full text-right flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  subTab === 'logs'
                    ? 'bg-[#ff7c5c]/10 text-[#ff7c5c] shadow-sm'
                    : 'text-[#6c594c] hover:bg-[#faf2e9] hover:text-[#2f251e]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Radio className="h-4 w-4 text-emerald-500 animate-pulse" />
                  <span>سجل المعالجة المباشر (Sync Log)</span>
                </div>
                <span className="bg-emerald-100 text-[#21573c] text-[10px] px-1.5 py-0.5 rounded-md">جديد</span>
              </button>
            </div>
          </div>

          {/* Settings block summary */}
          <div className="rounded-3xl bg-gradient-to-br from-[#faf4ee] to-[#f4e6d7] border border-[#ecdcc9] p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sliders className="h-4.5 w-4.5 text-[#ff7c5c]" />
              <h4 className="text-sm font-bold text-[#2f251e]">مُعامِل تسعير التوطين</h4>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#715f50] block mb-1">
                  مضاعف هامش الربح: <span className="text-[#ff7c5c]">{config.markupMultiplier}x</span>
                </label>
                <input
                  type="range"
                  min="1.2"
                  max="3.0"
                  step="0.1"
                  value={config.markupMultiplier}
                  onChange={(e) => setConfig(prev => ({ ...prev, markupMultiplier: Number(e.target.value) }))}
                  className="w-full accent-[#ff7c5c] h-1.5 bg-[#eaddce] rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-[#A69384] block mt-1">يحسب كـ: التكلفة × المضاعف = سعر بيع متجر الزبائن السعري.</span>
              </div>

              <div>
                <label className="text-xs font-bold text-[#715f50] block mb-1">العملة المستهدفة للمتجر</label>
                <select
                  value={config.targetCurrency}
                  onChange={(e) => setConfig(prev => ({ ...prev, targetCurrency: e.target.value as any }))}
                  className="w-full text-xs font-bold rounded-xl border border-[#ecdcc9] bg-white p-2 text-[#2f251e]"
                >
                  <option value="SAR">ريال سعودي (SAR)</option>
                  <option value="AED">درهم إماراتي (AED)</option>
                  <option value="USD">دولار أمريكي (USD)</option>
                </select>
              </div>

              <div className="flex items-center justify-between border-t border-[#ecdcc9]/60 pt-3">
                <span className="text-xs text-[#715f50] font-medium">التنفيذ الفوري المباشر</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={config.autoFulfill} 
                    onChange={(e) => setConfig(prev => ({ ...prev, autoFulfill: e.target.checked }))}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:left-0.25 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ff7c5c]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Major Content Area */}
        <div className="lg:col-span-3">
          
          {/* TAB 1: Smart Link Import */}
          {subTab === 'import' && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-white border border-[#e8dcd0] p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff7c5c]/10 text-[#ff7c5c]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-md font-extrabold text-[#2f251e]">مُستورِد المنتجات الذكي الفوري</h3>
                    <p className="text-xs text-[#8e7a6b]">الصق رابط المنتج من AliExpress أو CJDropshipping لتوفير الوقت. سيقوم الذكاء الاصطناعي بتوليد الترجمة والأوصاف العربية الراقية تلقائياً.</p>
                  </div>
                </div>

                <form onSubmit={handleImport} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      required
                      placeholder="https://www.aliexpress.com/item/10050012345.html أو رابط منتج CJ"
                      value={importUrl}
                      onChange={(e) => setImportUrl(e.target.value)}
                      className="flex-1 rounded-2xl border border-[#ecdcc9] px-4 py-3 text-xs sm:text-sm text-[#2f251e] bg-[#fdfcfa] focus:border-[#ff7c5c] focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isImporting}
                      className="rounded-2xl bg-[#ff7c5c] hover:bg-[#e06546] disabled:bg-gray-300 text-white font-extrabold text-xs sm:text-sm px-6 py-3 transition-all flex items-center justify-center gap-2 shadow-md shadow-[#ff7c5c]/10"
                    >
                      {isImporting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>جاري المسح الضوئي الذكي...</span>
                        </>
                      ) : (
                        <>
                          <ArrowRightLeft className="h-4 w-4" />
                          <span>استيراد وتوطين الآن</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Example quick loaders */}
                <div className="mt-4 pt-4 border-t border-[#f4eade] ">
                  <span className="text-xs font-bold text-[#8e7a6b] block mb-2">أمثلة روابط جاهزة ومتاحة للتجربة السريعة:</span>
                  <div className="flex flex-wrap gap-2">
                    {exampleLinks.map((link, idx) => (
                      <button
                        key={idx}
                        onClick={() => loadPresetLink(link.url)}
                        className="text-[11px] font-bold text-[#6c594c] bg-[#faf2e9] hover:bg-[#fdeadc] px-3 py-1.5 rounded-lg border border-[#eddccb] transition-all"
                      >
                        ⚡ {link.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Import status display */}
              {importResult && (
                <div className={`rounded-3xl p-6 border transition-all ${
                  importResult.success 
                    ? 'bg-emerald-50/70 border-emerald-100 text-[#173824]' 
                    : 'bg-rose-50/70 border-rose-100 text-[#4c1619]'
                }`}>
                  <div className="flex items-start gap-3">
                    {importResult.success ? (
                      <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-md mb-1">
                        {importResult.success ? 'تم الاستيراد والمزامنة بنجاح!' : 'فشل سحب الرابط'}
                      </h4>
                      <p className="text-xs leading-relaxed opacity-90">{importResult.message}</p>

                      {importResult.success && importResult.product && (
                        <div className="mt-4 bg-white rounded-2xl border border-emerald-100/60 p-4 flex gap-4 items-center">
                          <img 
                            className="h-16 w-16 object-cover rounded-xl" 
                            src={importResult.product.imageUrl} 
                            alt="" 
                          />
                          <div>
                            <div className="text-xs text-amber-600 font-extrabold flex items-center gap-1.5 mb-1">
                              <span className="px-1.5 py-0.5 rounded bg-amber-50 text-[10px] border border-amber-200">
                                {importResult.product.source}
                              </span>
                              <span>•</span>
                              <span>{importResult.product.category}</span>
                            </div>
                            <h5 className="text-xs font-bold text-gray-900 line-clamp-1">{importResult.product.title}</h5>
                            <div className="text-xs font-extrabold text-[#ff7c5c] mt-1">
                              سعر التوطين المنشور المعالج بالهامش: {importResult.product.price} {config.targetCurrency} 
                              <span className="text-gray-400 font-normal mr-2">(تكلفة المورد: ${importResult.product.priceUsd})</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Info graphic explanation card */}
              <div className="rounded-3xl bg-[#faf2e9]/50 border border-[#ecdcc9] p-6">
                <h4 className="text-sm font-extrabold text-[#2f251e] mb-3">كيف تعمل تقنية ربط AliExpress و CJ Dropshipping؟</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-white rounded-2xl border border-[#ecdcc9]/60">
                    <div className="text-[#ff7c5c] font-black text-lg mb-1">٠١</div>
                    <div className="font-bold text-[#2f251e] mb-1">جلب البيانات (API Scraper)</div>
                    <p className="text-[#6c594c] leading-relaxed">يسحب الرماز البيانات من منصات الصين والـ CJ ويغذيها مباشرة.</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-[#ecdcc9]/60">
                    <div className="text-[#ff7c5c] font-black text-lg mb-1">٠٢</div>
                    <div className="font-bold text-[#2f251e] mb-1">صياغة الذكاء الاصطناعي</div>
                    <p className="text-[#6c594c] leading-relaxed">تقرن العناوين برؤية تسويقية تناسب الأمهات العربيات مع شرح خصائص الأمان الطبية.</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-[#ecdcc9]/60">
                    <div className="text-[#ff7c5c] font-black text-lg mb-1">٠٣</div>
                    <div className="font-bold text-[#2f251e] mb-1">المزامنة والربط المالي</div>
                    <p className="text-[#6c594c] leading-relaxed">يتغير السعر ديناميكياً بناءً على تقلبات سعر الصرف والمضاعف الربحي المحدد.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Catalog Products List */}
          {subTab === 'products' && (
            <div className="space-y-4">
              <div className="rounded-3xl bg-white border border-[#e8dcd0] p-6 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-md font-extrabold text-[#2f251e]">المنتجات المدرجة بمتجر العرض</h3>
                    <p className="text-xs text-[#8e7a6b]">تستطيع تعديل الهامش الربحي لأي منتج أو تخصيص عدد المخزن المتبقي بشكل محلي آمن.</p>
                  </div>
                  <div className="text-xs font-bold text-[#715f50]">إجمالي المنتجات: {products.length}</div>
                </div>

                {products.length === 0 ? (
                  <div className="p-12 text-center text-gray-400">لا يوجد منتجات حالياً. تفضل باستيراد بعض المنتجات أولاً.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-[#faf2e9] text-[#8e7a6b] font-bold">
                          <th className="py-3 px-2">المنتج</th>
                          <th className="py-3 px-2">المنصة المربوطة</th>
                          <th className="py-3 px-2">تكلفة التوريد</th>
                          <th className="py-3 px-2 text-center">سعر البيع وعرض الرف</th>
                          <th className="py-3 px-2 text-center">المخزون المتوفر</th>
                          <th className="py-3 px-2 text-left">قفل</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#faf2e9]/70">
                        {products.map((p) => (
                          <tr key={p.id} className="hover:bg-[#faf2e9]/20 transition-all">
                            
                            {/* Product main info */}
                            <td className="py-3.5 px-2">
                              <div className="flex items-center gap-3">
                                <img 
                                  className="h-10 w-10 object-cover rounded-lg border border-gray-100" 
                                  src={p.imageUrl} 
                                  alt="" 
                                />
                                <div>
                                  <div className="font-bold text-gray-900 max-w-[200px] line-clamp-1">{p.title}</div>
                                  <div className="text-[10px] text-[#A69384]">{p.category} • {p.ageGroup || 'عام'}</div>
                                </div>
                              </div>
                            </td>

                            {/* Platform source */}
                            <td className="py-3.5 px-2">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold ${
                                p.source === 'AliExpress'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-150'
                                  : p.source === 'CJDropshipping'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-150'
                                  : 'bg-indigo-50 text-indigo-700 border border-indigo-150'
                              }`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${
                                  p.source === 'AliExpress' ? 'bg-rose-600' : p.source === 'CJDropshipping' ? 'bg-amber-600' : 'bg-indigo-600'
                                }`}></span>
                                {p.source}
                              </span>
                            </td>

                            {/* Supplier Price */}
                            <td className="py-3.5 px-2 font-mono font-bold text-gray-600">
                              ${p.priceUsd.toFixed(2)}
                            </td>

                            {/* Selling Price - Editable */}
                            <td className="py-3.5 px-2 text-center">
                              {editingId === p.id ? (
                                <div className="flex items-center justify-center gap-1">
                                  <input 
                                    type="number" 
                                    value={editPrice}
                                    onChange={(e) => setEditPrice(Number(e.target.value))}
                                    className="w-16 rounded border border-orange-200 px-1 py-0.5 font-bold font-mono text-center"
                                  />
                                  <span className="text-[10px] font-bold">{config.targetCurrency}</span>
                                </div>
                              ) : (
                                <span className="font-bold text-[#ff7c5c] font-mono">{p.price} {config.targetCurrency}</span>
                              )}
                            </td>

                            {/* Stock - Editable */}
                            <td className="py-3.5 px-2 text-center">
                              {editingId === p.id ? (
                                <input 
                                  type="number" 
                                  value={editStock}
                                  onChange={(e) => setEditStock(Number(e.target.value))}
                                  className="w-16 rounded border border-orange-200 px-1 py-0.5 font-bold font-mono text-center"
                                />
                              ) : (
                                <span className={`font-medium ${p.stock < 20 ? 'text-red-600 font-bold' : 'text-gray-700 font-mono'}`}>
                                  {p.stock} قطعة
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-2 text-left">
                              {editingId === p.id ? (
                                <button 
                                  onClick={() => saveProductEdit(p.id)}
                                  className="bg-emerald-600 text-white rounded px-2 py-1 text-[10px] font-bold ml-1 hover:bg-emerald-700"
                                >
                                  حفظ
                                </button>
                              ) : (
                                <button 
                                  onClick={() => startEditing(p)}
                                  className="text-[#6c594c] hover:text-[#ff7c5c] font-bold text-[11px] ml-3"
                                >
                                  تعديل
                                </button>
                              )}
                              <button 
                                onClick={() => deleteProduct(p.id)}
                                className="text-rose-600 hover:text-rose-800"
                              >
                                <Trash2 className="h-4 w-4 inline-block" />
                              </button>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Orders Area & Auto-fulfillment simulation */}
          {subTab === 'orders' && (
            <div className="space-y-4">
              <div className="rounded-3xl bg-white border border-[#e8dcd0] p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-md font-extrabold text-[#2f251e]">الطلبات الواردة وتحقق التوريد</h3>
                  <p className="text-xs text-[#8e7a6b]">عندما يقوم الزبائن بالشراء من المتجر الفاخر، تظهر طلباتهم هنا. اضغط على «تنفيذ تلقائي عبر الدروبشيبينغ» لمزامنتها مع مستودعات الصين بلمسة واحدة.</p>
                </div>

                {orders.length === 0 ? (
                  <div className="p-12 text-center text-gray-400">لا توجد طلبات واردة من المتجر حتى الآن. قم بزيارة المتجر الفاخر واشترِ منتجاً ليظهر هنا!</div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((o) => (
                      <div key={o.id} className="border border-[#faf2e9] rounded-2xl p-4 bg-white hover:shadow-sm transition-all">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 pb-3 border-b border-[#faf2e9]">
                          <div>
                            <span className="text-xs font-bold text-gray-500">رقم تعريف الطلب: </span>
                            <span className="text-xs font-mono font-bold text-gray-850">#{o.id}</span>
                            <span className="mx-2 text-gray-300">|</span>
                            <span className="text-[11px] text-[#A69384]">{o.date}</span>
                          </div>

                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            o.status === 'fulfilled'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700 animate-pulse'
                          }`}>
                            {o.status === 'fulfilled' ? 'تم الشحن والربط' : 'قيد التدقيق و معلق الربط المالي'}
                          </span>
                        </div>

                        {/* Customer & Item breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mb-4">
                          <div>
                            <div className="font-extrabold text-[#7e6b5c] mb-1">تفاصيل العميل وعنوان الشحن:</div>
                            <p className="font-bold text-gray-900">{o.customerName}</p>
                            <p className="text-[#8e7a6b]">{o.customerPhone}</p>
                            <p className="text-[#8e7a6b] font-mono">{o.customerEmail}</p>
                            <p className="text-[#8e7a6b] line-clamp-1">{o.customerAddress}</p>
                          </div>

                          <div>
                            <div className="font-extrabold text-[#7e6b5c] mb-1">القطع المشتراة ونسب التجزئة:</div>
                            {o.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 mb-1.5">
                                <img src={item.product.imageUrl} alt="" className="h-6 w-6 object-cover rounded" />
                                <span className="font-bold text-gray-800 line-clamp-1">{item.product.title}</span>
                                <span className="text-[#ff7c5c] font-bold shrink-0">({item.quantity}×)</span>
                              </div>
                            ))}
                          </div>

                          <div>
                            <div className="font-extrabold text-[#7e6b5c] mb-1">بيانات التسوية والمنصة:</div>
                            <div className="font-bold text-gray-900">سعر البيع النهائي: {o.totalPrice} {config.targetCurrency}</div>
                            <div className="text-[10px] text-gray-400 mt-1">مصدر التوريد اللوجستي: </div>
                            <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded text-[9px] border border-amber-200">
                              {o.dropshipSource !== 'None' ? o.dropshipSource : 'AliExpress (شحن سريع)'}
                            </span>
                          </div>
                        </div>

                        {/* Action Fulfill */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-3 border-t border-[#faf2e9]/50">
                          {o.trackingNumber ? (
                            <div className="flex items-center gap-2 text-xs bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl px-3 py-1.5">
                              <ShieldCheck className="h-4 w-4 text-emerald-600" />
                              <span>رقم تتبع AliExpress/CJ المرمز: </span>
                              <span className="font-mono font-bold tracking-wider">{o.trackingNumber}</span>
                            </div>
                          ) : (
                            <div className="text-[11px] text-amber-600 flex items-center gap-1">
                              <Info className="h-3.5 w-3.5" />
                              <span>لم يتم دفع تكلفة التوريد للمورد بعد (${(o.totalPrice / (config.markupMultiplier * 3.75)).toFixed(2)} USD).</span>
                            </div>
                          )}

                          {o.status !== 'fulfilled' && (
                            <button
                              onClick={() => startFulfillSimulation(o)}
                              className="w-full sm:w-auto text-xs font-extrabold text-white bg-amber-500 hover:bg-amber-600 rounded-xl px-4 py-2 flex items-center justify-center gap-1.5 transition-all shadow-sm"
                            >
                              <Play className="h-3.5 w-3.5" />
                              <span>تنفيذ تلقائي للطلب عبر Dropship API</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: API Sync Logs */}
          {subTab === 'logs' && (
            <div className="space-y-4">
              <div className="rounded-3xl bg-white border border-[#e8dcd0] p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-md font-extrabold text-[#2f251e]">سجل المزامنة المباشر</h3>
                    <p className="text-xs text-[#8e7a6b]">مراقبة حية لجميع عمليات التحقق والطلبات القادمة عبر القنوات التابعة لـ AliExpress و CJ Dropshipping APIs.</p>
                  </div>
                  <button 
                    onClick={() => {
                      // Generate a mock heartbeat check
                      const logId = 'log_' + Math.random().toString(36).substring(2, 9);
                      setSyncLogs(prev => [
                        {
                          id: logId,
                          timestamp: new Date().toLocaleTimeString('ar-SA'),
                          type: 'inventory_sync',
                          platform: Math.random() > 0.5 ? 'AliExpress' : 'CJDropshipping',
                          status: 'success',
                          message: 'بوابة API: التحقق من قنوات تبادل السلع مخزنياً مستقر بنسبة 100%.'
                        },
                        ...prev
                      ]);
                    }}
                    className="text-xs font-extrabold text-[#ff7c5c] hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <span>فحص اتصال القنوات يدوياً</span>
                  </button>
                </div>

                <div className="font-mono text-[11px] bg-[#1a1411] text-emerald-400 p-5 rounded-2xl space-y-2 max-h-[400px] overflow-y-auto">
                  <div className="text-gray-500 text-[10px] pb-2 border-b border-gray-800">
                    // سجل الاتصال المباشر - Gateway IP: 104.244.42.1 (موجَّه نحو السيرفر والذكاء الاصطناعي)
                  </div>
                  {syncLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2 py-1 border-b border-white/5 last:border-0">
                      <span className="text-gray-500">[{log.timestamp}]</span>
                      <span className="font-bold uppercase text-amber-500">[{log.platform}]</span>
                      <span className={`px-1 rounded text-[10px] uppercase font-extrabold font-sans text-center shrink-0 ${
                        log.type === 'import' ? 'bg-blue-950 text-blue-300' : 'bg-green-950 text-green-300'
                      }`}>
                        {log.type === 'import' ? 'استيراد' : 'شحن وتوريد'}
                      </span>
                      <span className="text-gray-200">{log.message}</span>
                    </div>
                  ))}
                  
                  {syncLogs.length === 0 && (
                    <div className="text-center py-4 text-gray-500">سجل الاتصال ساكن ومؤمن. بانتظار مسح رابط أو ترحيل طلب.</div>
                  )}

                  <div className="text-gray-500 text-[10px] pt-2 text-left">
                    {`STABLE_GATEWAY_INTEGRITY=100%`}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODAL: Auto-Fulfill Simulator Progress */}
      {isFulfilling && activeFulfillOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-[#e8dcd0] p-6 shadow-2xl relative" dir="rtl">
            <h3 className="text-lg font-extrabold text-[#2f251e] mb-2 flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-[#ff7c5c] animate-spin" />
              <span>معالج ترحيل الشحنة التلقائي (CJ & Ali Sync)</span>
            </h3>
            <p className="text-xs text-[#6c594c] mb-6">
              جاري الاتصال الآن ببوابات المورد الرسمية لطلب السلع وشحنها لعنوان العميل: <strong className="text-gray-900">{activeFulfillOrder.customerName}</strong>.
            </p>

            {/* Stages vertical timeline */}
            <div className="space-y-4 mb-6 relative">
              
              {/* STAGE 1 */}
              <div className="flex gap-3 items-start">
                <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  fulfillStep >= 1 ? 'bg-amber-100 text-amber-700 font-extrabold' : 'bg-gray-100 text-gray-400'
                }`}>
                  {fulfillStep > 1 ? '✓' : '١'}
                </div>
                <div>
                  <div className="text-xs font-extrabold text-gray-950">فتح قنوات المصادقة وتأكيد SKU المنتجات</div>
                  <p className="text-[11px] text-[#715f50]">جاري التخاطب مع مخازن الموردين عبر AliExpress API لتأكيد وفرة القطع المحددة وحجزها مؤقتاً.</p>
                </div>
              </div>

              {/* STAGE 2 */}
              <div className="flex gap-3 items-start">
                <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  fulfillStep >= 2 ? 'bg-amber-100 text-amber-700 font-extrabold' : 'bg-gray-100 text-gray-400'
                }`}>
                  {fulfillStep > 2 ? '✓' : '٢'}
                </div>
                <div>
                  <div className="text-xs font-extrabold text-gray-950">تصدير عنوان الشحن وإجراء خيارات التوزيع</div>
                  <p className="text-[11px] text-[#715f50]">تصدير بيانات العميل وتعيين خدمة التوصيل السريع (AliExpress Direct / CJ Shipping) متوجهاً للمملكة والخليج العربي.</p>
                </div>
              </div>

              {/* STAGE 3 */}
              <div className="flex gap-3 items-start">
                <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  fulfillStep >= 3 ? 'bg-amber-100 text-amber-700 font-extrabold' : 'bg-gray-100 text-gray-400'
                }`}>
                  {fulfillStep > 3 ? '✓' : '٣'}
                </div>
                <div>
                  <div className="text-xs font-extrabold text-gray-950">خصم ثمن التوريد بالجملة وتسوية الباقة في الغيم</div>
                  <p className="text-[11px] text-[#715f50]">تحويل قيمة الجملة تلقائياً للمورّد من بطاقتك الائتمانية المسجلة لتأكيد المعاملة وإصدار أمر الخروج.</p>
                </div>
              </div>

              {/* STAGE 4 */}
              <div className="flex gap-3 items-start">
                <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-all ${
                  fulfillStep >= 4 ? 'bg-emerald-500 text-white font-extrabold' : 'bg-gray-100 text-gray-400'
                }`}>
                  ★
                </div>
                <div>
                  <div className="text-xs font-extrabold text-emerald-800">توليد بوليصة الشحن وتحديث حالة المتجر</div>
                  <p className="text-[11px] text-[#715f50]">اكتمل! تم تخصيص الرمز التتبعي وربط الفاتورة وحفظ التقدم بنجاح.</p>
                </div>
              </div>

            </div>

            {/* Results actions */}
            {fulfillStep === 4 ? (
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 mb-6 text-xs text-emerald-850">
                <div className="font-extrabold mb-1">اكتمل الربط اللوجستي والتنفيذ!</div>
                <div>رقم تتبع الشحنة المولد: <strong className="font-mono text-gray-900 tracking-wider bg-white rounded border px-2 py-0.5">{generatedTracking}</strong></div>
                <div className="mt-1 opacity-90">تم إرسال إشعار فوري لبريد وهاتف العميل لتتبع شحنته.</div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-3 rounded-2xl mb-6">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>يرجى عدم إغلاق هذه الصفحة لتأمين ترحيل حشوة البيانات لـ API...</span>
              </div>
            )}

            <div className="flex justify-end pt-3">
              <button
                type="button"
                disabled={fulfillStep < 4}
                onClick={closeFulfillSimulation}
                className="w-full sm:w-auto text-xs font-extrabold bg-[#2f251e] hover:bg-black text-white px-6 py-3 rounded-2xl transition-all disabled:opacity-50"
              >
                إنهاء وإغلاق المعالِج
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
