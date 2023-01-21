import { reaction } from 'mobx';
import { store } from 'src/store';

import { calculateShortcuts } from './calculateShortcuts';

reaction(
  () => store.initialized && store.bookmarks,
  (bookmarks) => {
    if (bookmarks) {
      calculateShortcuts(store.allBookmarks!, bookmarks);
    }
  }
);

export {};
