// app/laptop/page.js (Server Component)
import React, { Suspense } from 'react';
import { Loader } from 'lucide-react';
import ProductsClient from './_lapClient';
import BrettyButton from './brettybtn';
import { getCollectionData } from '@/lib/serverData';

export const metadata = {
  title: 'اللابتوبات',
  description: 'اكتشف مجموعة واسعة من اللابتوبات: للألعاب، للعمل، والإنتاجية — مواصفات، مقارنة أسعار، ونصائح اختيار اللابتوب المناسب حسب الاستخدام والميزانية.',
  keywords: [
    'لابتوب', 'اللابتوبات', 'أجهزة محمولة', 'Gaming Laptop', 'محمول للعمل', 'Intel', 'AMD', 'M2', 'RAM', 'SSD', 'شاشة 144Hz', 'بطاقة رسومية'
  ],
  openGraph: {
    url: 'https://lap-tech-five.vercel.app/laptop',
    title: 'اللابتوبات',
    description: 'تصفح أفضل عروض اللابتوبات: مواصفات تفصيلية ومراجعات لمساعدتك في اختيار الجهاز الأمثل.',
    type: 'website'
  }
};



// Server Component - يتم تشغيله على الخادم
async function fetchProductsData() {
  try {
    // بنقرأ من قاعدة البيانات مباشرة بدل ما الـ Server Component يعمل
    // HTTP fetch لنفس السيرفر بتاعه (كان بيسبب رحلة شبكة إضافية كاملة
    // على كل تنقل بين الصفحات، وده كان السبب الرئيسي في البطء).
    const result = await getCollectionData('laptop');

    if (!result.success) {
      throw new Error(result.error || 'فشل في جلب البيانات');
    }

    const apiData = result.data;

    // الاستجابة دلوقتي مصفوفة مباشرة (لأن الطلب بقى بـ collection=laptop)
    if (Array.isArray(apiData) && apiData.length > 0) {
      return {
        success: true,
        data: apiData[0]
      };
    } else {
      throw new Error('هيكل البيانات غير متوقع');
    }
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

const ProductsServerPage = async () => {
  // جلب البيانات على الخادم
  const result = await fetchProductsData();

  if (!result.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">خطأ في تحميل البيانات: {result.error}</p>
          <BrettyButton />
        </div>
      </div>
    );
  }

  // تمرير البيانات للـ Client Component
  // ملحوظة: ProductsClient بيستخدم useSearchParams() (عشان قيمة البحث
  // الجاية من خانة البحث في النافبار عبر ?q=...) وده بيتطلب لف الكومبوننت
  // بـ Suspense في الـ App Router، وإلا الـ build بيرفض.
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center" dir="rtl">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-brand-blue mx-auto mb-4" />
            <p className="text-xl text-gray-600">جاري تحميل اللابتوبات...</p>
          </div>
        </div>
      }
    >
      <ProductsClient initialData={result.data} />
    </Suspense>
  );
};

export default ProductsServerPage;