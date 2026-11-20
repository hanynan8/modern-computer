'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  User,
  LogOut,
  LogIn,
  ShoppingCart,
  Search,
  Heart,
  Globe,
  MapPin,
} from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';

// خط "Amiri" متحمل فعلاً في app/layout.jsx وبينضاف كمتغير CSS على
// الـ <html> (className={amiri.variable})، فبنستخدم المتغير --font-amiri
// هنا مباشرة عشان اسم الشركة يظهر بيه.

// دالة عرض اسم الشركة - بخط "Cairo" ولون واحد موحد (مش متقسم لونين زي
// قبل كده). عشان خط Cairo يشتغل صح، لازم يكون متحمّل في app/layout.jsx
// زي ما Amiri متحمل حاليًا، مثلاً:
//   import { Cairo } from 'next/font/google';
//   const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });
// وتضيف cairo.variable في className بتاع <html>. لو حابب تستخدمه فورًا
// من غير next/font، سيبه كده وهياخد أقرب خط متاح على جهاز المستخدم.
const renderLogoName = (name, sizeClasses = '') => (
  <span
    style={{ fontFamily: 'var(--font-cairo, "Cairo", sans-serif)' }}
    className={sizeClasses}
  >
    {name}
  </span>
);

export default function Navbar({ navbarData: navbarProp }) {
  // البيانات جاية من data/navbar.json (عن طريق navbar.jsx)
  const navbarData = {
    company: { name: '', ...(navbarProp?.company || {}) },
    navLinks: Array.isArray(navbarProp?.navLinks) ? navbarProp.navLinks : [],
  };
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const fixedPages = ['/', '/contact', '/location', '/aboutus'];

  const dynamicPrefixes = [
    '/laptop/',
    '/accessories/',
    '/component/',
    '/monitors/',
    '/other/',
    '/pc-builds/',
    '/pos/',
    '/printers/',
    '/storage-devices/',
  ];

  const isFixedPage =
    fixedPages.includes(pathname) ||
    dynamicPrefixes.some((prefix) => pathname.startsWith(prefix));

  const productsSubMenu = [
    { text: 'لابتوب', href: '/laptop' },
    { text: 'مكونات كمبيوتر', href: '/component' },
    { text: 'تجميعات PC', href: '/pc-builds' },
    { text: 'اكسسوارات', href: '/accessories' },
    { text: 'وسائط تخزين', href: '/storage-devices' },
    { text: 'شاشات', href: '/monitors' },
    { text: 'نقاط البيع', href: '/pos' },
    { text: 'طابعات', href: '/printers' },
    { text: 'منتجات اخري', href: '/other' },
  ];

  // شريط التصنيفات السفلي (زي فكرة الشريط الذهبي في التصميم المرجعي)
  // أول عنصر "عروض تقسيطي" بيتلوّن بالذهبي زي التصميم بالظبط.
  const categoryStripLinks = [
    { text: 'عروض تقسيطي', href: '/laptop', highlight: true },
    { text: 'اللابتوبات', href: '/laptop' },
    { text: 'مكونات الكمبيوتر', href: '/component' },
    { text: 'تجميعات PC', href: '/pc-builds' },
    { text: 'الاكسسوارات', href: '/accessories' },
    { text: 'وسائط التخزين', href: '/storage-devices' },
    { text: 'الشاشات', href: '/monitors' },
    { text: 'نقاط البيع', href: '/pos' },
    { text: 'الطابعات', href: '/printers' },
    { text: 'منتجات أخرى', href: '/other' },
  ];

  // الأقسام الفرعية لكل قسم رئيسي في شريط التصنيفات - بتظهر في قائمة
  // منسدلة عريضة (mega menu) زي تصميم rayashop.com لما الماوس يمر على
  // القسم: صورة تمثيلية على الجنب + أعمدة كل عمود ليه عنوان وتحته
  // الأقسام الفرعية. كلها بتودي حاليًا لنفس صفحة القسم الرئيسي (الفلترة
  // الفعلية للأقسام الفرعية محتاجة شغل إضافي على صفحة كل قسم).
  const categorySubMenus = {
    '/laptop': {
      image:
        'https://images.unsplash.com/photo-1658312226966-29bd4e77c62c?auto=format&fit=crop&w=500&q=80',
      groups: [
        { title: 'لابتوبات جيمنج', items: ['جيمنج اقتصادي', 'جيمنج متوسط', 'جيمنج هاي إند'] },
        { title: 'لابتوبات مكتبية وأعمال', items: ['لابتوبات بيزنس', 'لابتوبات خفيفة (Ultrabook)'] },
        { title: 'لابتوبات 2 في 1', items: ['قابل للطي', 'تابلت لابتوب'] },
        { title: 'لابتوبات Apple', items: ['MacBook Air', 'MacBook Pro'] },
        { title: 'لابتوبات تصميم ومونتاج', items: ['رسوميات عالية', 'شاشة دقة عالية'] },
      ],
    },
    '/component': {
      image:
        'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=500&q=80',
      groups: [
        { title: 'المعالجات (CPU)', items: ['Intel', 'AMD'] },
        { title: 'الرامات (RAM)', items: ['DDR4', 'DDR5'] },
        { title: 'اللوحات الأم', items: ['لأجهزة Intel', 'لأجهزة AMD'] },
        { title: 'كروت الشاشة (GPU)', items: ['NVIDIA', 'AMD Radeon'] },
        { title: 'مزودات الطاقة (PSU)', items: ['500-750 وات', '750 وات فأعلى'] },
        { title: 'التبريد والمراوح', items: ['تبريد هوائي', 'تبريد مائي (Liquid)'] },
      ],
    },
    '/pc-builds': {
      image:
        'https://images.unsplash.com/photo-1660855551740-4474188debdb?auto=format&fit=crop&w=500&q=80',
      groups: [
        { title: 'تجميعات جيمنج', items: ['اقتصادية', 'متوسطة', 'هاي إند'] },
        { title: 'تجميعات مكتبية', items: ['أعمال', 'تعليمية'] },
        { title: 'تجميعات مونتاج وتصميم', items: ['مونتاج فيديو', 'تصميم جرافيك'] },
        { title: 'تجميعات مخصصة', items: ['تجميع حسب الطلب'] },
      ],
    },
    '/accessories': {
      image:
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=500&q=80',
      groups: [
        { title: 'ماوس', items: ['سلكي', 'لاسلكي', 'جيمنج'] },
        { title: 'لوحات مفاتيح', items: ['ميكانيكية', 'عادية', 'لاسلكية'] },
        { title: 'سماعات', items: ['سلكية', 'لاسلكية', 'جيمنج'] },
        { title: 'كاميرات ويب', items: ['HD', 'Full HD'] },
        { title: 'حقائب وحافظات لابتوب', items: ['حقائب ظهر', 'حافظات'] },
      ],
    },
    '/storage-devices': {
      image:
        'https://images.unsplash.com/photo-1620368523635-df9d83338fc1?auto=format&fit=crop&w=500&q=80',
      groups: [
        { title: 'هارد HDD', items: ['داخلي', 'خارجي'] },
        { title: 'أقراص SSD', items: ['SATA', 'NVMe'] },
        { title: 'فلاشات USB', items: ['USB 3.0', 'Type-C'] },
        { title: 'كروت ذاكرة', items: ['microSD', 'SD'] },
      ],
    },
    '/monitors': {
      image:
        'https://images.unsplash.com/photo-1616440537338-1d04df3987f7?auto=format&fit=crop&w=500&q=80',
      groups: [
        { title: 'شاشات جيمنج', items: ['144Hz', '240Hz'] },
        { title: 'شاشات مكتبية', items: ['Full HD', '2K'] },
        { title: 'شاشات مقوسة (Curved)', items: ['ألترا وايد'] },
        { title: 'شاشات 4K', items: ['للمصممين', 'للمونتاج'] },
      ],
    },
    '/pos': {
      image:
        'https://images.unsplash.com/photo-1647427017067-8f33ccbae493?auto=format&fit=crop&w=500&q=80',
      groups: [
        { title: 'أجهزة نقاط بيع', items: ['شاشة لمس', 'كاشير'] },
        { title: 'طابعات فواتير', items: ['حرارية', 'إبرية'] },
        { title: 'ماسحات باركود', items: ['سلكية', 'لاسلكية'] },
        { title: 'أدراج نقود', items: ['كهربائية', 'يدوية'] },
      ],
    },
    '/printers': {
      image:
        'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=500&q=80',
      groups: [
        { title: 'طابعات ليزر', items: ['أبيض وأسود', 'ألوان'] },
        { title: 'طابعات نافثة للحبر', items: ['منزلية', 'مكتبية'] },
        { title: 'طابعات صور', items: ['فوتوغرافية'] },
        { title: 'طابعات الكل في واحد', items: ['طباعة + سكانر + فاكس'] },
        { title: 'طابعات ليبل وباركود', items: ['حرارية', 'ملصقات'] },
      ],
    },
    '/other': {
      image:
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80',
      groups: [
        { title: 'إضاءة واستديو', items: ['إضاءة استوديو', 'رينج لايت'] },
        { title: 'كراسي جيمنج ومكتب', items: ['كراسي جيمنج', 'كراسي مكتب'] },
        { title: 'طاولات مكتب', items: ['طاولات جيمنج', 'طاولات مكتبية'] },
        { title: 'شواحن وباور بانك', items: ['شواحن سريعة', 'باور بانك'] },
        { title: 'كابلات ومحولات', items: ['USB-C', 'HDMI'] },
      ],
    },
  };

  // إدارة فتح/قفل القائمة المنسدلة العريضة مع تأخير بسيط عند مغادرة
  // الماوس عشان ميقفلش وهو بيتحرك من الرابط للقائمة نفسها
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const closeMenuTimeoutRef = useRef(null);

  const openCategoryMenu = (href) => {
    if (closeMenuTimeoutRef.current) {
      clearTimeout(closeMenuTimeoutRef.current);
      closeMenuTimeoutRef.current = null;
    }
    setHoveredCategory(href);
  };

  const scheduleCloseCategoryMenu = () => {
    closeMenuTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (closeMenuTimeoutRef.current) clearTimeout(closeMenuTimeoutRef.current);
    };
  }, []);

  // إغلاق الدروب داون عند النقر خارجه
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.products-dropdown'))
        setProductsDropdownOpen(false);
      if (!e.target.closest('.user-dropdown')) setUserDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // إغلاق السايدبار عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target === overlayRef.current) {
        setMobileOpen(false);
        setMobileProductsOpen(false);
      }
    };
    if (mobileOpen) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  // ESC لإغلاق القائمة
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
        setMobileProductsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileOpen]);

  // جلب عدد المنتجات
  const fetchCartCount = async () => {
    try {
      if (session) {
        const res = await fetch('/api/cart-count');
        if (res.ok) {
          const { count } = await res.json();
          setCartCount(count || 0);
        }
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        const count = localCart.reduce(
          (sum, item) => sum + (item.quantity || 1),
          0
        );
        setCartCount(count);
      }
    } catch (err) {
      console.error('Error fetching cart count:', err);
    }
  };

  // جلب عدد المفضلة (نفس مفتاح الـ localStorage اللي بيستخدمه كارت المنتج
  // في الصفحة الرئيسية: 'wishlist')
  const fetchWishlistCount = () => {
    try {
      const list = JSON.parse(localStorage.getItem('wishlist')) || [];
      setWishlistCount(Array.isArray(list) ? list.length : 0);
    } catch {
      setWishlistCount(0);
    }
  };

  // تحديث حي: استماع للأحداث + polling
  useEffect(() => {
    fetchCartCount();
    fetchWishlistCount();

    const handleStorageChange = (e) => {
      if (e.key === 'cart' && !session) {
        fetchCartCount();
      }
      if (e.key === 'wishlist') {
        fetchWishlistCount();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const handleCartUpdate = () => {
      fetchCartCount();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('wishlistUpdated', fetchWishlistCount);

    const handleProductAdded = (event) => {
      const { quantity = 1 } = event.detail || {};
      setCartCount((prev) => prev + quantity);
    };

    const handleProductRemoved = (event) => {
      const { quantity = 1 } = event.detail || {};
      setCartCount((prev) => Math.max(0, prev - quantity));
    };

    const handleProductUpdated = (event) => {
      const { oldQuantity = 0, newQuantity = 0 } = event.detail || {};
      const difference = newQuantity - oldQuantity;
      setCartCount((prev) => Math.max(0, prev + difference));
    };

    window.addEventListener('productAddedToCart', handleProductAdded);
    window.addEventListener('productRemovedFromCart', handleProductRemoved);
    window.addEventListener('productQuantityUpdated', handleProductUpdated);

    let interval;
    if (session) {
      interval = setInterval(fetchCartCount, 5000);
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('wishlistUpdated', fetchWishlistCount);
      window.removeEventListener('productAddedToCart', handleProductAdded);
      window.removeEventListener(
        'productRemovedFromCart',
        handleProductRemoved
      );
      window.removeEventListener(
        'productQuantityUpdated',
        handleProductUpdated
      );
      if (interval) clearInterval(interval);
    };
  }, [session]);

  const companyName = navbarData.company.name;

  const closeSidebar = () => {
    setMobileOpen(false);
    setMobileProductsOpen(false);
  };

  const handleSignOut = () => {
    signOut();
    setUserDropdownOpen(false);
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.length === 1
      ? parts[0].charAt(0).toUpperCase()
      : (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const getFullUserName = () =>
    session?.user?.name || session?.user?.email || 'المستخدم';

  // البحث - بيوجه لصفحة اللابتوبات (الفئة الرئيسية) مع كويري بحث، وهي
  // بتقرأ الكويري ده وتفلتر المنتجات تلقائي (شوف الاستخدام في صفحة اللابتوب)
  const submitSearch = (term) => {
    const q = term.trim();
    if (!q) return;
    router.push(`/laptop?q=${encodeURIComponent(q)}`);
    setMobileSearchOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    submitSearch(searchQuery);
  };

  // Count Badge Component (السلة والمفضلة)
  const CountBadge = ({ count, mobile = false }) => {
    if (count <= 0) return null;

    return (
      <span
        className={`absolute ${
          mobile
            ? '-top-1 -left-1 w-4 h-4 text-[10px]'
            : '-top-1.5 -left-1.5 min-w-[18px] h-[18px] text-[10px]'
        } bg-brand-gold text-brand-blue-dark font-normal
        rounded-full flex items-center justify-center
        shadow border-2 border-white
        ${count > 99 ? 'px-1' : ''}`}
      >
        {count > 99 ? '99+' : count}
      </span>
    );
  };

  return (
    <div dir="rtl" className="font-arabic">
      {isFixedPage && (
        <div className="h-44 sm:h-[200px] md:h-[208px]"></div>
      )}

      <header
        className={`z-40 shadow-md ${
          isFixedPage ? 'fixed top-0 left-0 right-0' : 'sticky top-0'
        }`}
      >
        {/* الصف العلوي: اللوجو + شريط البحث + الأيقونات */}
        <div className="bg-[rgb(9,78,237)]">
          <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8">
            <div className="flex items-center justify-between gap-2 sm:gap-4 h-28 sm:h-[120px]">
              {/* Logo */}
              <Link href="/" className="flex items-center shrink-0">
                <h1 className="flex items-baseline">
                  {renderLogoName(
                    companyName,
                    'text-xl sm:text-2xl lg:text-3xl font-normal text-white'
                  )}
                </h1>
              </Link>

              {/* Search - desktop/tablet */}
              <form
                onSubmit={handleSearchSubmit}
                className="hidden sm:flex flex-1 max-w-2xl"
              >
                <div className="relative w-full flex items-center bg-white rounded-full shadow-inner overflow-hidden ring-1 ring-black/5">
                  <button
                    type="submit"
                    aria-label="بحث"
                    className="bg-brand-gold hover:brightness-95 transition-all w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center m-1 shrink-0"
                  >
                    <Search size={18} className="text-brand-blue-dark" />
                  </button>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن لابتوب، مكونات، اكسسوارات..."
                    className="flex-1 min-w-0 px-3 sm:px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none text-right bg-transparent"
                  />
                </div>
              </form>

              {/* Actions - Desktop */}
              <div className="hidden md:flex items-center gap-1 shrink-0">
                {/* اللغة (شكلي زي التصميم المرجعي) */}
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-white/90 hover:bg-white/10 transition-colors text-sm"
                  aria-label="اللغة"
                >
                  <Globe size={18} />
                  <span className="hidden lg:inline">العربية</span>
                  <ChevronDown size={14} />
                </button>

                {/* الفروع */}
                <Link
                  href="/location"
                  className="hidden lg:flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-white/90 hover:bg-white/10 transition-colors text-sm"
                >
                  <MapPin size={18} />
                  <span>فروعنا</span>
                </Link>

                {/* المستخدم */}
                {status === 'loading' ? (
                  <div className="p-2 rounded-lg bg-white/10 animate-pulse w-6 h-6" />
                ) : session ? (
                  <div className="user-dropdown relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                    >
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt="user"
                          className="w-7 h-7 rounded-full object-cover border-2 border-white/40"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-brand-gold text-brand-blue-dark text-xs font-normal flex items-center justify-center">
                          {getUserInitials(session.user?.name)}
                        </div>
                      )}
                      <span className="text-sm font-medium whitespace-nowrap max-w-[100px] truncate">
                        {getFullUserName()}
                      </span>
                      <ChevronDown
                        size={14}
                        className={`transform transition-transform duration-200 ${
                          userDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {userDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-200/70 py-3 z-20">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {getFullUserName()}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {session.user?.email}
                          </p>
                        </div>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-brand-blue-light hover:text-brand-blue mx-2 rounded-lg"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <User size={16} />
                          الملف الشخصي
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 mx-2 rounded-lg text-right"
                        >
                          <LogOut size={16} />
                          تسجيل الخروج
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={'/login'}
                    className="flex items-center gap-2 p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                  >
                    <User size={20} />
                    <span className="text-sm font-medium hidden lg:inline">
                      تسجيل الدخول
                    </span>
                  </Link>
                )}

                {/* المفضلة */}
                <Link
                  href="/wishlist"
                  className="relative p-2.5 rounded-lg text-white hover:bg-white/10 transition-colors group"
                >
                  <Heart
                    size={20}
                    className="group-hover:scale-110 transition-transform duration-200"
                  />
                  <CountBadge count={wishlistCount} />
                </Link>

                {/* السلة */}
                <Link
                  href="/cart"
                  className="relative p-2.5 rounded-lg text-white hover:bg-white/10 transition-colors group"
                >
                  <ShoppingCart
                    size={20}
                    className="group-hover:scale-110 transition-transform duration-200"
                  />
                  <CountBadge count={cartCount} />
                </Link>
              </div>

              {/* Actions - Mobile */}
              <div className="flex items-center md:hidden gap-1">
                <button
                  onClick={() => setMobileSearchOpen((v) => !v)}
                  aria-label="بحث"
                  className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  <Search size={20} />
                </button>

                <Link
                  href="/wishlist"
                  className="relative p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  <Heart size={19} />
                  <CountBadge count={wishlistCount} mobile />
                </Link>

                {status !== 'loading' &&
                  (session ? (
                    <Link href="/profile">
                      <button className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors">
                        {session.user?.image ? (
                          <img
                            src={session.user.image}
                            alt="user"
                            className="w-6 h-6 rounded-full object-cover border border-white/40"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-brand-gold text-brand-blue-dark text-xs font-normal flex items-center justify-center">
                            {getUserInitials(session.user?.name)}
                          </div>
                        )}
                      </button>
                    </Link>
                  ) : (
                    <Link href={'/login'}>
                      <button className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors">
                        <LogIn size={19} />
                      </button>
                    </Link>
                  ))}

                <Link
                  href="/cart"
                  className="relative p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  <ShoppingCart size={20} />
                  <CountBadge count={cartCount} mobile />
                </Link>

                <button
                  onClick={() => setMobileOpen(true)}
                  aria-label="فتح القائمة"
                  className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  <Menu size={22} />
                </button>
              </div>
            </div>

            {/* Search - mobile (toggle) */}
            {mobileSearchOpen && (
              <form
                onSubmit={handleSearchSubmit}
                className="sm:hidden pb-3 -mt-1"
              >
                <div className="relative w-full flex items-center bg-white rounded-full shadow-inner overflow-hidden">
                  <button
                    type="submit"
                    aria-label="بحث"
                    className="bg-brand-gold w-9 h-9 rounded-full flex items-center justify-center m-1 shrink-0"
                  >
                    <Search size={16} className="text-brand-blue-dark" />
                  </button>
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن منتج..."
                    className="flex-1 min-w-0 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none text-right bg-transparent"
                  />
                </div>
              </form>
            )}
          </div>
        </div>

        {/* الصف الثاني: شريط التصنيفات (زي فكرة الشريط الذهبي في التصميم
            المرجعي) - سكرول أفقي على الموبايل + مينيو منسدلة عريضة عند
            الهوفر زي تصميم rayashop.com */}
        <nav
          className="bg-[rgb(9,78,237)] border-t border-white/10 relative"
          onMouseLeave={scheduleCloseCategoryMenu}
        >
          <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8">
            <ul className="flex items-center gap-1 sm:gap-2 overflow-x-auto sm:overflow-visible no-scrollbar h-11 sm:h-12">
              {categoryStripLinks.map((link, i) => {
                const subMenu = categorySubMenus[link.href];
                const isOpen = subMenu && hoveredCategory === link.href;
                return (
                  <li key={i} className="shrink-0">
                    <Link
                      href={link.href}
                      onMouseEnter={() => subMenu && openCategoryMenu(link.href)}
                      className={`flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-normal whitespace-nowrap transition-colors ${
                        link.highlight
                          ? 'text-brand-gold hover:text-white'
                          : isOpen
                          ? 'text-brand-gold'
                          : 'text-white/85 hover:text-brand-gold'
                      }`}
                    >
                      {link.text}
                      {subMenu && (
                        <ChevronDown
                          size={13}
                          className={`hidden sm:block opacity-70 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* المينيو المنسدلة العريضة - عنصر واحد مشترك بيتغير محتواه حسب
              القسم اللي الماوس عليه، وبتاخد عرض الهيدر بالكامل زي تصميم
              rayashop.com (صورة على الجنب + أعمدة أقسام فرعية) */}
          {hoveredCategory && categorySubMenus[hoveredCategory] && (
            <div
              className="hidden sm:block absolute top-full inset-x-0 z-30"
              onMouseEnter={() => openCategoryMenu(hoveredCategory)}
              onMouseLeave={scheduleCloseCategoryMenu}
            >
              <div
                dir="rtl"
                className="w-full bg-white shadow-2xl border-t-0 border-b border-gray-200/70 overflow-hidden flex min-h-[420px]"
              >
                  {/* أعمدة الأقسام الفرعية */}
                  <div className="flex-1 p-8 md:pr-10 lg:pr-16 xl:pr-24">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-10 gap-y-8">
                      {categorySubMenus[hoveredCategory].groups.map(
                        (group, gIdx) => (
                          <div key={gIdx}>
                            <h4 className="text-gray-900 font-bold text-[15px] mb-4">
                              {group.title}
                            </h4>
                            <ul className="space-y-3">
                              {group.items.map((sub, idx) => (
                                <li key={idx}>
                                  <Link
                                    href={hoveredCategory}
                                    onClick={() => setHoveredCategory(null)}
                                    className="text-sm text-gray-600 hover:text-brand-blue transition-colors"
                                  >
                                    {sub}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      )}
                    </div>

                    <Link
                      href={hoveredCategory}
                      onClick={() => setHoveredCategory(null)}
                      className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark transition-colors"
                    >
                      <ChevronLeft size={16} />
                      تسوق جميع{' '}
                      {
                        categoryStripLinks.find(
                          (l) => l.href === hoveredCategory
                        )?.text
                      }
                    </Link>
                  </div>

                  {/* صورة تمثيلية للقسم - جوه بادنج زي تصميم rayashop.com
                      (مش لازقة في حرف الشاشة) */}
                  <div className="hidden md:flex items-stretch p-8 shrink-0">
                    <div className="relative w-56 lg:w-64 rounded-2xl overflow-hidden">
                      <Image
                        src={categorySubMenus[hoveredCategory].image}
                        alt={
                          categoryStripLinks.find(
                            (l) => l.href === hoveredCategory
                          )?.text || ''
                        }
                        fill
                        sizes="256px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-dark/85 via-brand-blue-dark/15 to-transparent" />
                      <span className="absolute bottom-5 right-5 left-5 text-white font-semibold text-lg leading-snug">
                        {
                          categoryStripLinks.find(
                            (l) => l.href === hoveredCategory
                          )?.text
                        }
                      </span>
                    </div>
                  </div>
                </div>
            </div>
          )}
        </nav>
      </header>


      {/* Overlay + Sidebar */}
      {mobileOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
        >
          <div
            ref={sidebarRef}
            className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ${
              mobileOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[rgb(9,78,237)]">
              <h2 className="flex items-baseline">
                {renderLogoName(
                  companyName,
                  'text-xl font-normal text-white'
                )}
              </h2>
              <button
                onClick={closeSidebar}
                aria-label="إغلاق"
                className="p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white"
              >
                <X size={22} />
              </button>
            </div>

            {/* User Info */}
            {session && (
              <div className="p-4 border-b border-gray-100 bg-brand-blue-light">
                <div className="flex items-center gap-3">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt="user"
                      className="w-10 h-10 rounded-full object-cover border-2 border-brand-blue/30"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-blue text-white text-sm font-normal flex items-center justify-center">
                      {getUserInitials(session.user?.name)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {getFullUserName()}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Sidebar Nav */}
            <div className="flex-1 overflow-y-auto h-full pb-20">
              <nav className="p-4">
                <ul className="space-y-2">
                  {navbarData.navLinks.map((link, i) => (
                    <li key={i}>
                      {['المنتجات', 'منتجات'].includes(link.text) ? (
                        <div>
                          <button
                            onClick={() =>
                              setMobileProductsOpen(!mobileProductsOpen)
                            }
                            className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-brand-blue-light hover:text-brand-blue rounded-lg"
                          >
                            <span className="font-medium">{link.text}</span>
                            <ChevronLeft
                              size={18}
                              className={`transform transition-transform duration-200 ${
                                mobileProductsOpen ? 'rotate-90' : ''
                              }`}
                            />
                          </button>
                          {mobileProductsOpen && (
                            <div className="mt-2 mr-4 space-y-1">
                              {productsSubMenu.map((sub, idx) => (
                                <Link
                                  key={idx}
                                  href={sub.href}
                                  className="block p-3 text-gray-600 hover:bg-gray-50 hover:text-brand-blue rounded-lg border-r-2 border-transparent hover:border-brand-blue text-right"
                                  onClick={closeSidebar}
                                >
                                  {sub.text}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={link.href}
                          className="block p-3 text-right text-gray-700 hover:bg-brand-blue-light hover:text-brand-blue rounded-lg font-medium"
                          onClick={closeSidebar}
                        >
                          {link.text}
                        </Link>
                      )}
                    </li>
                  ))}

                  {/* Session related actions first (profile / login) */}
                  {session ? (
                    <>
                      <li className="pt-2 border-t border-gray-200 mt-4">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 p-3 text-right text-gray-700 hover:bg-brand-blue-light hover:text-brand-blue rounded-lg font-medium"
                          onClick={closeSidebar}
                        >
                          <User size={18} />
                          الملف الشخصي
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            handleSignOut();
                            closeSidebar();
                          }}
                          className="flex items-center gap-3 w-full p-3 text-right text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium"
                        >
                          <LogOut size={18} />
                          تسجيل الخروج
                        </button>
                      </li>
                    </>
                  ) : (
                    <Link href={'/login'}>
                      <li className="pt-2 border-t border-gray-200 mt-4">
                        <button
                          onClick={() => {
                            closeSidebar();
                          }}
                          className="flex items-center gap-3 w-full p-3 text-right bg-brand-blue text-white rounded-lg hover:brightness-110 transition-all duration-300 font-medium"
                        >
                          <LogIn size={18} />
                          تسجيل الدخول
                        </button>
                      </li>
                    </Link>
                  )}

                  {/* Wishlist */}
                  <li>
                    <Link
                      href="/wishlist"
                      className="flex items-center gap-3 p-3 text-right text-gray-700 hover:bg-brand-blue-light hover:text-brand-blue rounded-lg font-medium group"
                      onClick={closeSidebar}
                    >
                      <div className="relative">
                        <Heart
                          size={18}
                          className="group-hover:scale-110 transition-transform duration-200"
                        />
                        <CountBadge count={wishlistCount} mobile />
                      </div>
                      المفضلة
                      {wishlistCount > 0 && (
                        <span className="mr-auto bg-brand-blue-light text-brand-blue text-xs font-normal px-2 py-1 rounded-full">
                          {wishlistCount > 99 ? '99+' : wishlistCount}
                        </span>
                      )}
                    </Link>
                  </li>

                  {/* Cart placed after auth actions (swapped) */}
                  <li>
                    <Link
                      href="/cart"
                      className="flex items-center gap-3 p-3 text-right text-gray-700 hover:bg-brand-blue-light hover:text-brand-blue rounded-lg font-medium group"
                      onClick={closeSidebar}
                    >
                      <div className="relative">
                        <ShoppingCart
                          size={18}
                          className="group-hover:scale-110 transition-transform duration-200"
                        />
                        <CountBadge count={cartCount} mobile />
                      </div>
                      السلة
                      {cartCount > 0 && (
                        <span className="mr-auto bg-brand-blue-light text-brand-blue text-xs font-normal px-2 py-1 rounded-full">
                          {cartCount > 99 ? '99+' : cartCount}
                        </span>
                      )}
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 text-center text-sm text-gray-500">
              مرحباً بك في {companyName}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}