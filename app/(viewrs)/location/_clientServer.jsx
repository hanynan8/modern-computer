'use client';

import React from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Navigation,
  Shield,
  Users,
  Building,
  Camera,
} from 'lucide-react';

import Link from 'next/link';

function goToWatssap(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return;
  window.open(`https://wa.me/${digits}`);
}

const LocationPageClient = ({ initialData, error }) => {
  const locationData = initialData;
  const whatsappPhone = locationData?.mainLocation?.details?.find((d) => d.icon === 'Phone')?.description;
  const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${locationData?.mapSection?.placeholder?.title || ''} ${locationData?.mapSection?.placeholder?.address || ''}`.trim()
  )}`;
  // Icon mapping
  const iconMap = {
    MapPin,
    Clock,
    Phone,
    Mail,
    Navigation,
    Shield,
    Users,
    Building,
    Camera,
  };


  if (!locationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50" dir="rtl">
        <p className="text-xl text-gray-600">{error || 'لا توجد بيانات متاحة'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Hero Section */}
      <section className="relative h-64 sm:h-96 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
              {locationData.pageTitle}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl opacity-90">
              {locationData.pageSubtitle}
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-10 sm:w-20 h-10 sm:h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-16 sm:w-32 h-16 sm:h-32 bg-white/5 rounded-full animate-pulse"></div>
      </section>

      {/* Main Location Info */}
      <section className="py-10 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-12">
            {/* Location Details */}
            <div className="space-y-4 sm:space-y-8">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-4 sm:p-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                  {locationData.mainLocation.title}
                </h2>
                <div className="space-y-2 sm:space-y-4">
                  {locationData.mainLocation.details.map((detail, index) => {
                    const IconComponent = iconMap[detail.icon];
                    return (
                      <div key={index} className="flex items-start">
                        <div
                          className={`bg-gradient-to-br ${detail.color} w-10 sm:w-12 h-10 sm:h-12 rounded-xl flex items-center justify-center ml-3 sm:ml-4 flex-shrink-0`}
                        >
                          {IconComponent && (
                            <IconComponent className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                            {detail.title}
                          </h4>
                          <p className="text-gray-600">{detail.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 ml-3" />
                  {locationData.workingHours.title}
                </h3>
                <div className="grid md:grid-cols-2 gap-2 sm:gap-4">
                  {locationData.workingHours.schedule.map((day, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 sm:py-3 px-3 sm:px-4 bg-gray-50 rounded-xl"
                    >
                      <span className="font-bold text-gray-900">{day.day}</span>
                      <span className="text-gray-600">{day.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map & Contact */}
            <div className="space-y-4 sm:space-y-8">
              {/* Interactive Map */}
              <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-lg">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                  {locationData.mapSection.title}
                </h3>
                <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl h-64 sm:h-80 flex items-center justify-center mb-4 sm:mb-6">
                  <div className="text-center text-gray-600">
                    <MapPin className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" />
                    <p className="text-lg sm:text-xl font-bold">
                      {locationData.mapSection.placeholder.title}
                    </p>
                    <p className="text-sm">
                      {locationData.mapSection.placeholder.address}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
                  <Link href={MAPS_URL} className="flex-1">
                    <button className="w-full bg-purple-600 text-white py-2 sm:py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors">
                      {locationData.mapSection.buttons.directions}
                      <Navigation className="w-4 sm:w-5 h-4 sm:h-5 inline mr-2" />
                    </button>
                  </Link>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(MAPS_URL);
                        alert('📋 تم نسخ الرابط!');
                      } catch (err) {
                        console.error('فشل النسخ:', err);
                      }
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 sm:py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                  >
                    {locationData.mapSection.buttons.share}
                  </button>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-4 sm:p-8 text-white">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
                  {locationData.quickContact.title}
                </h3>
                <div className="space-y-2 sm:space-y-4">
                  {locationData.quickContact.methods.map((method, index) => {
                    const IconComponent = iconMap[method.icon];
                    return (
                      <div key={index} className="flex items-center">
                        {IconComponent && (
                          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 ml-4" />
                        )}
                        <div>
                          <p className="font-bold">{method.label}</p>
                          <p className="opacity-90">{method.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Branches Section */}
      {locationData.branches?.locations?.length > 0 && (
        <section className="py-10 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-16">
              <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
                {locationData.branches.title}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600">
                {locationData.branches.subtitle}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {locationData.branches.locations.map((branch, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-4 sm:p-8 shadow-lg"
                >
                  <div
                    className={`bg-gradient-to-br ${branch.color} w-12 sm:w-16 h-12 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6`}
                  >
                    <Building className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{branch.name}</h3>
                  <p className="text-gray-600 mb-2 flex items-center gap-2"><MapPin className="w-4 h-4 shrink-0" />{branch.address}</p>
                  <p className="text-gray-600 mb-2 flex items-center gap-2"><Phone className="w-4 h-4 shrink-0" /><a href={`tel:${branch.phone}`} dir="ltr">{branch.phone}</a></p>
                  <p className="text-gray-600 mb-4 flex items-center gap-2"><Clock className="w-4 h-4 shrink-0" />{branch.hours}</p>
                  <Link href={MAPS_URL}>
                    <span className="text-purple-600 font-bold hover:text-purple-800">{locationData.branches.viewButton}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-10 sm:py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
              {locationData.features.title}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              {locationData.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {locationData.features.items.map((feature, index) => {
              const IconComponent = iconMap[feature.icon];
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div
                    className={`bg-gradient-to-br ${feature.color} w-12 sm:w-16 h-12 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6`}
                  >
                    {IconComponent && (
                      <IconComponent className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Visit Us CTA */}
      <section className="py-10 sm:py-20 bg-gradient-to-r from-purple-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="text-white mb-6 sm:mb-12">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6">
              {locationData.visitSection.title}
            </h2>
            <p className="text-lg sm:text-2xl opacity-90 mb-6 sm:mb-8">
              {locationData.visitSection.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 sm:space-x-reverse">
            <Link href={MAPS_URL}>
              <button className="bg-white text-purple-600 px-8 sm:px-12 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                {locationData.visitSection.buttons.visit}
                <MapPin className="w-5 sm:w-6 h-5 sm:h-6 inline mr-3" />
              </button>
            </Link>
            <button
              onClick={() => goToWatssap(whatsappPhone)}
              className="bg-white/20 backdrop-blur-sm text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-bold hover:bg-white/30 transition-all duration-300"
            >
              {locationData.visitSection.buttons.call}
              <Phone className="w-5 sm:w-6 h-5 sm:h-6 inline mr-3" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LocationPageClient;