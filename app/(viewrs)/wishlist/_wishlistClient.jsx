'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2, Loader, ArrowRight } from 'lucide-react';
import AddToCartButton from '../../(products)/_addToTheCart';

const WishlistPage = ({ allProducts = [] }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // المنتجات كلها جاية جاهزة من السيرفر وقت الـ build، والمفضلة نفسها
  // (قايمة الـ ids) محفوظة في localStorage على جهاز الزائر.
  const loadWishlist = useCallback(() => {
    try {
      const ids = JSON.parse(localStorage.getItem('wishlist')) || [];
      setItems(
        allProducts.filter((p) => ids.some((id) => String(id) === String(p.id)))
      );
    } catch (err) {
      console.error('Error loading wishlist:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [allProducts]);

  useEffect(() => {
    loadWishlist();
    const handleUpdate = () => loadWishlist();
    window.addEventListener('wishlistUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('wishlistUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [loadWishlist]);

  const removeFromWishlist = (id) => {
    try {
      const ids = JSON.parse(localStorage.getItem('wishlist')) || [];
      const next = ids.filter((p) => String(p) !== String(id));
      localStorage.setItem('wishlist', JSON.stringify(next));
      setItems((prev) => prev.filter((p) => String(p.id) !== String(id)));
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-br from-brand-blue to-brand-blue-dark w-11 h-11 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            المفضلة
          </h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader className="w-10 h-10 animate-spin text-brand-blue mb-4" />
            <p className="text-gray-500">جاري تحميل المفضلة...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Heart className="w-14 h-14 mx-auto text-gray-300 mb-4" />
            <p className="text-lg text-gray-600 mb-6">
              لا توجد منتجات في المفضلة حتى الآن
            </p>
            <Link
              href="/laptop"
              className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-full font-semibold hover:brightness-110 transition-all"
            >
              تصفح المنتجات
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {items.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="relative">
                  <Link href={`/${product.categoryKey}/${product.id}`}>
                    <div className="relative w-full h-52 bg-gray-50">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    aria-label="إزالة من المفضلة"
                    className="absolute top-3 left-3 bg-white/90 backdrop-blur p-2 rounded-full shadow hover:scale-110 transition-transform"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
                <div className="p-4 sm:p-5">
                  <Link href={`/${product.categoryKey}/${product.id}`}>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-brand-blue transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-brand-blue">
                      {typeof product.price === 'number'
                        ? product.price.toLocaleString()
                        : product.price}
                      <span className="text-sm mr-1">
                        {product.currency || 'ج.م'}
                      </span>
                    </span>
                  </div>
                  <AddToCartButton product={product}>
                    <span className="flex items-center justify-center gap-2">
                      <ShoppingCart size={16} />
                      اضف الي السلة
                    </span>
                  </AddToCartButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;