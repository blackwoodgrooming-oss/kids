import React, { useState, useEffect } from 'react';
import { 
  Search, ShoppingBag, Star, Shield, 
  Truck, Heart, HelpCircle, ChevronRight, 
  Trash2, ArrowLeft, Check, Lock, Award, 
  MessageSquare, Sparkles 
} from 'lucide-react';
import { BabyProduct, Order, ImportConfig, CountryOption, getProductPrices, translations, getProductDetails } from '../types';

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
  selectedCountry: CountryOption;
  language: 'ar' | 'en';
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
  selectedCountry,
  language,
}: PublicStoreProps) {
  // Navigation & Filter options
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [selectedSource, setSelectedSource] = useState<string>('الكل');
  
  // Product Details Modal state
  const [selectedProduct, setSelectedProduct] = useState<BabyProduct | null>(null);
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [activeMedia, setActiveMedia] = useState<'image' | 'video'>('image');
  const [selectedImgUrl, setSelectedImgUrl] = useState<string>('');

  useEffect(() => {
    setActiveMedia('image');
    if (selectedProduct) {
      setSelectedImgUrl(selectedProduct.imageUrl);
    } else {
      setSelectedImgUrl('');
    }
  }, [selectedProduct?.id]);
  
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

  const t = translations[language];

  // Categories list keys (original Arabic terms to keep filtration working)
  const categoryKeys = ['الكل', 'أدوات الرضاعة والتغذية', 'ألعاب تعليمية وتنمية مهارات', 'رعاية وصحة الرضع', 'مستلزمات النوم والراحة'];

  // Static/preset reviews helper to display
  const getProductPresetReviews = (productId: string, lang: 'ar' | 'en') => {
    if (productId === 'kids_ocean_bath_bombs') {
      return lang === 'ar' ? [
        { author: "أم فهد - الرياض", text: "فوق الخيال! فوران ملون جميل مع ريحة الفواكه الطبيعية الفواحة، والدمى الصغيرة اللي تطلع ممتازة جداً وبنتي صارت تموت في وقت الاستحمام وبدون أي تحسس بالبشرة.", rating: 5, date: "قبل يوم" },
        { author: "خالد بن عبد الله - جدة", text: "طلبتها لأولادي وجات مغلفة بشكل ممتاز والتغليف الحراري الفردي يحافظ عليها. جربنا عطر اللافندر والنعناع جداً مهدئ ومريح قبل النوم. والألعاب المائية لطيفة للغاية.", rating: 5, date: "قبل ٣ أيام" },
        { author: "سارة المري - الدمام", text: "أفضل منتج كرات فوارة للأطفال الصراحة، رغوة غنية وفقاعات جميلة وألوانها ما تترك بقع على الحوض أو جسم الأطفال. والزيوت العطرية ملمسها يرطب البشرة. موصى به وبشدة!", rating: 5, date: "قبل أسبوع" },
        { author: "ريم الخالدي - الكويت", text: "تحفة فنية للأطفال! كل يوم طفلي يختار رائحة جديدة عشان يكتشف اللعبة المخفية بالداخل، الألعاب آمنة وخالية من الـ BPA. شكراً متجر سحاب.", rating: 5, date: "قبل ٥ أيام" }
      ] : [
        { author: "Um Fahad - Riyadh", text: "Beyond imagination! Beautiful colored fizz with natural refreshing fruity scents. The tiny hidden toy that pops out is of great quality, my daughter now looks forward to bath time! Completely safe with no skin irritation.", rating: 5, date: "1 day ago" },
        { author: "Khalid bin Abdullah - Jeddah", text: "Ordered these for my boys and they arrived perfectly packaged. Individually shrink-wrapped, preserving freshness. We tried the Lavender and Mint-infused ones, very soothing before sleeping. Highly creative and neat.", rating: 5, date: "3 days ago" },
        { author: "Sarah Al-Marri - Dammam", text: "Hands down the best bath fizziness for toddlers. Rich bubble texture and the colors don't stain the tub or child's skin. The essential oil leaves skin so soft and moist. Highly recommended!", rating: 5, date: "1 week ago" },
        { author: "Reem Al-Khalidi - Kuwait", text: "Masterpiece of clean fun! Each day my toddler chooses a new perfume to discover the hidden sea toy inside. The marine toys are safe and BPA-free. Thank you Sahab!", rating: 5, date: "5 days ago" }
      ];
    }
    if (productId === 'kids_plush_melody_basket') {
      return lang === 'ar' ? [
        { author: "أم دانا - الرياض", text: "تجنن تجنن تبارك الرحمن! الخامة مخملية ناعمة جداً وجاءت معقمة ورائحتها نظيفة. بنتي تعشق ماي ميلودي وصارت تلم كل عرايسها وألعابها فيها الحين وصار شكل الغرفة يفتح النفس ومرتب.", rating: 5, date: "قبل ٣ أيام" },
        { author: "أميرة الشمري - الدمام", text: "منظم راقي جداً ولطيف لغرف الأطفال. ميزتها أنها قطيفة ناعمة تماماً وبدون أي أجزاء صلبة يعني لو طاح عليها ولدي الصغير وهو يلعب ما يتأذى أبداً. الخامة ممتازة وسهلة الحمل.", rating: 5, date: "قبل يومين" },
        { author: "ياسمين الحربي - جدة", text: "أفضل سلة تخزين طلبتها! أستخدمها لترتيب الجوارب وملابس طفلتي الصغيرة بجانب السرير، المقبض ناعم وخفيف والتوصيل سريع جداً من متجر سحاب. أنصح بها وبشدة.", rating: 5, date: "قبل يومين" }
      ] : [
        { author: "Um Dana - Riyadh", text: "Absolutely gorgeous! The velvet plush material is incredibly soft, arrived completely sanitized and fresh. My daughter is obsessed with My Melody and now actually loves gathering her dolls into the basket herself. Makes the nursery look so clean and stylish!", rating: 5, date: "3 days ago" },
        { author: "Amira Al-Shammari - Dammam", text: "Premium decorative basket, very cute and practical. What I love most is that it has a completely cushiony structure with zero rigid framing, so it's 100% safe to place around playing toddlers. Highly durable too.", rating: 5, date: "2 days ago" },
        { author: "Yasmin Al-Harbi - Jeddah", text: "The best storage bin I've bought! I use it to organize my baby's socks, pacifier clips, and small items next to the crib. The handles are very sturdy yet soft. Very fast shipping from Sahab Store!", rating: 5, date: "2 days ago" }
      ];
    }
    if (productId === 'kids_portable_ball_pit') {
      return lang === 'ar' ? [
        { author: "أم جودي - الرياض", text: "الخيمة تجنن وتفتح النفس! سهلة الفتح بمجرد ما تطلعها من الكيس تنفتح لحالها بوب آب وحجمها جداً واسع وممتاز. أخذت معها كرات المحيط الملونة وعقدت أولادي فيها لساعات من اللعب الهادئ والممتع.", rating: 5, date: "قبل يومين" },
        { author: "أبو سيف - الدمام", text: "ممتازة جداً وعملية! جودتها عالية وخياطتها قوية والسلك المعدني مغطى ومثني بشكل آمن تماماً، والأجمل سهولة طيها وحملها بالحقيبة الصغيرة المرفقة للمخيمات والرحلات العائلية والحديقة.", rating: 5, date: "قبل ٤ أيام" },
        { author: "دلال العنزي - الكويت", text: "توصيل سريع مغلفة بأناقة متناهية. بنتي تستانس فيها وتلعب بداخلها وتعبي فيها ألعابها. القماش خفيف وسهل التنظيف بمسحة واحدة. أنصح فيها بشدة كهدية رائعة.", rating: 5, date: "قبل ٣ أيام" }
      ] : [
        { author: "Um Judy - Riyadh", text: "This play tent is amazing! Unfolds automatically in seconds without any effort. Perfect size for our living room. Bought it with Sahab's pastel ocean balls and they keep my little ones busy and happy for hours.", rating: 5, date: "2 days ago" },
        { author: "Abu Seif - Dammam", text: "Highly practical and durable quality! The structural wire is fully wrapped and safely rounded. Stows away extremely small into the high-quality round zippered bag, perfect for family park picnics and outdoor travels.", rating: 5, date: "4 days ago" },
        { author: "Dalal Al-Anzi - Kuwait", text: "Arrived very fast and premiumly boxed. My daughter absolute loves playing inside and gathering her stuffed toys in it. Extremely lightweight, easy to wipe clean in a single swab. Highly recommended!", rating: 5, date: "3 days ago" }
      ];
    }
    if (productId === 'kids_ocean_balls_100pc') {
      return lang === 'ar' ? [
        { author: "أبو ماجد - الرياض", text: "رهيبة تبارك الله! حجمها ممتاز للأطفال والكرات مرنة ما تنعفج بسهولة، اشتريتها لملء خيمة الألعاب وحوض الكرات المائي لأولادي وصاروا يقضون فيها أوقات طويلة وممتعة.", rating: 5, date: "قبل ٣ أيام" },
        { author: "أميرة العتيبي - جدة", text: "العلبة الشبكية ممتازة لتخزين الكرات بعد اللعب، الألوان هادئة وجميلة وغير فاقعة تفتح النفس. أهم شيء حوافها ناعمة تماماً وآمنة على ولدي الصغير عمره سنتين يعض عليها بدون ما أخاف عليه.", rating: 5, date: "قبل يومين" },
        { author: "حمد الهاجري - قطر", text: "منتج رائع جداً وجودة البلاستيك ممتازة وخالية ريحتها من أي مواد كيميائية، الكرات ترجع لشكلها الطبيعي لو انضغطت بالغلط. شحن سريع وتوصيل ممتاز.", rating: 5, date: "قبل ٥ أيام" }
      ] : [
        { author: "Abu Majed - Riyadh", text: "Amazing value! The balls are strong yet flexible, they don't crush easily. Perfect for our indoor play tent and toddler ball pit pool. Kids are absolutely obsessed with it!", rating: 5, date: "3 days ago" },
        { author: "Amira Al-Otaibi - Jeddah", text: "Great pastel color combination (pink, white, gray, blue). The net bag is very helpful for easy cleanup. Safe rounded surfaces are indeed free from sharp seams, great for my 2 year old.", rating: 5, date: "2 days ago" },
        { author: "Hamad Al-Hajri - Qatar", text: "Excellent plastic quality, odor-free and ultra-safe. If accidentally stepped on, they just pop back into full shape. Fast direct shipping. Highly recommended!", rating: 5, date: "5 days ago" }
      ];
    }
    if (productId === 'kids_baby_earmuffs') {
      return lang === 'ar' ? [
        { author: "أم سارة - جدة", text: "رهيبة تبارك الله! بني كانت تفزع من أقل صوت وهي نايمة وتصحى تبكي. الحين مع السماعة هذي صرنا نسافر بالسيارة ونحضر مناسبات عائلية وهي نايمة بسلام ونومها عميق ومستقر. الحزام قماش ناعم جداً وما يضغط على راسها.", rating: 5, date: "قبل يومين" },
        { author: "فيصل العتيبي - الرياض", text: "جودة ممتازة وعملية جداً! أخذتها لولدي الصغير عشان نوفر له الهدوء أثناء السفر بالطائرة والرحلات الطويلة. العزل رائع والحزام قطني مرن ناعم جداً وسهل التعديل. أنصح فيها كل الآباء والأمهات.", rating: 5, date: "قبل ٤ أيام" },
        { author: "منيرة الحربي - دبي", text: "توصيل سريع وخدمة ممتازة من متجر سحاب. السماعة خفيفة جداً ومريحة والأهم أنها آمنة وخاماتها طبية معقمة. بنتي تحب شكلها المريح وصارت تنام فيها بدون إزعاج.", rating: 5, date: "قبل يومين" }
      ] : [
        { author: "Um Sarah - Jeddah", text: "Honestly life-changing! My baby used to startle and wake up crying at the slightest noise. With these comfortable earmuffs, we can travel or attend family events and she sleeps so peacefully. The elastic band is super soft and puts no pressure on her head.", rating: 5, date: "2 days ago" },
        { author: "Faisal Al-Otaibi - Riyadh", text: "Premium medical quality and highly effective. Got it for my baby boy for air travel and it blocks engine sounds wonderfully. Stretchy cotton strap is extremely soft and easy to adjust. Highly recommended!", rating: 5, date: "4 days ago" },
        { author: "Munira Al-Harbi - Dubai", text: "Fast delivery and great customer service from Sahab. The ear cups are lightweight, well-padded, and medical-grade safe. Our baby falls asleep instantly without any disturbance.", rating: 5, date: "2 days ago" }
      ];
    }
    if (productId === 'kids_ice_cream_bubble_maker') {
      return lang === 'ar' ? [
        { author: "أم يزن - الرياض", text: "يا الله على الفكرة الذكية والجميلة! بنتي كانت ترفض الاستحمام وتصيح، الحين تترجى تبي تسبح عشان تسوي آيس كريم رغوة وتلعب بالأقماع الملونة. جودة البلاستيك ممتازة وتثبت على الجدار بقوة.", rating: 5, date: "قبل يومين" },
        { author: "سليمان - الخبر", text: "منتج بطل بطل! ميكانيكي بالكامل يدوي يعني آمن تماماً بدون بطاريات ولا تيار كهربائي، مجرد تصب سائل الاستحمام وشوية موية وتطلع رغوة كثيفة رهيبة. أولادي مستانسين فيها وكل شوي يسوون آيس كريم فقاعات.", rating: 5, date: "قبل ٤ أيام" },
        { author: "نورة الدوسري - المنامة", text: "توصيل سريع والتغليف فخم وراقي ومناسب لتقديمه كهدية مميزة. الرغوة تطلع مثل سوفت سيرف آيس كريم، واللعبة صنعت أجواء مرحة وخيالية لا توصف بالاستحمام.", rating: 5, date: "قبل يومين" }
      ] : [
        { author: "Um Yazan - Riyadh", text: "What a brilliant and creative idea! My toddler used to throw tantrums before bathing, now she literally begs to take a bath just to play making ice cream foam. The plastic quality is solid, and suction is very powerful.", rating: 5, date: "2 days ago" },
        { author: "Suleiman - Khobar", text: "Outstanding toy! Fully manual mechanical device with no battery hazards in water, which gives complete peace of mind. Just pour some body bath gel with water and pull the lever. Rich, dense micro-bubbles form instantly. Five stars!", rating: 5, date: "4 days ago" },
        { author: "Noura Al-Dossari - Manama", text: "Fast delivery, beautifully boxed and makes a fantastic birthday gift. The foam flows exactly like real soft-serve ice cream. Made bathing incredibly fun and tear-free for my toddlers.", rating: 5, date: "2 days ago" }
      ];
    }
    return lang === 'ar' ? [
      { author: "أم يوسف - الرياض", text: "الخامة جداً ناعمة وخالية من المواد الكيمائية الضارة، طفلي يرتاح جداً بالمنتج وسهلة التعقيم والمسح المباشر.", rating: 5, date: "قبل ٣ أيام" },
      { author: "ماريا • دبي", text: "الخامات رائعة والقطع ناعمة جداً على بشرة طفلي وجاءت مغلفة بقمة الأناقة والصحة. سأطلب كميات أخرى قريباً.", rating: 5, date: "قبل أسبوع" },
      { author: "سارة العتيبي - جدة", text: "أكثر ما يعجبني هو تفاصيل حماية الأمن والسلامة للرضع، خفيف والعلب آمنة وخالية من المواد الضارة تماماً.", rating: 5, date: "قبل يومين" }
    ] : [
      { author: "Um Youssef - Riyadh", text: "The material is extremely soft and completely free from hazardous chemical additions. Safe, comfortable, and easy to sterilize/wash.", rating: 5, date: "3 days ago" },
      { author: "Maria - Dubai", text: "Excellent botanical colors and premium safety structure. Packed with high elegance and medical care. Will order more presets soon!", rating: 5, date: "1 week ago" },
      { author: "Sarah Al-Otaibi - Jeddah", text: "I highly appreciate the deep focus on newborn safety and BPA-free certifications. Lightweight, soft peach cosmetics, and sturdy built.", rating: 5, date: "2 days ago" }
    ];
  };

  // Filtering products
  const filteredProducts = products.filter(p => {
    const details = getProductDetails(p, language);
    const matchesSearch = 
      details.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      details.description.toLowerCase().includes(searchQuery.toLowerCase());
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

  const calculateTotalUsd = () => {
    return cart.reduce((total, item) => {
      const prices = getProductPrices(item.product, config.markupMultiplier, selectedCountry, language);
      return total + (prices.usdRetailPrice * item.quantity);
    }, 0);
  };

  const calculateTotalLocal = () => {
    return cart.reduce((total, item) => {
      const prices = getProductPrices(item.product, config.markupMultiplier, selectedCountry, language);
      return total + (prices.localPrice * item.quantity);
    }, 0);
  };

  // Checkout submit handler
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const newOrderId = 'SAB-2026-' + Math.floor(1000 + Math.random() * 9000);
    const primarySource = cart[0].product.source === 'Manual' ? 'AliExpress' : cart[0].product.source;

    const localCurrencyString = language === 'ar' ? selectedCountry.currency : selectedCountry.currencyEn;

    const newOrder: Order = {
      id: newOrderId,
      customerName: checkoutName,
      customerPhone: checkoutPhone,
      customerEmail: checkoutEmail,
      customerAddress: checkoutAddress,
      items: [...cart],
      totalPrice: Number(calculateTotalLocal().toFixed(selectedCountry.code === 'KW' ? 3 : 1)),
      currency: localCurrencyString,
      status: 'pending',
      date: new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US') + ' - ' + new Date().toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US'),
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
      date: language === 'ar' ? "الآن" : "Just now"
    };

    setCustomReviews(prev => ({
      ...prev,
      [productId]: [newRev, ...(prev[productId] || [])]
    }));

    setReviewAuthor('');
    setReviewText('');
    setReviewRating(5);
  };

  const selectedProductDetails = selectedProduct ? getProductDetails(selectedProduct, language) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-10">
      
      {/* Top promotional banner styled with high editorial aesthetic */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#feedda] via-[#ffebd5] to-[#fde1ce] border border-[#fbd6b8] p-6 sm:p-10 mb-8 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ff7c5c] px-3 py-1 text-[10px] font-bold text-white shadow-sm mb-4">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>{t.banner_tag}</span>
          </span>
          <h2 className="text-2xl font-extrabold text-[#2f251e] sm:text-4xl leading-snug">
            {t.banner_title}
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-[#7e6b5c] leading-relaxed max-w-lg">
            {t.banner_desc}
          </p>
          
          <div className="mt-6 flex flex-wrap gap-4 text-[11px] font-bold text-[#6c594c]">
            <span className="flex items-center gap-1 bg-white/75 border border-[#fcddc3] px-3 py-1.5 rounded-xl">{t.banner_bullet1}</span>
            <span className="flex items-center gap-1 bg-white/75 border border-[#fcddc3] px-3 py-1.5 rounded-xl">{t.banner_bullet2}</span>
            <span className="flex items-center gap-1 bg-white/75 border border-[#fcddc3] px-3 py-1.5 rounded-xl">{t.banner_bullet3}</span>
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
          {categoryKeys.map((catKey, idx) => {
            const displayLabel = t.categories[catKey] || catKey;
            return (
              <button
                key={idx}
                onClick={() => setSelectedCategory(catKey)}
                className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all border shrink-0 ${
                  selectedCategory === catKey
                    ? 'bg-[#2f251e] text-white border-transparent'
                    : 'bg-white text-[#6c594c] border-[#ecdcc9] hover:border-[#ff7c5c] hover:text-[#ff7c5c]'
                }`}
              >
                {displayLabel}
              </button>
            );
          })}
        </div>

        {/* Filter Indicator */}
        <div className="flex items-center gap-1.5 bg-white border border-[#ecdcc9] px-3 py-2 rounded-xl shrink-0">
          <span className="text-[10px] font-extrabold text-[#8e7a6b]">{t.exclusivity}</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-8 max-w-md relative">
        <input
          type="text"
          placeholder={t.review_placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full text-xs font-medium rounded-2xl border border-[#ecdcc9] bg-white py-3 text-[#2f251e] placeholder-gray-400 focus:border-[#ff7c5c] focus:outline-none focus:ring-1 focus:ring-[#ff7c5c] transition-all ${language === 'ar' ? 'pl-4 pr-10' : 'pl-10 pr-4'}`}
        />
        <Search className={`absolute top-3 w-4.5 h-4.5 text-gray-400 ${language === 'ar' ? 'right-3.5' : 'left-3.5'}`} />
      </div>

      {/* Product Catalog Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((p) => {
          const isLiked = likedProducts.includes(p.id);
          const details = getProductDetails(p, language);
          const prices = getProductPrices(p, config.markupMultiplier, selectedCountry, language);

          return (
            <div
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              className="group relative cursor-pointer flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-[#e8dcd0] p-4 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
            >
              
              {/* Product Visual Container */}
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#faf6f2] mb-4">
                <img
                  src={p.imageUrl}
                  alt={details.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* Like floating button */}
                <button
                  onClick={(e) => toggleLike(p.id, e)}
                  className={`absolute top-2.5 flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 backdrop-blur-md shadow-sm transition-all hover:bg-white ${
                    language === 'ar' ? 'right-2.5' : 'left-2.5'
                  } ${isLiked ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500'}`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>

                {/* Safety Badge */}
                {details.safetyRating && (
                  <span className={`absolute bottom-2.5 inline-flex items-center gap-1 rounded-lg bg-emerald-50/90 backdrop-blur-md border border-emerald-100 px-2 py-1 text-[9px] font-bold text-emerald-800 ${
                    language === 'ar' ? 'right-2.5' : 'left-2.5'
                  }`}>
                    🛡️ {t.bpa_free}
                  </span>
                )}

              </div>

              {/* Text Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold text-[#A69384] mb-1 uppercase tracking-wide flex items-center gap-1.5">
                    <span>{details.category}</span>
                    <span>•</span>
                    <span className="text-amber-600">{t.age_label}: {details.ageGroup}</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-[#2f251e] line-clamp-2 leading-relaxed min-h-[40px] group-hover:text-[#ff7c5c] transition-colors">
                    {details.title}
                  </h3>
                </div>

                {/* Pricing / CTA row */}
                <div className="mt-4 flex flex-col pt-3 border-t border-[#faf2e9]/50">
                  <div className="flex items-center justify-between w-full gap-2">
                    <div>
                      <div className="text-[10px] text-gray-400 line-through font-mono">
                        ${(prices.usdRetailPrice * 1.3).toFixed(2)} USD
                      </div>
                      <div className="text-md font-black text-[#ff7c5c] font-mono leading-none flex items-baseline gap-1">
                        <span>{prices.usdFormatted}</span>
                        <span className="text-[10px] text-gray-400 font-bold font-sans">USD</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p);
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2f251e] hover:bg-[#ff7c5c] text-white transition-all shrink-0"
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-[10px] font-bold text-[#6c594c] mt-1.5 bg-[#fdf8f4] border border-[#f5eadc] px-2 py-1 rounded-lg text-center">
                    {t.equivalent} <strong className="text-orange-700 font-mono">{prices.localFormatted}</strong>
                  </div>
                </div>
              </div>

            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-400 text-xs">
            {t.no_products_found}
          </div>
        )}
      </div>

      {/* CHECKOUT SUCCESS MODAL */}
      {checkoutSuccessCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white border border-emerald-100 p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4 animate-bounce">
              <Check className="h-8 w-8" />
            </div>
            
            <h3 className="text-lg font-extrabold text-[#2f251e] mb-2">{t.success_received}</h3>
            <p className="text-xs text-[#6c594c] leading-relaxed mb-4">
              {t.success_desc}
            </p>
            <div className="bg-[#f0faf4] px-4 py-2 rounded-xl text-md font-mono font-black text-emerald-700 inline-block border border-emerald-100 mb-6">
              #{checkoutSuccessCode}
            </div>

            <div className={`text-xs text-[#8e7a6b] bg-amber-50 rounded-2xl p-3 border border-amber-100 leading-relaxed mb-6 font-medium ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              💡 <strong>{t.success_tip_label}</strong> {t.success_tip_desc}
            </div>

            <button
              onClick={() => setCheckoutSuccessCode(null)}
              className="w-full rounded-2xl bg-[#2f251e] hover:bg-black text-white font-bold text-xs py-3.5 transition-all"
            >
              {t.continue_shopping}
            </button>
          </div>
        </div>
      )}

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && selectedProductDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl rounded-3xl bg-white border border-[#e8dcd0] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Close button */}
            <button
              onClick={() => {
                setSelectedProduct(null);
                setReviewAuthor('');
                setReviewText('');
              }}
              className={`absolute top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#fdf8f4] hover:bg-[#ff7c5c] hover:text-white text-gray-500 transition-all border border-[#f2e2d2] z-10 ${language === 'ar' ? 'left-4' : 'right-4'}`}
            >
              ✕
            </button>

            {/* Layout grid: Product images right / description left */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              
              {/* Product Media */}
              <div>
                <div className="aspect-square w-full overflow-hidden rounded-2xl bg-[#faf6f2] border border-gray-150 relative">
                  {selectedProduct.videoUrl && activeMedia === 'video' ? (
                    <video
                      src={selectedProduct.videoUrl}
                      controls
                      autoPlay
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={selectedImgUrl || selectedProduct.imageUrl}
                      alt={selectedProductDetails.title}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>

                {/* Media Switcher (Images & Video) */}
                {((selectedProduct.images && selectedProduct.images.length > 0) || selectedProduct.videoUrl) && (
                  <div className="flex flex-wrap gap-2.5 mt-3 justify-center items-center">
                    {(selectedProduct.images && selectedProduct.images.length > 0
                      ? selectedProduct.images
                      : [selectedProduct.imageUrl]
                    ).map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedImgUrl(img);
                          setActiveMedia('image');
                        }}
                        className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                          activeMedia === 'image' && (selectedImgUrl === img || (!selectedImgUrl && img === selectedProduct.imageUrl))
                            ? 'border-[#ff7c5c] ring-2 ring-[#ff7c5c]/20'
                            : 'border-[#e8dcd0]'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Product Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}

                    {/* Video option */}
                    {selectedProduct.videoUrl && (
                      <button
                        onClick={() => setActiveMedia('video')}
                        className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 bg-black flex items-center justify-center transition-all shrink-0 ${
                          activeMedia === 'video' ? 'border-[#ff7c5c] ring-2 ring-[#ff7c5c]/20' : 'border-[#e8dcd0]'
                        }`}
                      >
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                          <span className="text-white bg-[#ff7c5c] px-1.5 py-0.5 rounded font-extrabold text-[8px] uppercase tracking-wider">
                            فيديو
                          </span>
                        </div>
                        <img
                          src={selectedProduct.imageUrl}
                          alt="Video Thumbnail"
                          className="w-full h-full object-cover opacity-65"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    )}
                  </div>
                )}

                {/* Safety certification disclaimer bottom of media */}
                <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl text-[11px] leading-relaxed">
                  <span className="font-extrabold block mb-1">{t.certified_safety}</span>
                  <div>{selectedProductDetails.safetyRating || t.certified_safety_desc}</div>
                </div>
              </div>

              {/* Product specs, features, buy options */}
              <div className="flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center gap-1 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 mb-2">
                    {selectedProductDetails.category}
                  </span>
                  
                  <h3 className="text-md sm:text-lg font-extrabold text-[#2f251e] leading-snug mb-2">{selectedProductDetails.title}</h3>
                  
                  {/* Rating / source */}
                  <div className="flex items-center gap-2 text-xs mb-4">
                    <div className="flex text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <Star className="h-3.5 w-3.5 fill-current" />
                    </div>
                    <span className="text-[#8e7a6b]">{t.details_reviews_count}</span>
                  </div>

                  {/* Prices */}
                  <div className="bg-[#faf4ee] p-4 rounded-2xl border border-[#ecdcc9] mb-4">
                    <div className="text-[11px] text-[#8e7a6b]">{t.product_store_price_title}</div>
                    <div className="text-xl font-black text-[#ff7c5c] font-mono mt-0.5 flex flex-wrap items-center gap-2">
                       <span>{getProductPrices(selectedProduct, config.markupMultiplier, selectedCountry, language).usdFormatted} USD</span>
                       <span className="text-xs font-bold text-[#8e7a6b] bg-white border border-[#e8dcd0] px-2.5 py-1 rounded-xl">
                         {t.equivalent} <strong className="text-[#ff7c5c]">{getProductPrices(selectedProduct, config.markupMultiplier, selectedCountry, language).localFormatted}</strong>
                       </span>
                       <span className="text-[10px] font-normal text-gray-400 block w-full mt-1">{t.shipping_tax_inclusive}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#7e6b5c] leading-relaxed mb-4">{selectedProductDetails.description}</p>

                  {/* Highlights Bullet list */}
                  <div className="mb-4">
                    <div className="text-xs font-bold text-[#2f251e] mb-2">{t.features_title}</div>
                    <ul className="text-xs text-[#6c594c] space-y-1.5 list-inside">
                      {(selectedProductDetails.features && selectedProductDetails.features.length > 0 ? selectedProductDetails.features : [
                        language === 'ar' ? "آمن على اللثة الحساسة وبشرة المواليد الفائقة النعومة" : "100% Gentle and safe for fragile baby development",
                        language === 'ar' ? "سهل التنظيف والتعقيم الحراري بمرونة عالية" : "Sterilizable medical structure with great flexibility",
                        language === 'ar' ? "أشكال تعزز القدرات المعرفية اللمسية للأطفال" : "Geometric shapes to guide toddler fine cognitive skills"
                      ]).map((feat: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technical Table Specs */}
                  <div className="border-t border-[#f4eade] pt-3 mb-6">
                    <div className="text-xs font-bold text-[#2f251e] mb-2">{t.specs_title}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(selectedProductDetails.specs || {}).map(([key, val]) => (
                        <div key={key} className="flex gap-1 py-1 px-2 bg-gray-50 rounded">
                          <span className="text-[#8e7a6b] font-medium">{key}:</span>
                          <span className="text-gray-900 font-bold">{val as string}</span>
                        </div>
                      ))}
                      <div className="flex gap-1 py-1 px-2 bg-gray-50 rounded">
                        <span className="text-[#8e7a6b] font-medium">{t.target_age}</span>
                        <span className="text-gray-900 font-bold">{selectedProductDetails.ageGroup || t.infant}</span>
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
                    <span>{t.add_to_cart}</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                    }}
                    className="rounded-2xl border border-[#ecdcc9] bg-white hover:bg-gray-50 text-xs text-[#6c594c] px-4 font-bold transition-all"
                  >
                    {t.close_details}
                  </button>
                </div>

              </div>
            </div>

            {/* Custom Interactive Reviews Section */}
            <div className="mt-8 pt-6 border-t border-[#e8dcd0]">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-[#a49182] mb-4 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>{t.reviews_title}</span>
              </h4>

              {/* Write a review box */}
              <div className="bg-[#faf4ee]/40 rounded-2xl border border-[#ecdcc9]/70 p-4 mb-6">
                <div className="text-xs font-bold text-[#2f251e] mb-2">{t.write_review_title}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2">
                  <input 
                    type="text" 
                    placeholder={t.author_placeholder}
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    className="rounded-xl border border-[#ecdcc9] bg-white text-xs p-2.5 focus:border-[#ff7c5c] focus:outline-none"
                  />
                  <div className="flex items-center gap-2 bg-white rounded-xl border border-[#ecdcc9] p-2">
                    <span className="text-[10px] text-gray-400 font-bold shrink-0">{t.rating_placeholder}</span>
                    <select 
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="text-xs font-bold outline-none flex-1 text-amber-600 bg-transparent cursor-pointer"
                    >
                      <option value="5">{t.excellent}</option>
                      <option value="4">{t.very_good}</option>
                      <option value="3">{t.average}</option>
                    </select>
                  </div>
                </div>
                <textarea 
                  placeholder={t.review_text_placeholder}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full h-16 rounded-xl border border-[#ecdcc9] bg-white text-xs p-2.5 focus:border-[#ff7c5c] focus:outline-none mb-2"
                />
                <button
                  type="button"
                  onClick={() => submitReview(selectedProduct.id)}
                  className="rounded-xl bg-[#2f251e] hover:bg-black text-white font-bold text-[11px] px-4 py-2 transition-all"
                >
                  {t.publish_review}
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
                {getProductPresetReviews(selectedProduct.id, language).map((rev, idx) => (
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
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={() => setIsCartOpen(false)} />

          <div className={`pointer-events-none fixed inset-y-0 flex max-w-full ${language === 'ar' ? 'left-0 pr-10' : 'right-0 pl-10'}`}>
            <div className={`pointer-events-auto w-screen max-w-md bg-white shadow-2xl transition-transform ${language === 'ar' ? 'border-r border-[#e8dcd0]' : 'border-l border-[#e8dcd0]'}`}>
              <div className="flex h-full flex-col justify-between p-6">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#faf2e9] pb-4">
                  <h3 className="text-md font-extrabold text-[#2f251e] flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-[#ff7c5c]" />
                    <span>{t.cart_title}</span>
                  </h3>
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckingOut(false);
                    }}
                    className="text-gray-400 hover:text-gray-650 font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto mt-4 px-1 space-y-4">
                  {!isCheckingOut ? (
                    /* CART PRODUCTS LIST */
                    cart.length === 0 ? (
                      <div className="p-12 text-center text-gray-400 text-xs">{t.cart_empty}</div>
                    ) : (
                      cart.map((item) => {
                        const itemDetails = getProductDetails(item.product, language);
                        const itemPrices = getProductPrices(item.product, config.markupMultiplier, selectedCountry, language);

                        return (
                          <div key={item.product.id} className="flex gap-4 p-3 rounded-2xl bg-[#faf6f2]/80 border border-[#ecdcc9]/50 hover:bg-[#faf6f2]">
                            <img className="h-14 w-14 object-cover rounded-xl" src={item.product.imageUrl} alt="" referrerPolicy="no-referrer" />
                            <div className="flex-1">
                              <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{itemDetails.title}</h4>
                              <div className="text-[10px] text-orange-600 font-bold mt-0.5">{t.age_group_cart}: {itemDetails.ageGroup}</div>
                              
                              <div className="flex items-center justify-between mt-3">
                                <div>
                                  <div className="text-xs font-bold text-[#ff7c5c] font-mono">
                                    ${(itemPrices.usdRetailPrice * item.quantity).toFixed(2)} USD
                                  </div>
                                  <div className="text-[10px] text-gray-500 font-bold">
                                    ({(itemPrices.localPrice * item.quantity).toFixed(selectedCountry.code === 'KW' ? 3 : 1)} {language === 'ar' ? selectedCountry.currency : selectedCountry.currencyEn})
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                                    className="h-6 w-6 rounded bg-white hover:bg-gray-100 border text-xs font-bold flex items-center justify-center cursor-pointer"
                                  >
                                    -
                                  </button>
                                  <span className="text-xs font-bold font-mono">{item.quantity}</span>
                                  <button 
                                    onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                    className="h-6 w-6 rounded bg-white hover:bg-gray-100 border text-xs font-bold flex items-center justify-center cursor-pointer"
                                  >
                                    +
                                  </button>
                                  <button 
                                    onClick={() => removeFromCart(item.product.id)}
                                    className="text-rose-600 hover:text-rose-800 ml-2 cursor-pointer"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )
                  ) : (
                    /* CHECKOUT FORM VIEW */
                    <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-1">
                      <div className="flex items-center gap-1 text-xs text-[#8e7a6b] mb-4 bg-orange-50 border border-orange-100 p-2.5 rounded-xl">
                        <ArrowLeft className={`h-4 w-4 text-[#ff7c5c] shrink-0 ${language === 'en' ? 'rotate-180' : ''}`} />
                        <span>{t.checkout_tip}</span>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">{t.customer_fullname}</label>
                        <input
                          type="text"
                          required
                          value={checkoutName}
                          placeholder={t.fullname_placeholder}
                          onChange={(e) => setCheckoutName(e.target.value)}
                          className={`w-full text-xs font-medium rounded-xl border border-[#ecdcc9] bg-white px-3 py-2 text-gray-900 focus:border-[#ff7c5c] focus:outline-none ${language === 'ar' ? 'text-right' : 'text-left'}`}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">{t.mobile_label}</label>
                        <input
                          type="tel"
                          required
                          value={checkoutPhone}
                          placeholder={t.mobile_placeholder}
                          onChange={(e) => setCheckoutPhone(e.target.value)}
                          className={`w-full text-xs font-medium rounded-xl border border-[#ecdcc9] bg-white px-3 py-2 text-gray-950 tracking-wide focus:border-[#ff7c5c] focus:outline-none ${language === 'ar' ? 'text-right' : 'text-left'}`}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">{t.email_label}</label>
                        <input
                          type="email"
                          required
                          value={checkoutEmail}
                          placeholder={t.email_placeholder}
                          onChange={(e) => setCheckoutEmail(e.target.value)}
                          className="w-full text-xs font-medium rounded-xl border border-[#ecdcc9] bg-white px-3 py-2 text-gray-950 text-left focus:border-[#ff7c5c] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">{t.address_label}</label>
                        <textarea
                          required
                          value={checkoutAddress}
                          placeholder={t.address_placeholder}
                          onChange={(e) => setCheckoutAddress(e.target.value)}
                          className={`w-full text-xs font-medium rounded-xl border border-[#ecdcc9] bg-white px-3 py-2 text-gray-900 focus:border-[#ff7c5c] focus:outline-none h-20 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                        />
                      </div>

                      <div className="pt-2 border-t border-[#faf2e9]">
                        <button
                          type="submit"
                          className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 transition-all text-center shadow-md shadow-emerald-600/10 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Lock className="h-4 w-4" />
                          <span>{t.secure_checkout}</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Subtotal & Action Footer */}
                {!isCheckingOut && cart.length > 0 && (
                  <div className="border-t border-[#f4eade] pt-4 mt-4 space-y-3">
                    <div className="flex justify-between items-center text-xs text-gray-900 border-b border-[#faf2e9] pb-2">
                      <span className="font-bold">{t.subtotal_usd}</span>
                      <span className="text-md font-black text-[#ff7c5c] font-mono">${calculateTotalUsd().toFixed(2)} USD</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-900">
                      <span className="font-bold">{t.subtotal_local}</span>
                      <span className="text-lg font-black text-emerald-600 font-mono">
                        {calculateTotalLocal().toFixed(selectedCountry.code === 'KW' ? 3 : 1)} {language === 'ar' ? selectedCountry.currency : selectedCountry.currencyEn}
                      </span>
                    </div>
                    
                    <div className="text-[10px] text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl flex items-center gap-1.5 leading-relaxed">
                      <Truck className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                      <span>{t.qualified_free_shipping}</span>
                    </div>

                    <button
                      onClick={() => setIsCheckingOut(true)}
                      className="w-full rounded-2xl bg-gradient-to-r from-[#2f251e] to-black hover:from-[#ff7c5c] hover:to-[#ff7c5c] hover:text-white text-white font-extrabold text-xs py-3.5 transition-all flex items-center justify-center gap-2 shadow-md shadow-[#2f251e]/15 cursor-pointer"
                    >
                      <span>{t.proceed_to_checkout}</span>
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
