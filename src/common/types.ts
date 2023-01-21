export type BookmarkDetails = {
  id: string;
  title: string;
  path: string;
  url: string;
  faviconUrl: string;
};

export type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;
