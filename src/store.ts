import { makeAutoObservable, runInAction } from 'mobx';

import { bookmarksBuilder } from './bookmarksBuilder';
import { BookmarksFilterer } from './BookmarksFilterer';
import { MAX_BOOKMARKS } from './common/consts';
import { BookmarkDetails } from './common/types';

class Store {
  query = '';
  private highlightedBookmarkIdx = 0;
  initialized = false;
  allBookmarks: BookmarkDetails[] = [];
  shortcuts: { [bookmarkIdx: number]: string } = {};

  constructor() {
    makeAutoObservable(this);
  }

  setQuery(query: string) {
    this.query = query;
  }

  init() {
    Store.getTree().then((allBookmarks) => {
      runInAction(() => {
        this.allBookmarks = allBookmarks;
      });
    });
  }

  private static async getTree() {
    const tree = await chrome.bookmarks.getTree();

    const allBookmarks = bookmarksBuilder.build(tree);
    return allBookmarks;
  }

  private getFilteredBookmarks() {
    const { query, allBookmarks } = this;

    const filteredBookmarks = new BookmarksFilterer(allBookmarks).filter(query);
    return filteredBookmarks;
  }

  get bookmarks() {
    return this.getFilteredBookmarks().slice(0, MAX_BOOKMARKS);
  }

  get hasMore() {
    return this.getFilteredBookmarks().length > MAX_BOOKMARKS;
  }

  get highlightedBookmark() {
    return this.bookmarks[this.highlightedBookmarkIdx];
  }

  get highlightedBookmarkUrl() {
    return this.highlightedBookmark?.url;
  }

  setHighlightedBookmarkIdx(idx: number) {
    this.highlightedBookmarkIdx = idx;
  }

  increaseHighlightedBookmarkIdx() {
    const total = this.bookmarks.length;
    this.highlightedBookmarkIdx = (this.highlightedBookmarkIdx + 1) % total;
  }

  decreaseHighlightedBookmarkIdx() {
    const total = this.bookmarks.length;

    this.highlightedBookmarkIdx =
      total === 0 ? 0 : (this.highlightedBookmarkIdx - 1 + total) % total;
  }

  isHighlightedBookmark(bookmarkIdx: number): boolean {
    const isHighlighted = bookmarkIdx === store.highlightedBookmarkIdx;
    return isHighlighted;
  }

  clearShortcuts() {
    this.shortcuts = {};
  }

  setShortcut(bookmarkIdx: number, shortcut: string) {
    this.shortcuts[bookmarkIdx] = shortcut;
  }
}

export const store = new Store();

store.init();
