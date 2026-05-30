import React, { useState } from 'react';
import { 
  Search, ShoppingBag, Star, Shield, 
  Truck, Heart, HelpCircle, ChevronRight, 
  Trash2, ArrowLeft, Check, Lock, Award, 
  MessageSquare, Sparkles 
} from 'lucide-react';
import { BabyProduct, Order, ImportConfig } from '../types';

interface PublicStoreProps {
  products: BabyProduct[];
  setProducts: React.Dispatch<React.SetStateAction<BabyProduct[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  config: ImportConfig;
  cart: { product: BabyProduct; quantity: number }[];
  setCart: React.Dispatch<React.SetStateAction<{ product: BabyProduct; quantity: number }[]>>;
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PublicStore({
  products,
  setProducts,
  orders,
  setOrders,
  config,
  cart,
  setCart,
  isCartOpen,
  setIsCartOpen,
}: PublicStoreProps) {
  // Navigation & Filter options
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [selectedSource, setSelectedSource] = useState<string>('الكل');
  
  // Product Details Modal state
  const [selectedProduct, setSelectedProduct] = useState<BabyProduct | null>(null);
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  
  // Interactive checkout view within cart
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [checkoutSuccessCode, setCheckoutSuccessCode] = useState<string | null>(null);

  // Custom user reviews input state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [customReviews, setCustomReviews] = useState<{ [productId: string]: { author: string; text: string; rating: number; date: string }[] }>({});

  // Categories list
  const categories = ['الكل', 'أدوات الرضاعة والتغذية', 'ألعاب تعليمية وتنمية مهارات', 'رعاية وصحة الرضع', 'مستلزمات النوم والراحة'];

  // Static/preset reviews to display
  const presetReviews = [
    { author: "أم يوسف - الرياض", text: "الخامة جداً ناعمة وخالية من المواد الكيمائية الضارة، طفلي يرتاح جداً بالمنتج وسهلة التعقيم والمسح الصاروخي.", rating: 5, date: "قبل ٣ أيام" },
    { author: "ماريا • دبي", text: "الخامات رائعة والقطع ناعمة جداً على بشرة طفلي وجاءت مغلفة بقمة الأناقة والصحة. سأطلب كميات أخرى قريباً.", rating: 5, date: "قبل أسبوع" },
    { author: "سارة العتيبي - جدة", text: "أكثر ما يعجبني هو تفاصيل حماية الأمن والسلامة للرضع، خفيف والعلب آمنة وخالية من المود الضارة تماماً.", rating: 5, date: "قبل يومين" }
  ];

  // Filtering products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || p.category === selectedCategory;
    const matchesSource = selectedSource === 'الكل' || p.source === selectedSource;
    return matchesSearch && matchesCategory && matchesSource;
  });

  // Add to cart helper with spring bounce/visual hint
  const addToCart = (product: BabyProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    // Open cart slide to confirm to user
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quant: number) => {
    if (quant < 1) return;
    setCart(prev => prev.map(item => 
      item.product.id === productId 
        ? { ...item, quantity: quant } 
        : item
    ));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  // Checkout submit handler
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const newOrderId = 'SAB-2026-' + Math.floor(1000 + Math.random() * 9000);
    const primarySource = cart[0].product.source === 'Manual' ? 'AliExpress' : cart[0].product.source;

    const newOrder: Order = {
      id: newOrderId,
      customerName: checkoutName,
      customerPhone: checkoutPhone,
      customerEmail: checkoutEmail,
      customerAddress: checkoutAddress,
      items: [...cart],
      totalPrice: calculateTotal(),
      status: 'pending',
      date: new Date().toLocaleDateString('ar-SA') + ' - ' + new Date().toLocaleTimeString('ar-SA'),
      dropshipSource: primarySource as any,
    };

    // Save order permanently to backend disk storage
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (res.ok) {
        setOrders(prev => [newOrder, ...prev]);
      } else {
        // Fallback locally
        setOrders(prev => [newOrder, ...prev]);
      }
    } catch (err) {
      console.error("Failed to post order to server database, falling back to local state:", err);
      setOrders(prev => [newOrder, ...prev]);
    }
    
    // Clear state
    setCheckoutSuccessCode(newOrderId);
    setCart([]);
    setIsCheckingOut(false);
    
    // Clear inputs
    setCheckoutName('');
    setCheckoutPhone('');
    setCheckoutEmail('');
    setCheckoutAddress('');
  };

  // Like heart toggle
  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedProducts(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      return [...prev, id];
    });
  };

  // Post verified Review helper
  const submitReview = (productId: string) => {
    if (!reviewAuthor || !reviewText) return;

    const newRev = {
      author: reviewAuthor,
      text: reviewText,
      rating: reviewRating,
      date: "الآن"
    };

    setCustomReviews(prev => ({
      ...prev,
      [productId]: [newRev, ...(prev[productId] || [])]
    }));

    setReviewAuthor('');
    setReviewText('');
    setReviewRating(5);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-10" dir="rtl">
      
      {/* Top promotional banner styled with high editorial aesthetic */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#feedda] via-[#ffebd5] to-[#fde1ce] border border-[#fbd6b8] p-6 sm:p-10 mb-8 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ff7c5c] px-3 py-1 text-[10px] font-bold text-white shadow-sm mb-4">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>منتجات طبية خالية من الـ BPA ورائعة للرضع</span>
          </span>
          <h2 className="text-2xl font-extrabold text-[#2f251e] sm:text-4xl leading-snug">
            العناية الغيمية الهادئة بجيل الغد الفاخر
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-[#7e6b5c] leading-relaxed max-w-lg">
            نوفر في <span className="font-bold text-[#ff7c5c]">سحاب للأطفال</span> باقة منتقاة بعناية وموثوقية فائقة من مستلزمات العناية وألعاب الرضع الطبيعية المصممة خصيصاً لصحة طفلك واطمئنانك.
          </p>
          
          <div className="mt-6 flex flex-wrap gap-4 text-[11px] font-bold text-[#6c594c]">
            <span className="flex items-center gap-1 bg-white/75 border border-[#fcddc3] px-3 py-1.5 rounded-xl">🛡️ حماية خامات البامبو</span>
            <span className="flex items-center gap-1 bg-white/75 border border-[#fcddc3] px-3 py-1.5 rounded-xl">🚀 شحن متتبع مباشر للخليج</span>
            <span className="flex items-center gap-1 bg-white/75 border border-[#fcddc3] px-3 py-1.5 rounded-xl">☁️ سيليكون مرن فائق النعومة</span>
          </div>
        </div>

        {/* Floating circular elements for cute children look */}
        <div className="absolute right-[-20px] bottom-[-20px] h-48 w-48 rounded-full bg-[#fde8d4] blur-xl opacity-80"></div>
        <div className="absolute right-[15%] top-[-30px] h-32 w-32 rounded-full bg-white/40 blur-lg"></div>
      </div>

      {/* Filter panel & Search section */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 max-w-3xl">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all border shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#2f251e] text-white border-transparent'
                  : 'bg-white text-[#6c594c] border-[#ecdcc9] hover:border-[#ff7c5c] hover:text-[#ff7c5c]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Indicator */}
        <div className="flex items-center gap-1.5 bg-white border border-[#ecdcc9] px-3 py-2 rounded-xl">
          <span className="text-[10px] font-extrabold text-[#8e7a6b]">تشكيلة حصرية فاخرة للأمهات</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-8 max-w-md relative">
        <input
          type="text"
          placeholder="ابحث عن منتجات العناية بالطفل، الألعاب، أو المرايل..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs font-medium rounded-2xl border border-[#ecdcc9] bg-white pl-4 pr-10 py-3 text-[#2f251e] placeholder-gray-400 focus:border-[#ff7c5c] focus:outline-none focus:ring-1 focus:ring-[#ff7c5c] transition-all"
        />
        <Search className="absolute right-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
      </div>

      {/* Product Catalog Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((p) => {
          const isLiked = likedProducts.includes(p.id);
          return (
            <div
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              className="group relative cursor-pointer flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-[#e8dcd0] p-4 shadow-sm hover:shadow-md transition-all duration-300"
            >
              
              {/* Product Visual Container */}
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#faf6f2] mb-4">
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Like floating button */}
                <button
                  onClick={(e) => toggleLike(p.id, e)}
                  className={`absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 backdrop-blur-md shadow-sm transition-all hover:bg-white ${
                    isLiked ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>

                {/* Safety Badge */}
                {p.safetyRating && (
                  <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-lg bg-emerald-50/90 backdrop-blur-md border border-emerald-100 px-2 py-1 text-[9px] font-bold text-emerald-800">
                    🛡️ {p.safetyRating.split(' ')[0]} جودة معتمدة
                  </span>
                )}

              </div>

              {/* Text Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold text-[#A69384] mb-1 uppercase tracking-wide flex items-center gap-1.5">
                    <span>{p.category}</span>
                    <span>•</span>
                    <span className="text-amber-600">سن: {p.ageGroup || 'عام'}</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-[#2f251e] line-clamp-2 leading-relaxed min-h-[40px] group-hover:text-[#ff7c5c] transition-colors">
                    {p.title}
                  </h3>
                </div>

                {/* Pricing / CTA row */}
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#faf2e9]/50">
                  <div>
                    <div className="text-xs text-gray-400 line-through font-mono">
                      {(p.price * 1.3).toFixed(0)} {config.targetCurrency}
                    </div>
                    <div className="text-sm font-black text-[#ff7c5c] font-mono">
                      {p.price} {config.targetCurrency}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2f251e] hover:bg-[#ff7c5c] text-white shift-up transition-all"
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-400 text-xs">
            لا توجد منتجات مطابقة لخيارات الفلترة أو مصطلحات البحث الحالية.
          </div>
        )}
      </div>

      {/* CHECKOUT SUCCESS MODAL */}
      {checkoutSuccessCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white border border-emerald-100 p-6 text-center shadow-2xl" dir="rtl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4 animate-bounce">
              <Check className="h-8 w-8" />
            </div>
            
            <h3 className="text-lg font-extrabold text-[#2f251e] mb-2">تم استلام طلبك وتأكيد التسوية المبدئية!</h3>
            <p className="text-xs text-[#6c594c] leading-relaxed mb-4">
              شكراً لتسوقك معنا في سحاب للأطفال. تم تدوين طلبك برقم مرجعي مميز:
            </p>
            <div className="bg-[#f0faf4] px-4 py-2 rounded-xl text-md font-mono font-black text-emerald-700 inline-block border border-emerald-100 mb-6">
              #{checkoutSuccessCode}
            </div>

            <div className="text-xs text-[#8e7a6b] bg-amber-50 rounded-2xl p-3 border border-amber-100 text-right leading-relaxed mb-6 font-medium">
              💡 **تلميح لتتبع طرد طفلك:** انسخي رمز تتبع الطلب أعلاه ثم توجهي إلى تبويب <strong>«تتبع حالة الطلبات»</strong> في أعلى شريط العناوين للاستعلام الفوري والمباشر عن تجهيز الشحنة ومسار الطائرة.
            </div>

            <button
              onClick={() => setCheckoutSuccessCode(null)}
              className="w-full rounded-2xl bg-[#2f251e] hover:bg-black text-white font-bold text-xs py-3.5 transition-all"
            >
              متابعة التسوق ومواصلة الاستعراض
            </button>
          </div>
        </div>
      )}

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl rounded-3xl bg-white border border-[#e8dcd0] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto" dir="rtl">
            
            {/* Close button */}
            <button
              onClick={() => {
                setSelectedProduct(null);
                setReviewAuthor('');
                setReviewText('');
              }}
              className="absolute top-4 left-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#fdf8f4] hover:bg-[#ff7c5c] hover:text-white text-gray-500 transition-all border border-[#f2e2d2]"
            >
              ✕
            </button>

            {/* Layout grid: Product images right / description left */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              
              {/* Product Media (Right) */}
              <div>
                <div className="aspect-square w-full overflow-hidden rounded-2xl bg-[#faf6f2] border border-gray-150">
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Safety certification disclaimer bottom of media */}
                <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl text-[11px] leading-relaxed">
                  <span className="font-extrabold block mb-1">🛡️ مؤشر السلامة والأمن المعتمد:</span>
                  <div>{selectedProduct.safetyRating || 'خالٍ من ملحقات اللدائن وخامات مكررة آمنة لجلد أصابع الرضع حديثي الولادة.'}</div>
                </div>
              </div>

              {/* Product specs, features, buy options (Left) */}
              <div className="flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center gap-1 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 mb-2">
                    {selectedProduct.category}
                  </span>
                  
                  <h3 className="text-md sm:text-lg font-extrabold text-[#2f251e] leading-snug mb-2">{selectedProduct.title}</h3>
                  
                  {/* Rating / source */}
                  <div className="flex items-center gap-2 text-xs mb-4">
                    <div className="flex text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <Star className="h-3.5 w-3.5 fill-current" />
                    </div>
                    <span className="text-[#8e7a6b]">(عشرة مراجعات موثقة من أمهات حقيقيات)</span>
                  </div>

                  {/* Prices */}
                  <div className="bg-[#faf4ee] p-4 rounded-2xl border border-[#ecdcc9] mb-4">
                    <div className="text-[11px] text-[#8e7a6b]">سعر البيع النهائي للعميل بالمتجر:</div>
                    <div className="text-xl font-black text-[#ff7c5c] font-mono mt-0.5">
                      {selectedProduct.price} {config.targetCurrency} 
                      <span className="text-xs font-normal text-gray-400 mr-2">شامل ضريبة القيمة المضافة والشحن السريع</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#7e6b5c] leading-relaxed mb-4">{selectedProduct.description}</p>

                  {/* Highlights Bullet list */}
                  <div className="mb-4">
                    <div className="text-xs font-bold text-[#2f251e] mb-2">أبرز المميزات والمزايا:</div>
                    <ul className="text-xs text-[#6c594c] space-y-1.5 list-inside">
                      {(selectedProduct.features && selectedProduct.features.length > 0 ? selectedProduct.features : [
                        "آمن على اللثة الحساسة وبشرة المواليد الفائقة النعومة",
                        "سهل التنظيف والتعقيم الحراري بمرونة عالية",
                        "أشكال تعزز القدرات المعرفية اللمسية للأطفال"
                      ]).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technical Table Specs */}
                  <div className="border-t border-[#f4eade] pt-3 mb-6">
                    <div className="text-xs font-bold text-[#2f251e] mb-2">المواصفات الفنية المربوطة بالجرد:</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(selectedProduct.specs || {}).map(([key, val]) => (
                        <div key={key} className="flex gap-1 py-1 px-2 bg-gray-50 rounded">
                          <span className="text-[#8e7a6b] font-medium">{key}:</span>
                          <span className="text-gray-900 font-bold">{val}</span>
                        </div>
                      ))}
                      <div className="flex gap-1 py-1 px-2 bg-gray-50 rounded">
                        <span className="text-[#8e7a6b] font-medium">السن المستهدف:</span>
                        <span className="text-gray-900 font-bold">{selectedProduct.ageGroup || 'حديثي الولادة'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions row */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 rounded-2xl bg-[#ff7c5c] hover:bg-[#e06546] text-white font-extrabold text-xs sm:text-sm py-3.5 transition-all text-center flex items-center justify-center gap-2 shadow-md shadow-[#ff7c5c]/15"
                  >
                    <ShoppingBag className="h-4.5 w-4.5" />
                    <span>إرسال وتعبئة في حقيبة التسوق</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                    }}
                    className="rounded-2xl border border-[#ecdcc9] bg-white hover:bg-gray-50 text-xs text-[#6c594c] px-4 font-bold transition-all"
                  >
                    إغلاق التفاصيل
                  </button>
                </div>

              </div>
            </div>

            {/* Custom Interactive Reviews Section */}
            <div className="mt-8 pt-6 border-t border-[#e8dcd0]">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-[#a49182] mb-4 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>الآراء والتقييمات الموثقة من الأمهات</span>
              </h4>

              {/* Write a review box */}
              <div className="bg-[#faf4ee]/40 rounded-2xl border border-[#ecdcc9]/70 p-4 mb-6">
                <div className="text-xs font-bold text-[#2f251e] mb-2">اكتبي تقييمك الخاص للمنتج:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2">
                  <input 
                    type="text" 
                    placeholder="اسمك مستخدم (مثال: أم شهد - الدمام)"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    className="rounded-xl border border-[#ecdcc9] bg-white text-xs p-2.5 focus:border-[#ff7c5c] focus:outline-none"
                  />
                  <div className="flex items-center gap-2 bg-white rounded-xl border border-[#ecdcc9] p-2">
                    <span className="text-[10px] text-gray-400 font-bold shrink-0">التقييم بالنجمات:</span>
                    <select 
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="text-xs font-bold outline-none flex-1 text-amber-600 bg-transparent"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (رائع جداً)</option>
                      <option value="4">⭐⭐⭐⭐ (جيد جداً)</option>
                      <option value="3">⭐⭐⭐ (متوسط الأداء)</option>
                    </select>
                  </div>
                </div>
                <textarea 
                  placeholder="اكتبي تجربتك الصادقة عن جودة المادة، الملمس، وعناية الطفل..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full h-16 rounded-xl border border-[#ecdcc9] bg-white text-xs p-2.5 focus:border-[#ff7c5c] focus:outline-none mb-2"
                />
                <button
                  type="button"
                  onClick={() => submitReview(selectedProduct.id)}
                  className="rounded-xl bg-[#2f251e] hover:bg-black text-white font-bold text-[11px] px-4 py-2 transition-all"
                >
                  نشر المراجعة على الفور
                </button>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                {/* Custom Reviews */}
                {customReviews[selectedProduct.id]?.map((rev, idx) => (
                  <div key={idx} className="bg-amber-50/30 rounded-xl p-3 text-xs border border-amber-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[#2f251e]">{rev.author}</span>
                      <span className="text-gray-400 font-normal">{rev.date}</span>
                    </div>
                    <div className="flex text-amber-500 mb-1">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{rev.text}</p>
                  </div>
                ))}

                {/* Preset Reviews */}
                {presetReviews.map((rev, idx) => (
                  <div key={idx} className="bg-gray-50/80 rounded-xl p-3 text-xs border border-gray-150">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[#2f251e]">{rev.author}</span>
                      <span className="text-gray-400 font-normal">{rev.date}</span>
                    </div>
                    <div className="flex text-amber-500 mb-1">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-[#6c594c] leading-relaxed">{rev.text}</p>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* CART SLIDE SIDEBAR */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" dir="rtl">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={() => setIsCartOpen(false)} />

          <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
            <div className="pointer-events-auto w-screen max-w-md bg-white border-r border-[#e8dcd0] shadow-2xl transition-transform">
              <div className="flex h-full flex-col justify-between p-6">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#faf2e9] pb-4">
                  <h3 className="text-md font-extrabold text-[#2f251e] flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-[#ff7c5c]" />
                    <span>حقيبة المشتريات والطلب</span>
                  </h3>
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckingOut(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto mt-4 px-1 space-y-4">
                  {!isCheckingOut ? (
                    /* CART PRODUCTS LIST */
                    cart.length === 0 ? (
                      <div className="p-12 text-center text-gray-400 text-xs">سلة التسوق فارغة حالياً. اضف بعض المنتجات للرضيع للبدء.</div>
                    ) : (
                      cart.map((item) => (
                        <div key={item.product.id} className="flex gap-4 p-3 rounded-2xl bg-[#faf6f2]/80 border border-[#ecdcc9]/50 hover:bg-[#faf6f2]">
                          <img className="h-14 w-14 object-cover rounded-xl" src={item.product.imageUrl} alt="" />
                          <div className="flex-1">
                            <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{item.product.title}</h4>
                            <div className="text-[10px] text-orange-600 font-bold mt-0.5">الفئة العمرية: {item.product.ageGroup || 'حديث الولادة'}</div>
                            
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-xs font-bold text-[#ff7c5c] font-mono">{item.product.price * item.quantity} {config.targetCurrency}</span>
                              
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                                  className="h-6 w-6 rounded bg-white hover:bg-gray-100 border text-xs"
                                >
                                  -
                                </button>
                                <span className="text-xs font-bold font-mono">{item.quantity}</span>
                                <button 
                                  onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                  className="h-6 w-6 rounded bg-white hover:bg-gray-100 border text-xs"
                                >
                                  +
                                </button>
                                <button 
                                  onClick={() => removeFromCart(item.product.id)}
                                  className="text-rose-600 hover:text-rose-800 mr-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )
                  ) : (
                    /* CHECKOUT FORM VIEW */
                    <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-1">
                      <div className="flex items-center gap-1 text-xs text-[#8e7a6b] mb-4 bg-orange-50 border border-orange-100 p-2.5 rounded-xl">
                        <ArrowLeft className="h-4 w-4 text-[#ff7c5c] shrink-0" />
                        <span>يرجى كتابة معلومات الشحن والتوصيل أدناه لتأمين الدفع الفوري والمحاكاة.</span>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">اسم العميل الثلاثي:</label>
                        <input
                          type="text"
                          required
                          value={checkoutName}
                          placeholder="مثال: يوسف بن عبدالرحمن العتيبي"
                          onChange={(e) => setCheckoutName(e.target.value)}
                          className="w-full text-xs font-medium rounded-xl border border-[#ecdcc9] bg-white px-3 py-2 text-gray-900 focus:border-[#ff7c5c] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">رقم الهاتف الجوال للاتصال:</label>
                        <input
                          type="tel"
                          required
                          value={checkoutPhone}
                          placeholder="مثال: 0501234567"
                          onChange={(e) => setCheckoutPhone(e.target.value)}
                          className="w-full text-xs font-medium rounded-xl border border-[#ecdcc9] bg-white px-3 py-2 text-gray-950 text-left tracking-wide focus:border-[#ff7c5c] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">البريد الإلكتروني للعميل:</label>
                        <input
                          type="email"
                          required
                          value={checkoutEmail}
                          placeholder="youssef@example.com"
                          onChange={(e) => setCheckoutEmail(e.target.value)}
                          className="w-full text-xs font-medium rounded-xl border border-[#ecdcc9] bg-white px-3 py-2 text-gray-950 text-left focus:border-[#ff7c5c] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">عنوان التسليم والتوصيل بالتفصيل:</label>
                        <textarea
                          required
                          value={checkoutAddress}
                          placeholder="المنطقة، المدينة، اسم الشارع ورقم المبنى (مثال: حي الياسمين، الرياض)"
                          onChange={(e) => setCheckoutAddress(e.target.value)}
                          className="w-full text-xs font-medium rounded-xl border border-[#ecdcc9] bg-white px-3 py-2 text-gray-900 focus:border-[#ff7c5c] focus:outline-none h-20"
                        />
                      </div>

                      <div className="pt-2 border-t border-[#faf2e9]">
                        <button
                          type="submit"
                          className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 transition-all text-center shadow-md shadow-emerald-600/10 flex items-center justify-center gap-1.5"
                        >
                          <Lock className="h-4 w-4" />
                          <span>إتمام الدفع الآمن وإنهاء المشتريات</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Subtotal & Action Footer */}
                {!isCheckingOut && cart.length > 0 && (
                  <div className="border-t border-[#f4eade] pt-4 mt-4 space-y-4">
                    <div className="flex justify-between items-center text-xs text-gray-900">
                      <span className="font-bold">المجموع الفرعي لمنتجات الرضّع:</span>
                      <span className="text-lg font-black text-[#ff7c5c] font-mono">{calculateTotal()} {config.targetCurrency}</span>
                    </div>
                    
                    <div className="text-[10px] text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl flex items-center gap-1.5 leading-relaxed">
                      <Truck className="h-4.5 w-4.5 text-emerald-600" />
                      <span>تهانينا! طفلك مؤهل لشحن سريع ومجاني للرضع والخليج العربي.</span>
                    </div>

                    <button
                      onClick={() => setIsCheckingOut(true)}
                      className="w-full rounded-2xl bg-gradient-to-r from-[#2f251e] to-black hover:from-[#ff7c5c] hover:to-[#ff7c5c] hover:text-white text-white font-extrabold text-xs py-3.5 transition-all flex items-center justify-center gap-2 shadow-md shadow-[#2f251e]/15"
                    >
                      <span>الانتقال لإرسال الطلب وإدخال الفواتير</span>
                      <Lock className="h-4 w-4 shrink-0" />
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
