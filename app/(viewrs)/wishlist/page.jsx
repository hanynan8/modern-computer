import WishlistClient from './_wishlistClient';
import { getAllProducts } from '@/lib/serverData';

export const metadata = {
  title: 'المفضلة',
  description: 'المنتجات اللي حفظتها في المفضلة.',
};

export default async function WishlistPage() {
  const allProducts = await getAllProducts();
  return <WishlistClient allProducts={allProducts} />;
}
