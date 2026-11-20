'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Loader } from 'lucide-react';

export default function AddToCartButton({ product, className = '', children }) {
  const [adding, setAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Default classes for the button - اللون الأزرق بقى نفس لون الناف بار
  // بالظبط rgb(9, 78, 237)
  const defaultClasses =
    'w-full bg-[rgb(9,78,237)] text-white py-2.5 sm:py-3 rounded-xl sm:rounded-2xl hover:brightness-110 hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium text-base sm:text-lg flex items-center justify-center gap-2';

  const btnClasses = `${defaultClasses} ${className}`.trim();

  // Optimistic UI update for adding to cart
  const optimisticAdd = () => {
    try {
      window.dispatchEvent(
        new CustomEvent('productAddedToCart', { detail: { quantity: 1 } })
      );
    } catch (e) {
      console.warn('optimisticAdd dispatch failed', e);
    }
  };

  // Optimistic UI rollback
  const optimisticRemove = () => {
    try {
      window.dispatchEvent(
        new CustomEvent('productRemovedFromCart', { detail: { quantity: 1 } })
      );
    } catch (e) {
      console.warn('optimisticRemove dispatch failed', e);
    }
  };

  // Notify cart update
  const notifyCartUpdated = () => {
    try {
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (e) {
      console.warn('cartUpdated dispatch failed', e);
    }
  };

  // Handle adding to local storage cart
  const addToLocalCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const idx = cart.findIndex((p) => String(p.productId) === String(item.productId));
    if (idx !== -1) {
      cart[idx].quantity = (cart[idx].quantity || 0) + item.quantity;
    } else {
      cart.push(item);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  };

  // Handle add to cart action
  const handleAddToCart = async () => {
    if (adding) return;
    setAdding(true);
    setShowSuccess(true); // Show success message immediately

    const item = {
      productId: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency || 'ج.م',
      image: product.image,
      quantity: 1,
    };

    optimisticAdd();

    // السلة محفوظة في localStorage بس (موقع ستاتيك)
    try {
      addToLocalCart(item);
      notifyCartUpdated();
    } catch (err) {
      console.error('خطأ في localStorage:', err);
      optimisticRemove();
      alert('حدث خطأ، حاول مرة أخرى.');
      setShowSuccess(false);
    } finally {
      setAdding(false);
    }
  };

  // Hide success message after 3 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  return (
    <div className="relative">
      {showSuccess && (
        <div className="absolute -top-10 left-0 right-0 flex justify-center">
          <span className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold animate-fade-in">
            تمت الإضافة بنجاح!
          </span>
        </div>
      )}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={adding}
        aria-disabled={adding}
        className={btnClasses + (adding ? ' opacity-70 pointer-events-none' : '')}
      >
          <>
            <span>{children ?? 'اطلب الآن'}</span>
            <ShoppingCart className="w-4 sm:w-5 h-4 sm:h-5 inline mr-2" />
          </>
      </button>
    </div>
  );
}