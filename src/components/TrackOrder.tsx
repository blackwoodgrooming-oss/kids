import React, { useState } from 'react';
import { 
  Search, Eye, Calendar, User, Phone, 
  MapPin, Clipboard, CheckCircle, Package, 
  Clock, Truck, ThumbsUp, AlertCircle, Sparkles 
} from 'lucide-react';

interface OrderItem {
  product: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    category: string;
    source: string;
  };
  quantity: number;
}

interface TrackedOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'fulfilled';
  date: string;
  dropshipSource: string;
  trackingNumber?: string;
}

export default function TrackOrder() {
  const [orderIdQuery, setOrderIdQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [trackedOrder, setTrackedOrder] = useState<TrackedOrder | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const handleTrackSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdQuery.trim()) {
      setErrorText("الرجاء إدخال كود الطلب بشكل صحيح.");
      return;
    }

    setLoading(true);
    setErrorText(null);
    setTrackedOrder(null);

    try {
      const resp = await fetch(`/api/orders/track?id=${encodeURIComponent(orderIdQuery.trim())}`);
      const data = await resp.json();

      if (resp.ok && data.success) {
        setTrackedOrder(data.order);
      } else {
        setErrorText(data.error || "خطأ أثناء محاولة تتبع الطلب. الرجاء التحقق من كود الطلب.");
      }
    } catch (err) {
      console.error(err);
      setErrorText("تعذر الاتصال بخادم بوابة تتبع شحنات سحاب للأطفال.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Timeline render helpers
  const getTimelineSteps = (status: 'pending' | 'processing' | 'shipped' | 'fulfilled') => {
    const steps = [
      {
        key: 'pending',
        title: 'تأكيد الطلب المبدئي',
        desc: 'تم تسجيل طلب الرضيع بنجاح ودخل نظام التدقيق والتعقيم.',
        icon: Clock,
        activeColor: 'text-amber-500 bg-amber-50 border-amber-300',
        doneColor: 'text-emerald-600 bg-emerald-50 border-emerald-500'
      },
      {
        key: 'processing',
        title: 'تجهيز وتعقيم الشحنة',
        desc: 'يتم الآن فرز منتجات العناية بالطفل للتأكد من مطابقتها لأعلى معايير الأمان وخلو المواد من البلاستيك الضار الـ BPA.',
        icon: Package,
        activeColor: 'text-orange-500 bg-orange-50 border-orange-300',
        doneColor: 'text-emerald-600 bg-emerald-50 border-emerald-500'
      },
      {
        key: 'shipped',
        title: 'مغادرة الشحنة والترانزيت',
        desc: 'تم نقل الشحنة وتسليمها لخط الطيران الدولي المباشر المتجه إلى الخليج العربي.',
        icon: Truck,
        activeColor: 'text-blue-500 bg-blue-50 border-blue-300',
        doneColor: 'text-emerald-600 bg-emerald-50 border-emerald-500'
      },
      {
        key: 'fulfilled',
        title: 'اكتمل التسليم والاستلام والتدقيق',
        desc: 'تم تسليم طرد مستلزمات الأطفال لعنوانك بأمان وراحة تامة.',
        icon: ThumbsUp,
        activeColor: 'text-emerald-600 bg-emerald-50 border-emerald-400',
        doneColor: 'text-emerald-600 bg-emerald-50 border-emerald-600'
      }
    ];

    const statusOrder = ['pending', 'processing', 'shipped', 'fulfilled'];
    const currentIdx = statusOrder.indexOf(status);

    return steps.map((step, idx) => {
      const isDone = idx < currentIdx;
      const isActive = idx === currentIdx;
      const isPending = idx > currentIdx;

      return {
        ...step,
        isDone,
        isActive,
        isPending
      };
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6" dir="rtl">
      
      {/* Editorial Title */}
      <div className="text-center mb-10 max-w-lg mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ff7c5c]/10 text-[#ff7c5c] px-3.5 py-1 text-[11px] font-bold border border-[#ff7c5c]/20 mb-3">
          <Sparkles className="h-3 w-3" />
          <span>تتبع شحنات سحاب للأطفال الفورية</span>
        </span>
        <h2 className="text-2xl font-extrabold text-[#2f251e] sm:text-3xl tracking-tight leading-snug">
          بوابة تتبع طلبات سحاب الذكية للأطفال
        </h2>
        <p className="mt-2.5 text-xs text-[#8e7a6b] leading-relaxed font-medium">
          أدخلي كود تتبع الطلب الخاص بطفلك والمكون من (SAB-2026-XXXX) الذي تلقيتِه في نهاية الفاتورة لمشاهدة حالة الشحنة فوراً مباشرة في متجرنا بالتفصيل.
        </p>
      </div>

      {/* Input Search Form */}
      <div className="bg-white rounded-3xl border border-[#e8dcd0] p-6 sm:p-8 shadow-sm max-w-xl mx-auto mb-10">
        <form onSubmit={handleTrackSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              required
              value={orderIdQuery}
              onChange={(e) => setOrderIdQuery(e.target.value)}
              placeholder="مثال: SAB-2026-6824"
              className="w-full text-xs font-bold rounded-2xl border border-[#ecdcc9] bg-[#faf6f2]/50 px-4 py-3.5 text-right placeholder-gray-400 focus:border-[#ff7c5c] focus:ring-1 focus:ring-[#ff7c5c] focus:outline-none transition-all uppercase tracking-wider"
            />
            <Eye className="absolute left-3.5 top-3.5 w-5 h-5 text-[#8e7a6b] opacity-60 pointer-events-none" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-[#2f251e] hover:bg-[#ff7c5c] active:scale-95 text-white font-extrabold text-xs px-6 py-3.5 transition-all text-center flex items-center justify-center gap-2 shadow-md shadow-[#2f251e]/10 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>جاري البحث والاستفسار من قاعدة البيانات...</span>
              </>
            ) : (
              <>
                <Search className="h-4.5 w-4.5" />
                <span>استعلام وتتبع الآن</span>
              </>
            )}
          </button>
        </form>

        {errorText && (
          <div className="mt-4 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-2xl text-xs leading-relaxed">
            <AlertCircle className="h-4.5 w-4.5 text-red-650 shrink-0 mt-0.5" />
            <span className="font-semibold">{errorText}</span>
          </div>
        )}
      </div>

      {/* Tracked Results Area */}
      {trackedOrder && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Main Info Header Card */}
          <div className="bg-gradient-to-br from-white to-[#fdfcfa] rounded-3xl border border-[#ecdcc9] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold text-gray-500">رقم الطلب الفريد:</span>
                <span className="text-md font-mono font-black text-[#ff7c5c]">{trackedOrder.id}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8e7a6b] font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>تاريخ الشراء: {trackedOrder.date}</span>
                </span>
                <span>|</span>
                <span className="flex items-center gap-1">
                  <span className="text-orange-500 font-extrabold">طريقة التوصيل:</span>
                  <span>توصيل منزلي سريع وآمن</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[10px] font-bold text-gray-400">إجمالي فاتورة سحاب للأطفال:</span>
              <span className="text-xl font-black text-[#ff7c5c] font-mono">{trackedOrder.totalPrice} ريال سعودي</span>
            </div>
          </div>

          {/* Visual Tracking Progress Timeline - THE CORE REQUEST */}
          <div className="bg-white rounded-3xl border border-[#ecdcc9] p-6 sm:p-8 shadow-sm">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#a49182] mb-6 flex items-center gap-2">
              <Truck className="h-4.5 w-4.5 text-[#ff7c5c]" />
              <span>مخطط تتبع حالة شحنة الرضيع اللحظي</span>
            </h3>

            {/* Custom Responsive Progress Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-[22px] left-[12.5%] right-[12.5%] h-1 bg-[#f4ece3] -z-10" />
              
              {/* Connector completed highlights line based on status */}
              <div className="hidden md:block absolute top-[22px] left-[12.5%] right-[12.5%] h-1 bg-emerald-500 -z-10 transition-all duration-700 origin-right rounded-full"
                style={{
                  width: trackedOrder.status === 'pending' ? '0%'
                       : trackedOrder.status === 'processing' ? '33%'
                       : trackedOrder.status === 'shipped' ? '66%'
                       : '100%'
                }}
              />

              {getTimelineSteps(trackedOrder.status).map((step, idx) => {
                const IconComp = step.icon;
                return (
                  <div key={idx} className="flex flex-row md:flex-col items-start md:items-center text-right md:text-center gap-4 md:gap-3">
                    
                    {/* Circle Node Icon */}
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border-2 transition-all duration-500 shrink-0 shadow-sm ${
                      step.isDone ? step.doneColor
                      : step.isActive ? `${step.activeColor} ring-4 ring-[#ff7c5c]/10 scale-105 animate-pulse`
                      : 'text-gray-300 bg-[#faf6f2] border-gray-200'
                    }`}>
                      {step.isDone ? (
                        <CheckCircle className="h-5 w-5 text-emerald-600 fill-current text-white" />
                      ) : (
                        <IconComp className="h-5 w-5" />
                      )}
                    </div>

                    {/* Step Title & Details */}
                    <div>
                      <h4 className={`text-xs font-extrabold ${step.isActive ? 'text-[#ff7c5c]' : step.isDone ? 'text-emerald-700' : 'text-gray-650'}`}>
                        {step.title}
                      </h4>
                      <p className="text-[10px] text-gray-500 leading-relaxed mt-1 md:max-w-xs md:mx-auto">
                        {step.desc}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Simulated Partner Ship Code display */}
            {trackedOrder.trackingNumber && (
              <div className="mt-8 pt-6 border-t border-dashed border-[#ecdcc9] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="text-xs text-[#8e7a6b] font-medium leading-relaxed">
                  📦 <strong>رمز الشحنة الدولي:</strong> يمكنك استخدام هذا الرمز لتتبع طرد طفلك مع شركات التوصيل المحلية بمجرد وصوله للمملكة/الخليج:
                </div>
                <div className="flex items-center gap-1 bg-[#fdf8f4] border border-[#f0ded0] rounded-xl p-1 shrink-0">
                  <span className="text-xs font-mono font-bold text-[#ff7c5c] px-3.5">{trackedOrder.trackingNumber}</span>
                  <button 
                    onClick={() => copyToClipboard(trackedOrder.trackingNumber || "")}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-[#e8dcd0] text-gray-500 hover:text-[#ff7c5c] transition-all"
                    title="نسخ الرمز"
                  >
                    <Clipboard className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            
            {copiedId && (
              <p className="text-[10px] text-emerald-600 font-bold text-left mt-1">✓ تم نسخ رقم التتبع واللوجستيات بنجاح!</p>
            )}
          </div>

          {/* Customer Address Card & Ordered Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Customer Shipping Address info (INTERNAL DATABASE MATCH) */}
            <div className="bg-white rounded-3xl border border-[#ecdcc9] p-6 shadow-sm">
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#a49182] mb-4 flex items-center gap-2">
                <MapPin className="h-4.5 w-4.5 text-[#ff7c5c]" />
                <span>بيانات عنوان تسليم الرضيع المسجلة</span>
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <User className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-gray-500 font-medium">اسم العميل:</span>
                  <strong className="text-gray-850 font-bold">{trackedOrder.customerName}</strong>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-gray-500 font-medium">الهاتف الجوال:</span>
                  <strong className="text-gray-850 font-bold font-mono tracking-wide">{trackedOrder.customerPhone}</strong>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                  <span className="text-gray-500 font-medium shrink-0">العنوان التفصيلي:</span>
                  <strong className="text-gray-850 font-bold leading-relaxed">{trackedOrder.customerAddress}</strong>
                </div>
              </div>
            </div>

            {/* Ordered products card */}
            <div className="bg-white rounded-3xl border border-[#ecdcc9] p-6 shadow-sm">
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#a49182] mb-4 flex items-center gap-2">
                <Package className="h-4.5 w-4.5 text-[#ff7c5c]" />
                <span>مستلزمات الأطفال في الطرد</span>
              </h3>

              <div className="space-y-3 max-h-48 overflow-y-auto px-1">
                {trackedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center p-2 rounded-xl bg-[#faf6f2]/60 hover:bg-[#faf6f2] border border-[#f5ece3]/50">
                    <img 
                      src={item.product?.imageUrl} 
                      alt="" 
                      className="h-11 w-11 object-cover rounded-lg bg-gray-50 shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-extrabold text-gray-900 truncate">{item.product?.title || "منتج العناية بالطفل"}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-medium">مستورد ومفحوص • الكمية: {item.quantity}</p>
                    </div>
                    <div className="text-xs font-mono font-black text-[#ff7c5c] shrink-0">
                      {(item.product?.price || 0) * item.quantity} ر.س
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Call to Trust action */}
          <div className="bg-[#f0faf4] border border-emerald-150 rounded-2xl p-4 text-center text-xs text-emerald-800 leading-relaxed font-semibold">
            👶 <strong>صحة طفلك هي أولويتنا:</strong> جميع مستلزمات سحاب مفحوصة بدقة فائقة ومعبأة بصناديق مفرغة من الهواء للتأمين الطبي الشامل ومطابقة لمعايير الجودة العالمية لحماية الرضع.
          </div>

        </div>
      )}

    </div>
  );
}
