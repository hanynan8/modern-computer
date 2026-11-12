"use client"

// app/contact/ContactClient.jsx (Client Component - Static)

import { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Facebook,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

import Link from 'next/link';

function goToWatssap() {
  window.open('https://wa.me/201222812404');
}

// ====== بيانات ستاتيك: مودرن كومبيوتر ======
// البيانات المتاحة فعليًا: اسم المتجر، العنوان، ورقم الهاتف فقط.
// ⚠️ ملحوظة: مواعيد العمل والأسئلة الشائعة نموذجية - راجعها واستبدلها ببياناتك الفعلية
const contactData = {
  pageTitle: 'تواصل معنا',
  pageSubtitle: 'مودرن كومبيوتر في خدمتك دايمًا',

  contactInfo: [
    {
      icon: 'Phone',
      color: 'from-purple-500 to-blue-500',
      title: 'اتصل بنا',
      details: ['01222812404'],
    },
    {
      icon: 'MapPin',
      color: 'from-blue-500 to-cyan-500',
      title: 'موقعنا',
      details: ['شارع البركة، أمام محل أولاد موسى', 'أسوان'],
    },
    {
      icon: 'Clock',
      color: 'from-green-500 to-emerald-500',
      title: 'مواعيد العمل',
      details: ['السبت - الخميس: 10ص - 11م', 'الجمعة: 2م - 11م'],
    },
    {
      icon: 'Facebook',
      color: 'from-orange-500 to-red-500',
      title: 'تابعنا',
      details: ['مودرن كومبيوتر', 'على فيسبوك'],
    },
  ],

  formLabels: {
    formTitle: 'ابعتلنا رسالة',
    formSubtitle: 'هنرد عليك في أسرع وقت ممكن',
    successMessage: 'تم إرسال رسالتك بنجاح! هنتواصل معاك قريبًا',
    fields: {
      name: { label: 'الاسم بالكامل', placeholder: 'اكتب اسمك هنا' },
      email: { label: 'البريد الإلكتروني', placeholder: 'example@email.com' },
      phone: { label: 'رقم الهاتف', placeholder: '01xxxxxxxxx' },
      type: {
        label: 'نوع الاستفسار',
        options: [
          { value: 'general', label: 'استفسار عام' },
          { value: 'maintenance', label: 'صيانة أجهزة' },
          { value: 'purchase', label: 'استفسار عن منتج' },
          { value: 'surveillance', label: 'أنظمة مراقبة' },
        ],
      },
      subject: { label: 'الموضوع', placeholder: 'موضوع رسالتك' },
      message: {
        label: 'الرسالة',
        placeholder: 'اكتب رسالتك هنا بالتفصيل...',
      },
    },
    submitButton: { default: 'إرسال الرسالة', loading: 'جاري الإرسال...' },
  },

  contactMethods: [
    {
      icon: 'MessageCircle',
      color: 'from-green-500 to-emerald-500',
      title: 'واتساب',
      description: 'تواصل معنا مباشرة عبر واتساب لأي استفسار',
      buttonText: 'ابدأ المحادثة',
    },
    {
      icon: 'Phone',
      color: 'from-purple-500 to-blue-500',
      title: 'اتصال هاتفي',
      description: 'اتصل بينا مباشرة على رقم المتجر',
      buttonText: 'اتصل الآن',
    },
    {
      icon: 'Facebook',
      color: 'from-blue-500 to-cyan-500',
      title: 'فيسبوك',
      description: 'تابع أحدث العروض والمنتجات على صفحتنا',
      buttonText: 'زيارة الصفحة',
    },
  ],

  faqSection: {
    title: 'أسئلة شائعة',
    subtitle: 'إجابات على أكتر الأسئلة اللي بتوصلنا',
    items: [
      {
        question: 'هل بتقدموا خدمة الصيانة لكل أنواع اللابتوبات؟',
        answer:
          'أيوه، فريقنا الفني بيصلح كل أنواع وموديلات اللابتوبات والكمبيوترات المكتبية.',
      },
      {
        question: 'هل عندكم أنظمة مراقبة للمنازل والمحلات؟',
        answer:
          'أيوه، بنوفر حلول كاميرات مراقبة متكاملة لحماية المنازل والأعمال في أسوان.',
      },
      {
        question: 'هل التوصيل متاح داخل أسوان؟',
        answer:
          'أيوه، بنوفر خدمة توصيل للمنتجات داخل أسوان، تقدر تتواصل معانا لمعرفة التفاصيل.',
      },
      {
        question: 'إزاي أقدر أتواصل معاكم لو عندي مشكلة في جهاز اشتريته؟',
        answer:
          'تقدر تتصل بينا أو تراسلنا على واتساب أو فيسبوك وهنساعدك فورًا.',
      },
    ],
  },

  socialSection: {
    title: 'زور متجرنا',
    subtitle: 'اكتشف أحدث المنتجات التقنية في مودرن كومبيوتر',
    storeButton: 'تصفح المنتجات',
  },
};

const ContactClient = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'general',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Icon mapping for dynamic icons
  const iconMap = {
    Phone,
    Mail,
    MapPin,
    Clock,
    MessageCircle,
    Facebook,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    // محاكاة إرسال النموذج
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        type: 'general',
      });

      setTimeout(() => setShowSuccess(false), 5000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Hero Section */}
      <section className="relative h-64 sm:h-96 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in-up">
              {contactData.pageTitle}
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl opacity-90 animate-fade-in-up animation-delay-200">
              {contactData.pageSubtitle}
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-10 sm:w-20 h-10 sm:h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-16 sm:w-32 h-16 sm:h-32 bg-white/5 rounded-full animate-pulse animation-delay-1000"></div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-10 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {contactData.contactInfo.map((info, index) => {
              const IconComponent = iconMap[info.icon];
              return (
                <div key={index} className="group">
                  <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg group-hover:shadow-2xl transform group-hover:-translate-y-2 transition-all duration-300 border border-gray-100">
                    <div
                      className={`bg-gradient-to-br ${info.color} w-12 sm:w-16 h-12 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {IconComponent && (
                        <IconComponent className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                      {info.title}
                    </h3>
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-gray-600 mb-2">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Additional Info */}
      <section className="py-10 sm:py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-lg">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  {contactData.formLabels.formTitle}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600">
                  {contactData.formLabels.formSubtitle}
                </p>
              </div>

              {showSuccess && (
                <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 rounded-2xl p-3 sm:p-4 flex items-center">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 ml-3" />
                  <span className="text-green-800">
                    {contactData.formLabels.successMessage}
                  </span>
                </div>
              )}

              <div className="space-y-4 sm:space-y-6">
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      {contactData.formLabels.fields.name.label}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                      placeholder={contactData.formLabels.fields.name.placeholder}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      {contactData.formLabels.fields.email.label}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                      placeholder={contactData.formLabels.fields.email.placeholder}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      {contactData.formLabels.fields.phone.label}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                      placeholder={contactData.formLabels.fields.phone.placeholder}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      {contactData.formLabels.fields.type.label}
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                    >
                      {contactData.formLabels.fields.type.options.map(
                        (option, index) => (
                          <option key={index} value={option.value}>
                            {option.label}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    {contactData.formLabels.fields.subject.label}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                    placeholder={contactData.formLabels.fields.subject.placeholder}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    {contactData.formLabels.fields.message.label}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 resize-none"
                    placeholder={contactData.formLabels.fields.message.placeholder}
                  ></textarea>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 sm:py-4 rounded-xl text-base sm:text-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                      {contactData.formLabels.submitButton.loading}
                    </div>
                  ) : (
                    <>
                      {contactData.formLabels.submitButton.default}
                      <Send className="w-4 sm:w-5 h-4 sm:h-5 inline mr-2" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Contact Methods */}
            <div className="space-y-4 sm:space-y-8">
              <div className="space-y-2 sm:space-y-4">
                {contactData.contactMethods.map((method, index) => {
                  const IconComponent = iconMap[method.icon];
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <div className="flex items-start">
                        <div
                          className={`bg-gradient-to-br ${method.color} w-10 sm:w-12 h-10 sm:h-12 rounded-xl flex items-center justify-center ml-3 sm:ml-4 flex-shrink-0`}
                        >
                          {IconComponent && (
                            <IconComponent className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                            {method.title}
                          </h4>
                          <p className="text-gray-600 mb-3">
                            {method.description}
                          </p>
                          <button
                            onClick={() => goToWatssap()}
                            className="text-purple-600 font-bold hover:text-purple-800 transition-colors duration-300"
                          >
                            {method.buttonText}
                            <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 inline mr-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
              {contactData.faqSection.title}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              {contactData.faqSection.subtitle}
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {contactData.faqSection.items.map((faq, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                  {faq.question}
                </h4>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media & Footer CTA */}
      <section className="py-10 sm:py-20 bg-gradient-to-r from-purple-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-8 sm:mb-12 text-white">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6">
              {contactData.socialSection.title}
            </h2>
            <p className="text-lg sm:text-2xl opacity-90 mb-6 sm:mb-8">
              {contactData.socialSection.subtitle}
            </p>
          </div>

          <div className="text-center">
            <Link href={'/laptop'}>
              <button className="bg-white text-purple-600 px-8 sm:px-12 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                {contactData.socialSection.storeButton}
                <ArrowRight className="w-5 sm:w-6 h-5 sm:h-6 inline mr-3" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactClient;