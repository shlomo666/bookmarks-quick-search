import {
  MAX_MULTI_SHORTCUTS_TO_DISPLAY,
  MAX_SHORTCUT_LENGTH,
} from 'src/common/consts';
import { store } from 'src/store';

import { findFirstBookmarkId } from './findFirstBookmarkId';
import { getAllCharCombinations } from './getAllCharCombinations';

export function calcMultipleShortcuts(bookmarkIdx: number): string[] {
  const bookmark = store.bookmarks[bookmarkIdx];
  const allChars = [
    ...new Set((bookmark.title + bookmark.path).toLowerCase().split('')),
  ];
  let shortcutLength = 0;
  let foundShortcuts: string[] = [];
  while (
    ++shortcutLength <= MAX_SHORTCUT_LENGTH &&
    foundShortcuts.length <= MAX_MULTI_SHORTCUTS_TO_DISPLAY
  ) {
    let combinations = getAllCharCombinations(allChars, shortcutLength);
    combinations = removeCombsThatArePrefixedByExistingShortcut(
      combinations,
      foundShortcuts
    );
    for (
      let i = 0;
      i < combinations.length &&
      foundShortcuts.length <= MAX_MULTI_SHORTCUTS_TO_DISPLAY;
      i++
    ) {
      const shortcut = combinations[i];
      const matched =
        findFirstBookmarkId(store.allBookmarks, shortcut) === bookmark.id;
      if (matched) {
        foundShortcuts.push(shortcut);
      }
    }
  }

  return foundShortcuts;
}

function removeCombsThatArePrefixedByExistingShortcut(
  combinations: string[],
  foundShortcuts: string[]
) {
  return combinations.filter((comb) => {
    return !foundShortcuts.some((shortcut) => comb.startsWith(shortcut));
  });
}
