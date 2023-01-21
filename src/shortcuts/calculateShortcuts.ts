import { BookmarkDetails } from 'src/common/types';
import { store } from 'src/store';

import { findFirstBookmarkId } from './findFirstBookmarkId';
import { getAllCharCombinations } from './getAllCharCombinations';
import { timePassedMS } from './timePassedMS';

const MAX_SHORTCUT_LENGTH = 3;

let iteration = 1;
export async function calculateShortcuts(
  all: BookmarkDetails[],
  bookmarks: BookmarkDetails[]
) {
  store.clearShortcuts();

  const currIteration = ++iteration;
  const checkForEvents = async () => {
    if (timePassedMS() > 5) {
      await new Promise((r) => requestAnimationFrame(r));
    }
    if (iteration !== currIteration) {
      return true;
    }
  };
  for (let idx = 0; idx < bookmarks.length; idx++) {
    const bookmark = bookmarks[idx];
    const allChars = [
      ...new Set((bookmark.title + bookmark.path).toLowerCase().split('')),
    ];
    let shortcutLength = 0;
    let foundShortcut = false;
    while (++shortcutLength <= MAX_SHORTCUT_LENGTH && !foundShortcut) {
      const partials = getAllCharCombinations(allChars, shortcutLength);
      for (let i = 0; i < partials.length && !foundShortcut; i++) {
        if (await checkForEvents()) return;
        const shortcut = partials[i];
        const matched = findFirstBookmarkId(all, shortcut) === bookmark.id;
        if (matched) {
          store.setShortcut(idx, shortcut);
          foundShortcut = true;
        }
      }
    }
  }
}
