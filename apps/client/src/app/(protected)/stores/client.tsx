'use client';

import { useRouter } from 'next/navigation';
import { StoreEntity } from '@salaty/shared';

import { useStores } from '@/lib/queries/useStore';

export default function StoresPageClient() {
  const router = useRouter();
  const { data: stores, isLoading, isError } = useStores();

  if (isLoading) return <p>Loading stores...</p>;
  if (isError) return <p>Failed to load stores. Please try again later.</p>;

  if (!stores || stores.length === 0) {
    return <h3>Looks like you don't have any stores created yet!</h3>;
  }

  const handleSelectStore = (storeId: string) => {
    router.push(`/store/${storeId}/dashboard`);
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
      {stores.map((store) => (
        <button
          key={store.id}
          onClick={() => handleSelectStore(store.id)}
          className='border rounded-lg p-4 flex items-center gap-4 hover:shadow-lg transition'
        >
          <img
            src={store.logo}
            alt={store.name}
            className='w-12 h-12 rounded-md object-cover'
          />
          <span className='text-lg font-medium'>{store.name}</span>
        </button>
      ))}
    </div>
  );
}
