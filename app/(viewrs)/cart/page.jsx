'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  MessageCircle,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

const WHATSAPP_NUMBER = '201222812404';

// السلة ستاتيك بالكامل: محفوظة في localStorage على جهاز الزائر، ومفيش
// حسابات ولا قاعدة بيانات. إتمام الطلب بيتم برسالة واتساب جاهزة.
const readCart = () => {
  try {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
};

const writeCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('cartUpdated'));
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingItems] = useState(new Set());
  const [removingItems] = useState(new Set());

  const fetchCart = useCallback(() => {
    setCartItems(readCart());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCart();
    window.addEventListener('storage', fetchCart);
    return () => window.removeEventListener('storage', fetchCart);
  }, [fetchCart]);

  const updateQuantity = (item, delta) => {
    const next = readCart()
      .map((p) =>
        String(p.productId) === String(item.productId)
          ? { ...p, quantity: Math.max(1, (p.quantity || 1) + delta) }
          : p
      );
    writeCart(next);
    setCartItems(next);
  };

  const removeItem = (item) => {
    const next = readCart().filter(
      (p) => String(p.productId) !== String(item.productId)
    );
    writeCart(next);
    setCartItems(next);
  };

  const clearCart = () => {
    writeCart([]);
    setCartItems([]);
  };

  const calculateTotal = () =>
    cartItems
      .reduce((t, item) => t + (item.price ?? 0) * (item.quantity ?? 0), 0)
      .toLocaleString();

  const handleOrder = () => {
    const lines = cartItems.map(
      (item, i) =>
        `${i + 1}. ${item.name} × ${item.quantity} = ${(
          (item.price ?? 0) * (item.quantity ?? 0)
        ).toLocaleString()} ${item.currency ?? 'ج.م'}`
    );
    const text = `مرحبًا، عايز أطلب:\n${lines.join('\n')}\n\nالإجمالي: ${calculateTotal()} ج.م`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener'
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="mr-2 text-gray-600">جاري تحميل السلة...</span>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="w-full text-center py-20 bg-white rounded-lg shadow-md">
        <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-xl font-semibold text-gray-800 mb-2">سلتك فارغة</p>
        <Link
          href="/"
          className="inline-block mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          ابدأ التسوق الآن
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 mx-auto max-w-4xl" dir="rtl">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            سلة التسوق
          </h1>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 font-medium flex items-center transition-colors"
          >
            <Trash2 className="w-5 h-5 ml-2" />
            حذف الكل
          </button>
        </div>

        <div className="space-y-6 w-full">
          {cartItems.map((item, index) => {
            const isUpdating = updatingItems.has(item.productId);
            const isRemoving = removingItems.has(item.productId);

            if (isRemoving) {
              return (
                <div key={`removing-${item.productId}-${index}`} className="flex items-center justify-center py-4 opacity-70">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-600 mr-2" />
                  <span>جاري حذف المنتج...</span>
                </div>
              );
            }

            return (
              <div
                key={`${item.productId}-${item.name}-${index}`}
                className={`flex flex-col sm:flex-row sm:items-center justify-between border-b pb-6 last:border-b-0 gap-4 sm:gap-0 w-full transition-all duration-200 ${
                  isUpdating ? 'opacity-70' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center flex-1 gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md shadow-sm self-center sm:self-auto"
                  />
                  <div className="text-center sm:text-right">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                      {item.name}
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {(item.price ?? 0).toLocaleString()} {item.currency ?? 'ج.م'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center sm:justify-end">
                  <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 ml-4">
                    <button
                      onClick={() => updateQuantity(item, -1)}
                      disabled={isUpdating}
                      className={`text-gray-600 hover:text-gray-900 p-1 transition-colors ${
                        isUpdating ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                    >
                      <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <span
                      className={`mx-2 sm:mx-3 font-medium min-w-[1.5rem] sm:min-w-[2rem] text-center text-sm sm:text-base transition-all duration-200 ${
                        isUpdating ? 'scale-110 text-purple-600' : ''
                      }`}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item, 1)}
                      disabled={isUpdating}
                      className={`text-gray-600 hover:text-gray-900 p-1 transition-colors ${
                        isUpdating ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item)}
                    disabled={isUpdating}
                    className={`text-red-500 hover:text-red-700 p-1 mr-2 transition-colors ${
                      isUpdating ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t w-full">
          <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900">
            <span>الإجمالي:</span>
            <span className="transition-all duration-300">
              {calculateTotal()} ج.م
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="text-center text-sm text-gray-600">
            هيتم إرسال طلبك على واتساب لإتمام الشراء مع فريق المبيعات
          </div>
          <button
            onClick={handleOrder}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 text-base sm:text-lg flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            اطلب عبر واتساب
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;