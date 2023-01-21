import { useEffect } from 'react';
import { store } from 'src/store';

export function useInitializedStore() {
  useEffect(() => {
    store.init();
  }, []);

  return store.initialized;
}
