import { getMyStoresServer } from '@/lib/api/store';
import StoresPageClient from './client';

export default async function StoresPage() {
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Your Stores</h1>
      <StoresPageClient />
    </div>
  );
}
