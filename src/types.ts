export interface BabyProduct {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  price: number; // in Local Currency (e.g., SAR)
  priceUsd: number; // original price on CJ/Ali
  source: 'AliExpress' | 'CJDropshipping' | 'Manual';
  sourceUrl: string;
  imageUrl: string;
  category: string;
  stock: number;
  ageGroup: string;
  safetyRating: string; // e.g. "خامات طبية خالية من BPA"
  features: string[];
  specs: { [key: string]: string };
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  items: {
    product: BabyProduct;
    quantity: number;
  }[];
  totalPrice: number;
  currency?: string;
  status: 'pending' | 'processing' | 'shipped' | 'fulfilled';
  date: string;
  dropshipSource: 'AliExpress' | 'CJDropshipping' | 'None';
  trackingNumber?: string;
  syncAttempts?: number;
}

export interface ImportConfig {
  markupMultiplier: number; // default e.g. 1.8
  targetCurrency: 'SAR' | 'AED' | 'USD';
  autoFulfill: boolean;
  defaultStock: number;
}

export interface SyncLog {
  id: string;
  timestamp: string;
  type: 'import' | 'fulfill' | 'inventory_sync';
  platform: 'AliExpress' | 'CJDropshipping';
  status: 'success' | 'warning' | 'error';
  message: string;
}

export interface CountryOption {
  code: string;
  name: string;
  nameEn: string;
  flag: string;
  currency: string;
  currencyEn: string;
  rate: number;
}

export const countryOptions: CountryOption[] = [
  { code: 'SA', name: 'المملكة العربية السعودية', nameEn: 'Saudi Arabia', flag: '🇸🇦', currency: 'ر.س', currencyEn: 'SAR', rate: 3.75 },
  { code: 'AE', name: 'الإمارات العربية المتحدة', nameEn: 'United Arab Emirates', flag: '🇦🇪', currency: 'د.إ', currencyEn: 'AED', rate: 3.67 },
  { code: 'KW', name: 'دولة الكويت', nameEn: 'Kuwait', flag: '🇰🇼', currency: 'د.ك', currencyEn: 'KWD', rate: 0.31 },
  { code: 'QA', name: 'دولة قطر', nameEn: 'Qatar', flag: '🇶🇦', currency: 'ر.ق', currencyEn: 'QAR', rate: 3.64 },
  { code: 'BH', name: 'مملكة البحرين', nameEn: 'Bahrain', flag: '🇧🇭', currency: 'د.ب', currencyEn: 'BHD', rate: 0.38 },
  { code: 'OM', name: 'سلطنة عُمان', nameEn: 'Oman', flag: '🇴🇲', currency: 'ر.ع', currencyEn: 'OMR', rate: 0.38 },
  { code: 'US', name: 'الولايات المتحدة', nameEn: 'United States', flag: '🇺🇸', currency: 'USD', currencyEn: 'USD', rate: 1.00 },
];

export const productTranslations: { [productId: string]: any } = {
  "suction_cup_spinners": {
    title: "Baby Suction Cup Spinner Bath Toys Set - 3pcs Colorful Cartoon Toys",
    description: "Interactive spinning toys with strong suction caps that easily attach to bathtubs, windows, or high chairs. Made of high-quality, non-toxic BPA-free ABS plastic with soft smooth edges to protect little fingers. Perfect for fine motor skills development, visual focus, and bath-time sensory entertainment with its gentle rattle sound.",
    category: "Educational Toys & Skill Development",
    ageGroup: "3 months and older",
    safetyRating: "100% BPA-free food-grade silicone & ABS plastic with rounded safe edges",
    features: [
      "Strong suction cups stick firmly to all smooth surfaces like tiles, glass, or tubs",
      "Smooth and lasting rotation attracts baby attention and improves hand-eye coordination",
      "Built-in subtle rattle beads generate gentle sounds to boost sensory development",
      "Rounded design without sharp corners, entirely safe for chewing and tactile touch"
    ],
    specs: {
      "Material": "Food-grade soft silicone & eco-friendly sturdy ABS plastic",
      "Count": "3-piece cartoon shape collection (Bee, Butterfly, Ladybug)",
      "Suitable Age": "3 months to 3 years old",
      "Maintenance": "Washable and waterproof, simple to wipe down or sanitize with warm water"
    }
  },
  "imported_bath_bombs": {
    title: "12pcs Organic Kids Bubble Bath Bombs Set with Surprise Toys",
    description: "Effervescent organic bath bombs rich in nourishing natural butter and organic essential oils. Gentle for baby & kids skin. Each fizzy ball contains a surprise animal toy inside to make bathing an interactive, fun, and relaxing experience right before bedtime sleep.",
    category: "Baby Care & Health",
    ageGroup: "1 year - 8 years",
    safetyRating: "Tear-free hypoallergenic natural ingredients & BPA-free toys",
    features: [
      "100% natural and gentle essential oils safe for kid's skin care",
      "Contains 12 fun animal capsule toys hidden inside",
      "Softens skin with organic sweet almond oil and sea minerals",
      "No chemical pigments - completely stain-free and safe for bathtubs"
    ],
    specs: {
      "Material": "Organic Essential Oils, Sweet Almond Oil & Sea Minerals",
      "Count": "12 individually wrapped bath bombs with inner capsule toys",
      "Direct Shipping": "Express tracked shipment via AliExpress Direct",
      "Selected Option": "Ocean-Box 1"
    }
  },
  "preset_1": {
    title: "Silicone Waterproof Soft Baby Bibs",
    description: "Soft baby bib made of 100% safe food-grade silicone. It features a wide pocket to catch falling food, is extremely easy to clean, sanitize, and wash. Lightweight and gentle on baby's neck with adjustable settings.",
    category: "Feeding & Nursing",
    ageGroup: "4 months - 3 years",
    safetyRating: "Certified healthy silicone materials 100% free of BPA & Lead",
    features: [
      "Waterproof and anti-bacterial, wipes clean in seconds",
      "Deep 3D pocket stays open to catch food scraps",
      "Adjustable comfortable neck strap grow with your child",
      "Very light and bendable for easy traveling packages"
    ],
    specs: {
      "Material": "100% Soft Food-Grade Silicone",
      "Origin": "Certified supplier via AliExpress",
      "Available Colors": "Soft Peach, Sandy, Mint Green, Cloud Gray",
      "Product Weight": "80g"
    }
  },
  "preset_2": {
    title: "Natural Wooden Educational Blocks Set",
    description: "Premium solid wooden blocks set to teach your child stacking and simple engineering. Ultra-smooth edges and natural water-based safe paint to develop fine motor skills and creative cognitive vision.",
    category: "Educational & Skill Toys",
    ageGroup: "1 - 6 years",
    safetyRating: "Non-toxic safe water paint with organic botanical colors",
    features: [
      "Develops concentration, analysis, and geometric builder skills",
      "Sustainable natural wood with high durability and rounded edges",
      "Included cotton storage bag for simple packing organization",
      "Perfect size for toddlers to prevent choking hazards"
    ],
    specs: {
      "Material": "Sustainable Natural Beech Wood",
      "Pieces": "24 diverse geometric blocks",
      "Supplier": "Logistics Partner via CJDropshipping",
      "Certifications": "Complies with European Toy Safety standards EN71"
    }
  },
  "preset_3": {
    title: "Safe Electric Baby Nail Trimmer Set",
    description: "Smart trimmer with ultra-quiet motor and LED light to trim infant nails gently without hurting the skin. Comes with multiple speed levels and heads customized for newborns to adults.",
    category: "Baby Care & Health",
    ageGroup: "Newborn and older",
    safetyRating: "Cushioned foam heads to avoid direct abrasive friction on baby's skin",
    features: [
      "Whisper quiet motor (35dB) for trimming nails while infant is asleep",
      "Built-in front LED light for precise visibility in dim rooms",
      "6 specialized polishing heads (3 for infants, 3 for toddlers & parents)",
      "Operates on 2 AA batteries with dual speed and rotation modes"
    ],
    specs: {
      "Power": "2 AA Batteries required (not included)",
      "Included Accessories": "Shockproof padded travel storage case",
      "Logistics Origin": "Direct fast shipping via AliExpress warehouses",
      "Dimensions": "13.2 cm x 4.3 cm"
    }
  },
  "preset_4": {
    title: "Smart Portable Baby Bottle Warmer",
    description: "Rechargeable portable bottle warmer powered by USB battery for absolute baby care outdoors. Maintains the heat of milk or water precisely with instant temp sensor.",
    category: "Feeding & Nursing",
    ageGroup: "Newborn to 2 years",
    safetyRating: "Medical grade 316 anti-oxidation stainless steel",
    features: [
      "Fast heating in 5 minutes to scientific optimal temperature (37-50°C)",
      "5000 mAh rechargeable lithium battery lasts for 4-6 warming rounds",
      "Compatible with 90% of global leading baby bottles with gaskets",
      "Lightweight travel design easily fits into backpacks"
    ],
    specs: {
      "Battery": "5000 mAh USB Type-C",
      "Temp Accuracy": "±1°C dual digital reader",
      "Body Material": "Eco-friendly non-toxic medical ABS",
      "Weight": "Only 290g"
    }
  },
  "preset_5": {
    title: "Organic Bamboo Soft Swaddle Blanket",
    description: "Antibacterial and hypoallergenic organic bamboo cotton swaddle. Woven structure mimicking a mother's warm holding, ultra-soft and breathable material to prevent sweating and help newborns sleep deeply.",
    category: "Sleep & Comfort",
    ageGroup: "0 - 18 months",
    safetyRating: "Organic woven bamboo fiber free from chemical bleach",
    features: [
      "Naturally anti-bacterial to protect fragile baby skin",
      "Self-ventilated fabric regulates temperature and prevents suffocation",
      "Slight elasticity ensures easy and safe baby swaddling",
      "Gets softer and cozier with every single wash"
    ],
    specs: {
      "Composition": "70% Organic Bamboo & 30% Premium Cotton",
      "Size": "120 cm x 120 cm comfortable jumbo size",
      "Express Fulfillment": "CJ Dropshipping warehouses (Riyadh & Dubai)",
      "Wash Instructions": "Gentle machine wash with low temperature"
    }
  }
};

export function getProductDetails(p: BabyProduct, lang: 'ar' | 'en') {
  if (lang === 'ar') {
    return {
      title: p.title,
      description: p.description,
      category: p.category,
      ageGroup: p.ageGroup,
      safetyRating: p.safetyRating,
      features: p.features || [],
      specs: p.specs || {}
    };
  }

  const preset = productTranslations[p.id];
  if (preset) {
    return preset;
  }

  // Dynamic fallback for newly imported or custom products
  let categoryEn = p.category;
  if (p.category === 'أدوات الرضاعة والتغذية') categoryEn = 'Feeding & Nursing';
  else if (p.category === 'ألعاب تعليمية وتنمية مهارات') categoryEn = 'Educational & Skill Toys';
  else if (p.category === 'رعاية وصحة الرضع') categoryEn = 'Baby Care & Health';
  else if (p.category === 'مستلزمات النوم والراحة') categoryEn = 'Sleep & Comfort';

  // Translate specific standard words
  let ageEn = p.ageGroup || 'Baby';
  if (ageEn.includes('أشهر')) ageEn = ageEn.replace('أشهر', 'months');
  if (ageEn.includes('سنتين')) ageEn = ageEn.replace('سنتين', '2 years');
  if (ageEn.includes('سنة')) ageEn = ageEn.replace('سنة', 'year');
  if (ageEn.includes('سنوات')) ageEn = ageEn.replace('سنوات', 'years');
  if (ageEn.includes('منذ الولادة فما فوق')) ageEn = 'Newborn and older';

  let safetyEn = p.safetyRating || 'Verified Safety';
  if (safetyEn.includes('خامات سيليكون صحية معتمدة')) safetyEn = 'Certified Healthy Silicone';
  if (safetyEn.includes('طلاء مائي آمن غير سام')) safetyEn = 'Safe Aquatic Paints';
  if (safetyEn.includes('الفولاذ المقاوم للصدأ الصحي')) safetyEn = 'Surgical Stainless Steel';
  if (safetyEn.includes('ألياف بامبو منسوجة عضوية')) safetyEn = 'Organic Bamboo Fiber Swaddle';
  if (safetyEn.includes('رؤوس إسفنجية لتفادي الاحتكاك')) safetyEn = 'Soft Foam Trimming Heads';

  // Return a clean localized fallback
  return {
    title: p.titleEn || p.title,
    description: p.description,
    category: categoryEn,
    ageGroup: ageEn,
    safetyRating: safetyEn,
    features: p.features || [],
    specs: p.specs || {}
  };
}

export function getProductPrices(p: BabyProduct, markupMultiplier: number, selectedCountry: CountryOption, lang: 'ar' | 'en' = 'ar') {
  const usdRetailPrice = p.priceUsd ? (p.priceUsd * markupMultiplier) : (p.price / 3.75);
  const usdFormatted = `$${usdRetailPrice.toFixed(2)}`;
  const localPrice = usdRetailPrice * selectedCountry.rate;
  const currencyString = lang === 'ar' ? selectedCountry.currency : selectedCountry.currencyEn;
  const localFormatted = `${localPrice.toFixed(selectedCountry.code === 'KW' ? 3 : 1)} ${currencyString}`;
  
  return {
    usdRetailPrice,
    usdFormatted,
    localPrice,
    localFormatted
  };
}

export const translations = {
  ar: {
    promo_text: "✨ عروض حصرية للأمهات: شحن سريع ومجاني لجميع مدن الخليج العربي عند تجاوز سلتك 150 ريال 🌟",
    banner_tag: "منتجات طبية خالية من الـ BPA ورائعة للرضع",
    banner_title: "العناية الغيمية الهادئة بجيل الغد الفاخر",
    banner_desc: "نوفر في سحاب للأطفال باقة منتقاة بعناية وموثوقية فائقة من مستلزمات العناية وألعاب الرضع الطبيعية المصممة خصيصاً لصحة طفلك واطمئنانك.",
    banner_bullet1: "🛡️ حماية خامات البامبو",
    banner_bullet2: "🚀 شحن متتبع مباشر للخليج",
    banner_bullet3: "☁️ سيليكون مرن فائق النعومة",
    all: "الكل",
    categories: {
      "الكل": "الكل",
      "أدوات الرضاعة والتغذية": "أدوات الرضاعة والتغذية",
      "ألعاب تعليمية وتنمية مهارات": "ألعاب تعليمية وتنمية مهارات",
      "رعاية وصحة الرضع": "رعاية وصحة الرضع",
      "مستلزمات النوم والراحة": "مستلزمات النوم والراحة"
    },
    review_placeholder: "ابحث عن منتجات العناية بالطفل، الألعاب، أو المرايل...",
    exclusivity: "تشكيلة حصرية فاخرة للأمهات",
    bpa_free: "جودة معتمدة",
    age_label: "سن",
    equivalent: "ما يعادل",
    shipping_tax_inclusive: "شامل ضريبة القيمة المضافة والشحن السريع",
    reviews_title: "الآراء والتقييمات الموثقة من الأمهات",
    write_review_title: "اكتبي تقييمك الخاص للمنتج:",
    author_placeholder: "اسمك مستخدم (مثال: أم شهد - الدمام)",
    rating_placeholder: "التقييم بالنجمات:",
    excellent: "⭐⭐⭐⭐⭐ (رائع جداً)",
    very_good: "⭐⭐⭐⭐ (جيد جداً)",
    average: "⭐⭐⭐ (متوسط الأداء)",
    review_text_placeholder: "اكتبي تجربتك الصادقة عن جودة المادة، الملمس، وعناية الطفل...",
    publish_review: "نشر المراجعة على الفور",
    certified_safety: "🛡️ مؤشر السلامة والأمن المعتمد:",
    certified_safety_desc: "خالٍ من ملحقات اللدائن وخامات مكررة آمنة لجلد أصابع الرضع حديثي الولادة.",
    details_reviews_count: "(عشرة مراجعات موثقة من أمهات حقيقيات)",
    product_store_price_title: "سعر البيع النهائي للعميل بالمتجر:",
    features_title: "أبرز المميزات والمزايا:",
    specs_title: "المواصفات الفنية المربوطة بالجرد:",
    target_age: "السن المستهدف:",
    infant: "حديثي الولادة",
    add_to_cart: "إرسال وتعبئة في حقيبة التسوق",
    close_details: "إغلاق التفاصيل",
    no_products_found: "لا توجد منتجات مطابقة لخيارات الفلترة أو مصطلحات البحث الحالية.",
    cart_title: "حقيبة المشتريات والطلب",
    cart_empty: "سلة التسوق فارغة حالياً. اضف بعض المنتجات للرضيع للبدء.",
    age_group_cart: "الفئة العمرية",
    checkout_tip: "يرجى كتابة معلومات الشحن والتوصيل أدناه لتأمين الدفع الفوري والمحاكاة.",
    customer_fullname: "اسم العميل الثلاثي:",
    fullname_placeholder: "مثال: يوسف بن عبدالرحمن العتيبي",
    mobile_label: "رقم الهاتف الجوال للاتصال:",
    mobile_placeholder: "مثال: 0501234567",
    email_label: "البريد الإلكتروني للعميل:",
    email_placeholder: "youssef@example.com",
    address_label: "عنوان التسليم والتوصيل بالتفصيل:",
    address_placeholder: "المنطقة، المدينة، اسم الشارع ورقم المبنى (مثال: حي الياسمين، الرياض)",
    secure_checkout: "إتمام الدفع الآمن وإنهاء المشتريات",
    subtotal_usd: "المجموع لمنتجات الرضّع (بالدولار):",
    subtotal_local: "المجموع لمنتجات الرضّع (بالعملة المحلية):",
    qualified_free_shipping: "تهانينا! طفلك مؤهل لشحن سريع ومجاني للرضع والخليج العربي.",
    proceed_to_checkout: "الانتقال لإرسال الطلب وإدخال الفواتير",
    track_banner: "تتبع شحنات سحاب للأطفال الفورية",
    track_title: "بوابة تتبع طلبات سحاب الذكية للأطفال",
    track_desc: "أدخلي كود تتبع الطلب الخاص بطفلك والمكون من (SAB-2026-XXXX) الذي تلقيتِه في نهاية الفاتورة لمشاهدة حالة الشحنة فوراً مباشرة في متجرنا بالتفصيل.",
    track_placeholder: "مثال: SAB-2026-6824",
    track_query_btn: "استعلام وتتبع الآن",
    track_loading: "جاري البحث والاستفسار من قاعدة البيانات...",
    track_error_empty: "الرجاء إدخال كود الطلب بشكل صحيح.",
    track_error_fallback: "خطأ أثناء محاولة تتبع الطلب. الرجاء التحقق من كود الطلب.",
    track_error_connection: "تعذر الاتصال بخادم بوابة تتبع شحنات سحاب للأطفال.",
    order_unique_no: "رقم الطلب الفريد:",
    purchase_date: "تاريخ الشراء:",
    delivery_method: "طريقة التوصيل:",
    delivery_method_desc: "توصيل منزلي سريع وآمن",
    grand_total_bill: "إجمالي فاتورة سحاب للأطفال:",
    timeline_title: "مخطط تتبع حالة شحنة الرضيع اللحظي",
    copiable_shipcode_label: "رمز الشحنة الدولي:",
    copiable_shipcode_desc: "يمكنك استخدام هذا الرمز لتتبع طرد طفلك مع شركات التوصيل المحلية بمجرد وصوله للمملكة/الخليج:",
    copy_success: "✓ تم نسخ رقم التتبع واللوجستيات بنجاح!",
    address_node_title: "بيانات عنوان تسليم الرضيع المسجلة",
    customer_name: "اسم العميل:",
    mobile_phone: "الهاتف الجوال:",
    detailed_address: "العنوان التفصيلي:",
    infants_in_box: "مستلزمات الأطفال في الطرد",
    imported_inspected: "مستورد ومفحوص",
    qty: "الكمية:",
    health_priority: "صحة طفلك هي أولويتنا: جميع مستلزمات سحاب مفحوصة بدقة فائقة ومعبأة بصناديق مفرغة من الهواء للتأمين الطبي الشامل ومطابقة لمعايير الجودة العالمية لحماية الرضع.",
    logo_sub: "للأطفال",
    logo_desc: "أرقى مستلزمات العناية وألعاب الأطفال الآمنة والشهادات المعتمدة",
    nav_shop: "تسوق المنتجات",
    nav_track: "تتبع حالة الطلبات",
    currency_label: "العملة",
    language_label: "اللغة",
    success_received: "تم استلام طلبك وتأكيد التسوية المبدئية!",
    success_desc: "شكراً لتسوقك معنا في سحاب للأطفال. تم تدوين طلبك برقم مرجعي مميز:",
    success_tip_label: "تلميح لتتبع طرد طفلك:",
    success_tip_desc: "انسخي رمز تتبع الطلب أعلاه ثم توجهي إلى تبويب «تتبع حالة الطلبات» في أعلى شريط العناوين للاستعلام الفوري والمباشر عن تجهيز الشحنة ومسار الطائرة.",
    continue_shopping: "متابعة التسوق ومواصلة الاستعراض",
    preparing_warehouse: "جاري تحضير مستودع سحاب للأطفال...",
    bouncy_p1: "نقوم الآن بفرز المنتجات وتأمين اتصال مشفر بقاعدة البيانات",
    footer_p1: "الخيار الأمثل للأمهات الخليجيات الباحثات عن معايير الأمان وخامات البامبو الطبيعي للرضع.",
    footer_p2: "شحن سريع للرياض، دبي، المنامة، مسقط وبقية مدن الخليج",
    rights: "جميع الحقوق محفوظة © ٢٠٢٦",
    brand_main: "سحاب للأطفال",
    brand_sub: "Sahab Kids",
    // timeline
    step1_title: "تأكيد الطلب المبدئي",
    step1_desc: "تم تسجيل طلب الرضيع بنجاح ودخل نظام التدقيق والتعقيم.",
    step2_title: "تجهيز وتعقيم الشحنة",
    step2_desc: "يتم الآن فرز منتجات العناية بالطفل للتأكد من مطابقتها لأعلى معايير الأمان وخلو المواد من البلاستيك الضار الـ BPA.",
    step3_title: "مغادرة الشحنة والترانزيت",
    step3_desc: "تم نقل الشحنة وتسليمها لخط الطيران الدولي المباشر المتجه إلى الخليج العربي.",
    step4_title: "اكتمل التسليم والاستلام والتدقيق",
    step4_desc: "تم تسليم طرد مستلزمات الأطفال لعنوانك بأمان وراحة تامة."
  },
  en: {
    promo_text: "✨ Exclusive Offer: Free express shipping to Gulf countries on orders above $40! 🌟",
    banner_tag: "Certified BPA-free baby products",
    banner_title: "Cloud-Like Gentle Care for Tomorrow's Generation",
    banner_desc: "At Sahab Kids, we provide a premium, hand-picked collection of safe baby essentials and natural wooden toys designed with care for your child's health.",
    banner_bullet1: "🛡️ Bamboo Fiber Health",
    banner_bullet2: "🚀 Direct Tracker Gulf Shipping",
    banner_bullet3: "☁️ Ultra-Soft Elastic Silicone",
    all: "All",
    categories: {
      "الكل": "All",
      "أدوات الرضاعة والتغذية": "Feeding & Nursing",
      "ألعاب تعليمية وتنمية مهارات": "Educational & Skill Toys",
      "رعاية وصحة الرضع": "Baby Care & Health",
      "مستلزمات النوم والراحة": "Sleep & Comfort"
    },
    review_placeholder: "Search baby products, educational toys, and bamboo bibs...",
    exclusivity: "Exclusive Premium Mother's Collection",
    bpa_free: "Certified",
    age_label: "Age",
    equivalent: "Equivalent to",
    shipping_tax_inclusive: "Includes VAT and Express Delivery",
    reviews_title: "Verified Mothers' Ratings and Reviews",
    write_review_title: "Write your honest review:",
    author_placeholder: "Your Name (e.g., Sarah - Riyadh)",
    rating_placeholder: "Rating stars:",
    excellent: "⭐⭐⭐⭐⭐ (Excellent)",
    very_good: "⭐⭐⭐⭐ (Very Good)",
    average: "⭐⭐⭐ (Average)",
    review_text_placeholder: "Describe your real experience with material softness, durability, and baby health...",
    publish_review: "Post Review Instantly",
    certified_safety: "🛡️ Safe Children index:",
    certified_safety_desc: "Clinical grade material entirely safe for newborn fingers and mouths.",
    details_reviews_count: "(10 verified reviews from real mothers)",
    product_store_price_title: "Final Selling Retail Price:",
    features_title: "Key Features and Highlights:",
    specs_title: "Technical Inventory Specifications:",
    target_age: "Target Age:",
    infant: "Newborn",
    add_to_cart: "Add to Shopping Bag",
    close_details: "Close details",
    no_products_found: "No products matched the selected filters or search terms.",
    cart_title: "Your Shopping Bag",
    cart_empty: "Your shopping bag is empty. Add products to begin.",
    age_group_cart: "Age",
    checkout_tip: "Please enter your delivery and shipping information below to test simulation checkout.",
    customer_fullname: "Customer Full Name:",
    fullname_placeholder: "e.g. Sarah J. Al-Otaibi",
    mobile_label: "Mobile phone number:",
    mobile_placeholder: "e.g. 0501234567",
    email_label: "Customer Email Address:",
    email_placeholder: "sarah@example.com",
    address_label: "Detailed Delivery Address:",
    address_placeholder: "District, City, Street, Building (e.g. Al Yasmin District, Riyadh)",
    secure_checkout: "Proceed to Secure Mock Checkout",
    subtotal_usd: "Subtotal in USD:",
    subtotal_local: "Subtotal in Local Currency:",
    qualified_free_shipping: "Hooray! You qualified for free express courier shipment to the Arabian Gulf.",
    proceed_to_checkout: "Proceed with Delivery and Billing details",
    track_banner: "Live Sahab Kids Tracking Service",
    track_title: "Sahab Smart Baby Order Tracking Gateway",
    track_desc: "Enter your unique customer tracker token (SAB-2026-XXXX) received at checkout to query the real-time shipping status and air transit status.",
    track_placeholder: "e.g. SAB-2026-6824",
    track_query_btn: "Track & Query Now",
    track_loading: "Querying secure backend database layers...",
    track_error_empty: "Please enter your tracking code correctly.",
    track_error_fallback: "Failed to locate order. Please check the reference key.",
    track_error_connection: "Cannot connect to Sahab Kids logistics mainframe database servers.",
    order_unique_no: "Order Reference Code:",
    purchase_date: "Date of Purchase:",
    delivery_method: "Delivery Option:",
    delivery_method_desc: "Home Delivery (Direct Express Channel)",
    grand_total_bill: "Total Invoiced Amount:",
    timeline_title: "Real-time Product Shipping Milestone Status",
    copiable_shipcode_label: "International Cargo reference:",
    copiable_shipcode_desc: "You can use this token to track updates with your local delivery carriers once it lands in your port:",
    copy_success: "✓ Logistics code copied successfully!",
    address_node_title: "Registered Shipping Details",
    customer_name: "Recipient Name:",
    mobile_phone: "Mobile Phone:",
    detailed_address: "Delivery Destination:",
    infants_in_box: "Baby Essentials Included in Package",
    imported_inspected: "Inspected & Sterilized",
    qty: "Qty:",
    health_priority: "Your baby’s health is our utmost priority: all Sahab kids products are strictly sterilized, packaged under vacuum-sealed containers, and certified medically to protect newborns.",
    logo_sub: "For Kids",
    logo_desc: "The finest safe baby items, certified biological materials and skill toys.",
    nav_shop: "Shop Catalog",
    nav_track: "Track Shipments",
    currency_label: "Currency",
    language_label: "Language",
    success_received: "We received your request successfully!",
    success_desc: "Thanks for shopping at Sahab Kids. Your order reference is:",
    success_tip_label: "Tracking Tip:",
    success_tip_desc: "Copy the unique reference above and paste it within the 'Track Shipments' tab in the navbar to see sanitization, packing, and flight status.",
    continue_shopping: "Continue browsing original products",
    preparing_warehouse: "Preparing Sahab Kids digital catalog...",
    bouncy_p1: "Syncing items and checking secure database logs",
    footer_p1: "The perfect destination for Gulf mothers looking for premium safe bamboo baby essentials.",
    footer_p2: "Express delivery to Riyadh, Jeddah, Dubai, Manama, Muscat and all Gulf cities.",
    rights: "All Rights Reserved © 2026",
    brand_main: "Sahab Kids",
    brand_sub: "For Children",
    // timeline
    step1_title: "Order Received & Verified",
    step1_desc: "The infant's request was recorded and entered sanitization screening checks.",
    step2_title: "Sterilization & Security Packing",
    step2_desc: "Products are sorted under strict medical-grade guidelines to ensure zero BPA or toxins.",
    step3_title: "Cargo Dispatched & Transit",
    step3_desc: "Handed over to direct international flight routes bound for the GCC countries.",
    step4_title: "Delivered & Audited Successfully",
    step4_desc: "The package has been delivered safely at your destination address."
  }
};
