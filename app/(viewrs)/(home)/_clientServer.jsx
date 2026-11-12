'use client';

import AddToCartButton from '../../(products)/_addToTheCart'; // Adjust the path based on your project structure
import { fetchData } from "@/lib/fetchData";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  ChevronLeft,
  Star,
  Loader,
  Truck,
  Shield,
  Headphones,
  Award,
  ShoppingCart,
  ArrowRight,
  Zap,
  Cpu,
  MonitorSpeaker,
  Gamepad2,
  HardDrive,
  Smartphone,
  RefreshCw,
  Heart,
  Wrench,
  Store,
  BadgePercent,
  Printer,
  CreditCard,
} from 'lucide-react';

// Icon mapping for features and categories
const iconMap = {
  truck: Truck,
  shield: Shield,
  headphones: Headphones,
  award: Award,
  smartphone: Smartphone,
  cpu: Cpu,
  monitorSpeaker: MonitorSpeaker,
  zap: Zap,
  gamepad2: Gamepad2,
  hardDrive: HardDrive,
};

// Enhanced Skeleton Loader Component
const SkeletonLoader = ({ count = 4 }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 animate-pulse">
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="bg-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8"
      >
        <div className="w-full h-48 sm:h-56 md:h-64 bg-gray-200 rounded-xl sm:rounded-2xl mb-3 sm:mb-4"></div>
        <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4 mb-2 sm:mb-3"></div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-full mb-1 sm:mb-2"></div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-5/6 mb-3 sm:mb-4"></div>
        <div className="h-4 sm:h-5 bg-gray-200 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

// Enhanced Product Card Component - بتصميم مستلهم من كروت "الأكثر مبيعاً"
// (شارة أعلى، زر مفضلة، سعر بعد الخصم والسعر الأصلي مشطوب)
// ملحوظة: الكارت بقى h-full + flex-col، والمحتوى النصي flex-1، وزرار
// "اضف الي السلة" اتحط في مكان ثابت آخر الكارت (mt-auto) عشان كل الكروت
// في نفس الصف تبقى بنفس الطول وزرار السلة يبقى على نفس الخط بالظبط
// حتى لو اسم/وصف المنتج اختلف طوله.
const ProductCard = ({ product, categoryKey }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem('wishlist')) || [];
      setIsWishlisted(list.some((p) => String(p) === String(product.id)));
    } catch {
      setIsWishlisted(false);
    }
  }, [product.id]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const list = JSON.parse(localStorage.getItem('wishlist')) || [];
      const exists = list.some((p) => String(p) === String(product.id));
      const next = exists
        ? list.filter((p) => String(p) !== String(product.id))
        : [...list, product.id];
      localStorage.setItem('wishlist', JSON.stringify(next));
      setIsWishlisted(!exists);
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    } catch (err) {
      console.error('wishlist error', err);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transform group-hover:scale-[1.02] transition-all duration-500 border border-gray-100">
      <Link
        href={`/${categoryKey}/${product.id}`}
        className="group block"
        aria-label={`عرض تفاصيل ${product.name}`}
      >
        <div className="relative overflow-hidden bg-gray-50">
          {!imageError ? (
            <>
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={256}
                className={`w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-700 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageError(true)}
                loading="lazy"
              />
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <Loader className="w-6 sm:w-8 h-6 sm:h-8 text-gray-400 animate-spin" />
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-48 sm:h-56 md:h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="text-gray-500 text-center">
                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gray-400 rounded-full mx-auto mb-2 opacity-50"></div>
                <span className="text-xs sm:text-sm">صورة غير متاحة</span>
              </div>
            </div>
          )}

          {product.badge && (
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-normal shadow-md">
                {product.badge}
              </span>
            </div>
          )}
          {product.discount && (
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
              <span className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-normal shadow-md">
                خصم {product.discount}%
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={toggleWishlist}
            aria-label={isWishlisted ? 'إزالة من المفضلة' : 'أضف إلى المفضلة'}
            className={`absolute ${
              product.badge ? 'bottom-2 sm:bottom-4' : 'top-2 sm:top-4'
            } right-2 sm:right-4 bg-white/90 backdrop-blur p-2 rounded-full shadow-md hover:scale-110 transition-transform`}
          >
            <Heart
              size={18}
              className={
                isWishlisted ? 'text-red-500 fill-current' : 'text-gray-500'
              }
            />
          </button>
        </div>
      </Link>

      {/* المحتوى النصي - flex-1 عشان ياخد المساحة المتاحة، والعناصر
          المتغيرة الطول (الاسم/الوصف/التقييم) بتتحط فوق، وزرار السلة
          بيتثبت تحت بـ mt-auto عشان يبقى على نفس الخط في كل كروت الصف */}
      <div className="p-4 sm:p-6 md:p-8 flex-1 flex flex-col">
        <Link href={`/${categoryKey}/${product.id}`}>
          <h4 className="text-lg sm:text-xl md:text-2xl font-normal text-gray-900 mb-2 sm:mb-3 line-clamp-2 min-h-[3.5rem] sm:min-h-[4rem] hover:text-purple-600 transition-colors">
            {product.name}
          </h4>
        </Link>
        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
          {product.description ||
            product.specs?.processor ||
            'منتج عالي الجودة'}
        </p>

        <div className="flex items-center mb-3 sm:mb-4 min-h-[1.5rem]">
          {product.rating && (
            <>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 sm:w-5 h-4 sm:h-5 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm sm:text-base text-gray-600 mr-2">
                ({product.rating})
              </span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between mb-2">
          <div>
            {product.originalPrice && (
              <span className="text-sm sm:text-base text-gray-400 line-through ml-2">
                {typeof product.originalPrice === 'number'
                  ? product.originalPrice.toLocaleString()
                  : product.originalPrice}{' '}
                {product.currency || 'ج.م'}
              </span>
            )}
            <span className="text-xl sm:text-2xl md:text-3xl font-normal text-purple-600">
              {typeof product.price === 'number'
                ? product.price.toLocaleString()
                : product.price}
              <span className="text-sm sm:text-base md:text-lg mr-1">
                {product.currency || 'ج.م'}
              </span>
            </span>
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-normal px-2.5 py-1 rounded-full">
            <CreditCard size={12} />
            تقسيط بدون فوائد متاح
          </span>
        </div>

        {/* mt-auto بيثبت الزرار في آخر الكارت دايماً على نفس المحور
            الأفقي مع باقي كروت نفس الصف */}
        <div className="mt-auto">
          <AddToCartButton product={product}>اضف الي السلة</AddToCartButton>
        </div>
      </div>
    </div>
  );
};

// Enhanced Category Section Component with better error handling
const CategorySection = ({ endpoint, apiUrl, initialProducts = [] }) => {
  const [categoryData, setCategoryData] = useState(
    initialProducts.length > 0
      ? {
          ...endpoint,
          products: initialProducts,
        }
      : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);
  const hasLoadedRef = useRef(initialProducts.length > 0);

  const fetchCategoryData = useCallback(async () => {
    if (hasLoadedRef.current || loading) return;

    setLoading(true);
    setError(null);
    hasLoadedRef.current = true;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetchData(`${apiUrl}?collection=${endpoint.key}`, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();

        let products = [];
        if (Array.isArray(result) && result.length > 0) {
          if (result[0].products) {
            products = result[0].products;
          } else if (result[0].data?.products) {
            products = result[0].data.products;
          }
        }

        const availableProducts = products.filter(
          (product) =>
            product.details?.isAvailable !== false &&
            product.details?.stock !== 0
        );

        setCategoryData({
          ...endpoint,
          products: availableProducts.slice(0, 4),
        });
      } else {
        throw new Error(`خطأ في الخادم: ${response.status}`);
      }
    } catch (err) {
      console.error(`Error fetching ${endpoint.key}:`, err);
      if (err.name === 'AbortError') {
        setError('انتهت مهلة الطلب، حاول مرة أخرى');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint.key, apiUrl, endpoint]);

const cachedData = categoryData;


  useEffect(() => {
    if (initialProducts.length > 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoadedRef.current) {
            fetchCategoryData();
          }
        });
      },
      { rootMargin: '200px', threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [fetchCategoryData, initialProducts.length]);

  const IconComponent = endpoint.icon;

  const handleRetry = useCallback(() => {
    hasLoadedRef.current = false;
    setError(null);
    fetchCategoryData();
  }, [fetchCategoryData]);

  return (
    <div ref={sectionRef} className="mb-12 sm:mb-16 md:mb-20">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center">
          <div
            className={`bg-gradient-to-r ${endpoint.color} w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ml-3 sm:ml-4`}
          >
            <IconComponent className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-normal text-gray-900">
            {endpoint.name}
          </h3>
        </div>
        <Link
          href={`/${endpoint.key}`}
          className="text-purple-600 hover:text-purple-800 font-normal flex items-center group text-sm sm:text-base"
          aria-label={`عرض جميع منتجات ${endpoint.name}`}
        >
          عرض الكل
          <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 mr-1 sm:mr-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-8 sm:py-12">
          <SkeletonLoader />
        </div>
      )}

      {/* Products Grid - items-stretch عشان كل الكروت في الصف تاخد نفس
          ارتفاع أطول عنصر في الصف، وبعدين الكارت نفسه بيستخدم h-full +
          flex-col + mt-auto على الزرار عشان يبقوا كلهم على نفس الخط */}
      {cachedData?.products && cachedData.products.length > 0 && !loading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 items-stretch">
          {cachedData.products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryKey={endpoint.href}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {cachedData?.products && cachedData.products.length === 0 && !loading && (
        <div className="text-center py-8 sm:py-12">
          <div className="bg-gray-100 rounded-2xl sm:rounded-3xl p-8 sm:p-12">
            <IconComponent className="w-12 sm:w-16 h-12 sm:h-16 mx-auto text-gray-400 mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-gray-600">
              لا توجد منتجات متاحة في هذه الفئة حالياً
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-8 sm:py-12">
          <div className="bg-red-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <p className="text-red-500 mb-3 sm:mb-4 text-sm sm:text-base">
              خطأ في تحميل منتجات {endpoint.name}: {error}
            </p>
            <button
              onClick={handleRetry}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center mx-auto text-sm sm:text-base"
            >
              <RefreshCw className="w-3 sm:w-4 h-3 sm:h-4 ml-2" />
              إعادة المحاولة
            </button>
          </div>
        </div>
      )}

      {/* Placeholder State */}
      {!cachedData && !loading && !error && (
        <div className="text-center py-8 sm:py-12">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl p-8 sm:p-12 opacity-50">
            <IconComponent className="w-12 sm:w-16 h-12 sm:h-16 mx-auto text-gray-400 mb-3 sm:mb-4" />
            <p className="text-gray-500 text-sm sm:text-base">
              سيتم تحميل {endpoint.name} عند التمرير إليها
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// الصور الافتراضية للسلايدر الرئيسي (بنفس تصنيفات المتجر الحقيقية) - بقت
// 6 شرائح بدل 3 عشان السلايدر يتنوع أكتر، بتتستخدم لو مفيش بيانات hero
// جاية من قاعدة البيانات.
const DEFAULT_HERO_SLIDES = [
  {
    id: 'default-1',
    title: 'أحدث اللابتوبات بأفضل الأسعار',
    subtitle: 'اداء قوي، بطارية تدوم، وضمان محلي على كل الأجهزة',
    backgroundImage:
      'https://images.unsplash.com/photo-1706101126602-5a6132b98b8b?auto=format&fit=crop&w=1600&q=80',
    href: '/laptop',
    buttonText: 'تسوق اللابتوبات',
  },
  {
    id: 'default-2',
    title: 'جمّع جهازك بنفسك',
    subtitle: 'مكونات أصلية لأقوى تجميعات الجيمينج والعمل',
    backgroundImage:
      'https://images.unsplash.com/photo-1660855551740-4474188debdb?auto=format&fit=crop&w=1600&q=80',
    href: '/pc-builds',
    buttonText: 'اطلب تجميعتك',
  },
  {
    id: 'default-3',
    title: 'شاشات وإكسسوارات تكمل تجربتك',
    subtitle: 'شاشات عالية الدقة وإكسسوارات متنوعة لكل استخدام',
    backgroundImage:
      'https://images.unsplash.com/photo-1616440537338-1d04df3987f7?auto=format&fit=crop&w=1600&q=80',
    href: '/monitors',
    buttonText: 'اكتشف الشاشات',
  },
  {
    id: 'default-4',
    title: 'مكونات كمبيوتر أصلية 100%',
    subtitle: 'معالجات، رامات، وكروت شاشة بأفضل الأسعار وضمان الوكيل',
    backgroundImage:
      'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=1600&q=80',
    href: '/component',
    buttonText: 'تسوق المكونات',
  },
  {
    id: 'default-5',
    title: 'اكسسوارات تناسب أسلوبك',
    subtitle: 'ماوس ولوحات مفاتيح وسماعات جيمنج ومكتبية متنوعة',
    backgroundImage:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1600&q=80',
    href: '/accessories',
    buttonText: 'اكتشف الاكسسوارات',
  },
  {
    id: 'default-6',
    title: 'وسائط تخزين سريعة وموثوقة',
    subtitle: 'أقراص SSD وهارد ديسك وفلاشات بسعات مختلفة',
    backgroundImage:
      'https://images.unsplash.com/photo-1620368523635-df9d83338fc1?auto=format&fit=crop&w=1600&q=80',
    href: '/storage-devices',
    buttonText: 'تسوق وسائط التخزين',
  },
];

// Enhanced Hero Section Component
const HeroSection = ({ heroData }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // عايزين السلايدر يقلّب بين 6 صور دايمًا. لو جاي عدد شرائح من قاعدة
  // البيانات أقل من 6، بنكمل العدد من الصور الافتراضية (من غير تكرار
  // نفس الـ id)، ولو مفيش بيانات أصلاً بنستخدم الافتراضية كاملة.
  const dbSlides = heroData?.slides || [];
  const slides =
    dbSlides.length >= 6
      ? dbSlides
      : [
          ...dbSlides,
          ...DEFAULT_HERO_SLIDES.filter(
            (def) => !dbSlides.some((s) => s.id === def.id)
          ),
        ].slice(0, 6);

  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const goPrev = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goNext = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <section className="bg-white">
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 pb-4 sm:pb-6">
        <div className="flex items-center gap-2 sm:gap-4">
          {slides.length > 1 && (
            <button
              onClick={goPrev}
              aria-label="الشريحة السابقة"
              className="hidden sm:flex shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gray-100 hover:bg-gray-200 items-center justify-center text-gray-700 transition-colors"
            >
              <ChevronRight size={22} />
            </button>
          )}

          <div className="relative flex-1 h-[180px] sm:h-[250px] md:h-[320px] lg:h-[320px] overflow-hidden bg-gray-900 rounded-xl sm:rounded-2xl">
            {slides.map((slide, index) => (
              <div
                key={slide.id || index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.05) 100%), url(${slide.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="flex items-center h-full">
                  <div className="text-white max-w-xl px-4 sm:px-8 md:px-10 lg:px-12">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal mb-2 sm:mb-4 animate-fade-in-up">
                      {slide.title}
                    </h1>
                    <p className="text-xs sm:text-base md:text-lg mb-3 sm:mb-6 opacity-90 animate-fade-in-up animation-delay-200">
                      {slide.subtitle}
                    </p>
                    <Link href={slide.href || '/laptop'}>
                      <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full text-xs sm:text-base font-normal hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-400">
                        {slide.buttonText || heroData?.buttonText || 'تسوق الآن'}
                        <ArrowRight className="w-3.5 sm:w-5 h-3.5 sm:h-5 inline mr-2" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {slides.length > 1 && (
              <div className="absolute bottom-3 sm:bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'bg-white w-6 sm:w-8'
                        : 'bg-white/50 w-1.5 sm:w-2'
                    }`}
                    aria-label={`الانتقال إلى الشريحة ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {slides.length > 1 && (
            <button
              onClick={goNext}
              aria-label="الشريحة التالية"
              className="hidden sm:flex shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gray-100 hover:bg-gray-200 items-center justify-center text-gray-700 transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

// شريط ميزات سريع (صيانة / استلام من الفرع / تقسيط) - نفس فكرة صف
// الخدمات اللي بيظهر فوق الهيرو في التصميم المرجعي.
const QuickFeaturesStrip = () => {
  const items = [
    {
      icon: Wrench,
      title: 'الصيانة',
      href: '/contact',
    },
    {
      icon: Store,
      title: 'الاستلام من الفرع',
      href: '/location',
    },
    {
      icon: BadgePercent,
      title: 'اقساط',
      href: '/laptop',
    },
  ];

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <Link
                key={i}
                href={item.href}
                className="flex items-center justify-center gap-2 bg-brand-blue-light hover:bg-blue-100 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 transition-colors"
              >
                <span className="font-normal text-gray-800 text-sm sm:text-base">
                  {item.title}
                </span>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// بانر التقسيط (زي بانر VALU البرتقالي في التصميم المرجعي) - بيّن هنا
// بشكل عام يناسب أي متجر بدل ما نخترع اسم شركة تقسيط مش موجودة عندنا.
const InstallmentBanner = () => (
  <section className="bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
      <div className="bg-[rgb(253,89,0)] rounded-xl sm:rounded-2xl overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-3 sm:py-4 text-white">
          <div className="flex items-center gap-2 font-normal text-sm sm:text-lg">
            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
            قسّط منتجاتك على 12 شهر
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm font-normal">
            <span className="bg-white/15 px-2.5 sm:px-3 py-1 rounded-full">
              0% مقدم
            </span>
            <span className="bg-white/15 px-2.5 sm:px-3 py-1 rounded-full">
              0% فوائد
            </span>
            <span className="bg-white/15 px-2.5 sm:px-3 py-1 rounded-full">
              0% مصاريف إدارية
            </span>
          </div>
          <span className="text-xs sm:text-sm font-normal bg-white text-[rgb(253,89,0)] px-3 py-1 rounded-full">
            بسعر الكاش
          </span>
        </div>
      </div>
    </div>
  </section>
);

// صف أيقونات التصنيفات الحقيقية أسفل الهيرو (نفس تصنيفات المتجر بالظبط)
const CATEGORY_RAIL_ITEMS = [
  {
    key: 'laptop',
    href: '/laptop',
    name: 'اللابتوبات',
    image:
      'https://images.unsplash.com/photo-1658312226966-29bd4e77c62c?auto=format&fit=crop&w=200&q=80',
  },
  {
    key: 'component',
    href: '/component',
    name: 'المكونات',
    image:
      'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=200&q=80',
  },
  {
    key: 'pc-builds',
    href: '/pc-builds',
    name: 'تجميعات PC',
    image:
      'https://images.unsplash.com/photo-1660855551740-4474188debdb?auto=format&fit=crop&w=200&q=80',
  },
  {
    key: 'accessories',
    href: '/accessories',
    name: 'الاكسسوارات',
    image:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=200&q=80',
  },
  {
    key: 'storage-devices',
    href: '/storage-devices',
    name: 'وسائط تخزين',
    image:
      'https://images.unsplash.com/photo-1620368523635-df9d83338fc1?auto=format&fit=crop&w=200&q=80',
  },
  {
    key: 'monitors',
    href: '/monitors',
    name: 'الشاشات',
    image:
      'https://images.unsplash.com/photo-1616440537338-1d04df3987f7?auto=format&fit=crop&w=200&q=80',
  },
  {
    key: 'pos',
    href: '/pos',
    name: 'نقاط البيع',
    image:
      'https://images.unsplash.com/photo-1647427017067-8f33ccbae493?auto=format&fit=crop&w=200&q=80',
  },
  {
    key: 'printers',
    href: '/printers',
    name: 'الطابعات',
    image:
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=200&q=80',
  },
  {
    key: 'other',
    href: '/other',
    name: 'منتجات أخرى',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80',
  },
];

const CategoryIconRail = () => {
  const scrollRef = useRef(null);
  const scrollBy = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir * 200,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 relative">
        <button
          onClick={() => scrollBy(1)}
          aria-label="التالي"
          className="hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 items-center justify-center text-gray-600 hover:text-purple-600 z-10"
        >
          <ChevronRight size={18} />
        </button>
        <div
          ref={scrollRef}
          className="flex items-start justify-center flex-wrap gap-5 sm:gap-10 overflow-x-auto no-scrollbar scroll-smooth px-1"
        >
          {CATEGORY_RAIL_ITEMS.map((cat) => (
            <Link
              key={cat.key}
              href={cat.href}
              className="flex flex-col items-center gap-2 shrink-0 group w-20 sm:w-24"
            >
              <div className="w-16 h-20 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-50 border border-gray-100 group-hover:border-purple-200 transition-colors">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
        <button
          onClick={() => scrollBy(-1)}
          aria-label="السابق"
          className="hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 items-center justify-center text-gray-600 hover:text-purple-600 z-10"
        >
          <ChevronLeft size={18} />
        </button>
      </div>
    </section>
  );
};

// Main HomePage Component
const HomePage = ({ initialData, apiUrl }) => {
const [homeData] = useState(initialData?.homeData);

  const [featuredProducts] = useState(initialData?.featuredProducts || []);

  // قائمة بجميع الـ endpoints - اللابتوبات بقت أول قسم يظهر في الصفحة
  // الرئيسية بدل الاكسسوارات
  const endpoints = [
    {
      key: 'laptop',
      href: 'laptop',
      name: 'اللابتوبات',
      icon: iconMap.cpu,
      color: 'from-blue-600 to-cyan-600',
    },
    {
      key: 'accessories',
      href: 'accessories',
      name: 'الاكسسوارات',
      icon: iconMap.smartphone,
      color: 'from-purple-600 to-blue-600',
    },
    {
      key: 'monitors',
      href: 'monitors',
      name: 'الشاشات',
      icon: iconMap.monitorSpeaker,
      color: 'from-green-600 to-emerald-600',
    },
    {
      key: 'component',
      href: 'component',
      name: 'المكونات',
      icon: iconMap.zap,
      color: 'from-red-600 to-pink-600',
    },
    {
      key: 'other',
      href: 'other',
      name: 'منتجات أخرى',
      icon: iconMap.hardDrive,
      color: 'from-orange-600 to-yellow-600',
    },
    {
      key: 'pc-build',
      href: 'pc-builds',
      name: 'تجميع الكمبيوتر',
      icon: iconMap.gamepad2,
      color: 'from-indigo-600 to-purple-600',
    },
    {
      key: 'pos',
      href: 'pos',
      name: 'نقاط البيع',
      icon: iconMap.award,
      color: 'from-pink-600 to-rose-600',
    },
    {
      key: 'printers',
      href: 'printers',
      name: 'الطابعات',
      icon: iconMap.truck,
      color: 'from-teal-600 to-cyan-600',
    },
    {
      key: 'storage-devices',
      href: 'storage-devices',
      name: 'أجهزة التخزين',
      icon: iconMap.hardDrive,
      color: 'from-gray-600 to-slate-600',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* شريط الميزات السريعة (صيانة / استلام من الفرع / تقسيط) */}
      <QuickFeaturesStrip />

      {/* بانر التقسيط */}
      <InstallmentBanner />

      {/* Hero Section */}
      <HeroSection heroData={homeData?.hero} />

      {/* صف أيقونات التصنيفات */}
      <CategoryIconRail />

      {/* Products by Categories Section */}
      <section id="all" className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-gray-900 mb-3 sm:mb-4">
              تسوق حسب الفئات
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              اكتشف أفضل المنتجات من جميع الفئات
            </p>
          </div>
          {endpoints.map((endpoint) => (
            <CategorySection
              key={endpoint.key}
              endpoint={endpoint}
              apiUrl={apiUrl}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      {homeData?.categories && (
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-gray-900 mb-3 sm:mb-4">
                تسوق حسب الفئة
              </h2>
              <p className="text-lg sm:text-xl text-gray-600">
                اختر الفئة المناسبة لاحتياجاتك
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {homeData.categories.map((category) => (
                <Link
                  href={`/laptop`}
                  key={category.id}
                  aria-label={`عرض فئة ${category.name}`}
                >
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg group-hover:shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                      <Image
                        src={category.image}
                        alt={category.imageAlt}
                        width={600}
                        height={320}
                        className="w-full h-64 sm:h-72 md:h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-8 text-white">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-normal mb-1 sm:mb-2">
                          {category.name}
                        </h3>
                        <p className="text-base sm:text-lg opacity-90">
                          {category.count} منتج متاح
                        </p>
                      </div>
                      <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3 group-hover:bg-white/30 transition-colors duration-300">
                          <ChevronRight className="w-4 sm:w-6 h-4 sm:h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {homeData?.testimonials && (
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-gray-900 mb-3 sm:mb-4">
                آراء عملائنا
              </h2>
              <p className="text-lg sm:text-xl text-gray-600">
                اكتشف ما يقوله عملاؤنا عن خدماتنا
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
              {homeData.testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center mb-4 sm:mb-6">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={80}
                      height={80}
                      className="w-16 sm:w-20 h-16 sm:h-20 rounded-full ml-4 sm:ml-6"
                      loading="lazy"
                    />
                    <div>
                      <h4 className="text-lg sm:text-xl md:text-2xl font-normal text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-600 text-base sm:text-lg">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mb-4 sm:mb-6">
                    {[...Array(Math.floor(testimonial.rating || 0))].map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-400 fill-current"
                        />
                      )
                    )}
                  </div>
                  <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed italic">
                    "{testimonial.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-purple-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center text-white">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal mb-4 sm:mb-6">
              ابدأ رحلتك التقنية معنا
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 md:mb-12 opacity-90">
              اكتشف أفضل العروض واحصل على أجهزة بجودة عالمية
            </p>
            <Link href={'/laptop'}>
              <button
                className="bg-white text-purple-600 px-8 sm:px-10 md:px-12 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-normal hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                aria-label="تسوق الآن"
              >
                تسوق الآن
                <ShoppingCart className="w-5 sm:w-6 h-5 sm:h-6 inline mr-2 sm:mr-3" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;