// app/page.js - Server Component with ISR
import { Suspense } from 'react';
import HomePage from './_clientServer';
import { Loader } from 'lucide-react';
// بنقرأ من قاعدة البيانات مباشرة (getCollectionData) بدل self-fetch لـ
// /api/data. الصفحة الرئيسية دي أعلى صفحة زيارات في الموقع، وكانت بتعمل
// 5 رحلات HTTP self-fetch منفصلة على كل تحميل: واحدة لبيانات الصفحة
// الرئيسية (بجيب قاعدة البيانات كاملة من غير collection filter!) +
// 4 تانيين متوازيين لكل فئة منتجات مميزة. دلوقتي كلهم بيقروا من قاعدة
// البيانات مباشرة (ومن نفس الكاش المشترك اللي صفحات الفئات نفسها بتستخدمه).
import { getCollectionData } from '@/lib/serverData';


// Metadata for SEO
export const metadata = {
  title: 'الصفحة الرئيسية',
  description: 'اكتشف أفضل الأجهزة التقنية من لابتوبات ومكونات وإكسسوارات بأفضل الأسعار وجودة عالمية',
  keywords: [
    'تقنية', 'لابتوب', 'كمبيوتر', 'إكسسوارات', 'مكونات', 'مودرن كومبيوتر', 'أجهزة', 'شراء أجهزة', 'أفضل الأسعار', 'جودة عالية', 'تسوق حسب الفئات', 'الاكسسوارات',
    'اللابتوبات', 'الشاشات', 'المكونات', 'أجهزة الكمبيوتر', 'أجهزة التخزين', 'الطابعات', 'نقاط البيع', 'أجهزة أخرى', 'عروض خاصة', 'منتجات مميزة', 'توصيل سريع', 'خدمة عملاء ممتازة'
  ],
  openGraph: {
    url: 'https://lap-tech-five.vercel.app/',
    title: 'الصفحة الرئيسية',
    description: 'اكتشف أفضل الأجهزة التقنية بأفضل الأسعار',
    type: 'website',
  },
};


// Server function to fetch initial data
async function getHomeData() {
  try {
    const result = await getCollectionData('home');
    if (!result.success) {
      console.error(`getCollectionData(home) failed: ${result.error}`);
      return null;
    }

    // Extract home data
    const data = result.data;
    let homeData = null;
    if (Array.isArray(data) && data.length > 0) {
      homeData = data[0];
    }

    return { homeData };

  } catch (error) {
    console.error('Server fetch error:', error);
    return null;
  }
}

// كل الفئات (كلها بتتقرأ من data/*.json وقت الـ build)
const CATEGORIES = [
  'laptop', 'accessories', 'monitors', 'component', 'other',
  'pc-build', 'pos', 'printers', 'storage-devices',
];

async function getProductsByCategory() {
  const out = {};
  for (const category of CATEGORIES) {
    const result = await getCollectionData(category);
    const products =
      result.success && Array.isArray(result.data) ? result.data[0]?.products || [] : [];
    out[category] = products
      .filter(
        (p) => p.details?.isAvailable !== false && p.details?.stock !== 0
      )
      .slice(0, 4);
  }
  return out;
}

// Loading component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <Loader className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
        <p className="text-xl text-gray-600">جاري تحميل الصفحة الرئيسية...</p>
      </div>
    </div>
  );
}

// Main Server Component - ستاتيك بالكامل
export default async function Home() {
  const [homeResult, productsByCategory] = await Promise.all([
    getHomeData(),
    getProductsByCategory(),
  ]);

  const serverData = {
    homeData: homeResult?.homeData || null,
    productsByCategory,
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomePage initialData={serverData} />
    </Suspense>
  );
}
