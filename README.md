# Modern Computer — نسخة ستاتيك

موقع Next.js ستاتيك بالكامل: كل بيانات الصفحات بتتقرأ من `data/*.json` وقت الـ build، ومفيش قاعدة بيانات ولا API ولا سيرفر.

## التشغيل
```bash
npm install
npm run dev      # تطوير
npm run build    # بيطلّع فولدر out/ (HTML ثابت) جاهز للرفع على أي استضافة
npm start        # معاينة out/ محليًا
```

## تعديل المحتوى
عدّل ملفات `data/*.json` وبعدها `npm run build`.

## السلة والمفضلة
محفوظين في `localStorage` على جهاز الزائر. زرار "اطلب عبر واتساب" في السلة بيبعت الطلب كرسالة جاهزة (الرقم في `app/(viewrs)/cart/page.jsx`).

## اتشال من النسخة الأصلية
MongoDB، NextAuth (الدخول/التسجيل/البروفايل)، PayPal والدفع، كل الـ `/api` routes، والـ middleware.
