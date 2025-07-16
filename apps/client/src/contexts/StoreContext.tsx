'use client';

import { StoreEntity } from '@salaty/shared';
import {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from 'react';

type StoreContextType = {
  store: StoreEntity | null;
  setStore: Dispatch<SetStateAction<StoreEntity | null>>;
};

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<StoreEntity | null>(null);

  return (
    <StoreContext.Provider value={{ store, setStore }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
