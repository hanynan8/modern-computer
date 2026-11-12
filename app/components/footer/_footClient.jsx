'use client';

import React from 'react';
import {
  FaFacebook,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from 'react-icons/fa';

// بيانات الفوتر الثابتة (ستاتيك) - خاصة بمتجر "مودرن كومبيوتر" (Modern
// Computer). البيانات المتاحة فعليًا: اسم المتجر، العنوان، ورقم الهاتف فقط،
// والباقي (الوصف، رابط فيسبوك) محتوى نموذجي (placeholder) لحد ما توفر
// بيانات حقيقية. لو حبيت تغيّر أي بيانات، عدّل هنا مباشرة.
//
// ⚠️ ملحوظة: مسارات (href) صفحة "تواصل معنا" و"موقعنا وفروعنا" افتراضية
// (/contact و /location). لو المسارات الفعلية في مشروعك مختلفة، عدّلها هنا.
const FOOTER_DATA = {
  company: {
    name: 'مودرن كومبيوتر',
    subtitle: 'مودرن كومبيوتر – أسوان',
    description:
      'رواد التكنولوجيا في بيع وصيانة الكمبيوترات واللابتوبات، وحلول مبتكرة لأنظمة المراقبة وحماية الأعمال والمنازل.',
    year: new Date().getFullYear(),
  },
  socialLinks: [
    {
      // ⚠️ لا يوجد رابط فيسبوك متاح حاليًا - استبدل '#' برابط صفحة المتجر
      // الحقيقية على فيسبوك لما تتوفر.
      platform: 'Facebook',
      icon: 'FaFacebook',
      url: '#',
    },
  ],
  sections: [
    {
      title: 'روابط سريعة',
      links: [
        { text: 'الصفحة الرئيسية', href: '/' },
        { text: 'اللابتوبات', href: '/laptop' },
        { text: 'مكونات الكمبيوتر', href: '/component' },
        { text: 'تجميعات PC', href: '/pc-builds' },
        { text: 'الاكسسوارات', href: '/accessories' },
      ],
    },
    {
      title: 'الشركة',
      links: [
        { text: 'من نحن', href: '/aboutus' },
        { text: 'تواصل معنا', href: '/contact' },
        { text: 'موقعنا وفروعنا', href: '/location' },
      ],
    },
    {
      title: 'بيانات التواصل',
      content: {
        address: 'شارع البركة، أمام محل أولاد موسى، أسوان',
        phone: '01222812404',
      },
    },
  ],
  bottomLinks: [],
};

const iconComponents = {
  FaFacebook,
};

export default function Footer() {
  const safe = FOOTER_DATA;

  return (
    <footer className="bg-gray-900 text-white">
      {/* top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* company */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[rgb(9,78,237)] to-sky-400 bg-clip-text text-transparent mb-4">
              {safe.company.name}
            </h3>

            {safe.company.subtitle && (
              <p className="text-gray-400 text-base md:text-lg mb-6">{safe.company.subtitle}</p>
            )}

            {safe.company.description && (
              <p className="text-gray-500 text-sm md:text-base mb-6">{safe.company.description}</p>
            )}

            <div className="flex space-x-4 rtl:space-x-reverse">
              {safe.socialLinks.map((social, idx) => {
                const Icon = iconComponents[social.icon] ?? null;
                return (
                  <a
                    key={idx}
                    href={social.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 p-3 rounded-full hover:bg-[rgb(9,78,237)] transition-colors duration-300"
                    aria-label={social.platform || `social-${idx}`}
                  >
                    {Icon ? <Icon className="w-5 h-5" /> : (social.platform?.[0] ?? '')}
                  </a>
                );
              })}
            </div>
          </div>

          {/* dynamic sections */}
          {safe.sections.map((section, index) => (
            <div key={index} className="mt-6 lg:mt-0">
              <h4 className="text-base md:text-lg font-semibold mb-4 text-sky-300">{section.title}</h4>

              {Array.isArray(section.links) && section.links.length > 0 ? (
                <ul className="space-y-3">
                  {section.links.map((link, li) => (
                    <li key={li}>
                      <a
                        href={link.href || '#'}
                        className="text-gray-400 hover:text-white text-sm md:text-base transition-colors duration-300"
                      >
                        {link.text || link.name || ''}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400 text-sm md:text-base space-y-3">
                  {section.content?.address && (
                    <div className="flex items-start">
                      <FaMapMarkerAlt className="w-5 h-5 mt-1 ml-2 text-sky-400 shrink-0" />
                      <span>{section.content.address}</span>
                    </div>
                  )}
                  {section.content?.phone && (
                    <div className="flex items-center">
                      <FaPhone className="w-4 h-4 ml-2 text-sky-400" />
                      <a href={`tel:${section.content.phone}`} className="hover:text-white">
                        {section.content.phone}
                      </a>
                    </div>
                  )}
                  {section.content?.email && (
                    <div className="flex items-center">
                      <FaEnvelope className="w-4 h-4 ml-2 text-sky-400" />
                      <a href={`mailto:${section.content.email}`} className="hover:text-white">
                        {section.content.email}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {safe.company.year} {safe.company.name}. جميع الحقوق محفوظة.
            </p>

            {safe.bottomLinks.length > 0 && (
              <div className="flex space-x-6 rtl:space-x-reverse mt-4 md:mt-0">
                {safe.bottomLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href || '#'}
                    className="text-gray-500 hover:text-white text-xs md:text-sm transition-colors duration-300"
                  >
                    {link.text || link.name || ''}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}