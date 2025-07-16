// import { StoreEntity } from '@salaty/shared';
// import { api } from '../fetcher';

import { headers } from 'next/headers';

export async function getMyStoresServer() {
  const cookieHeader = (await headers()).get('cookie');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stores`, {
    headers: {
      Cookie: cookieHeader || '',
    },
  });

  if (!res.ok) throw new Error('Failed to fetch stores');

  return res.json();
}
