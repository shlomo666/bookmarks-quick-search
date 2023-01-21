import { keyBy } from 'lodash';

import { BookmarkDetails, BookmarkTreeNode } from './common/types';

class BookmarksBuilder {
  build(tree: BookmarkTreeNode[]): BookmarkDetails[] {
    const all = [...tree];
    for (let i = 0; i < all.length; i++) {
      all.push(...(all[i].children || []));
    }
    all.splice(0, 3);

    const nodeByIdMap = keyBy(all, (p) => p.id);

    const bookmarks = all
      .filter((p) => p.url)
      .map((p) => ({
        ...this.getTitlePath(p, nodeByIdMap),
        faviconUrl: this.getFaviconUrl(p.url || ''),
        url: p.url || '',
        id: p.id,
      }));

    return bookmarks;
  }

  private getTitlePath(
    mainNode: BookmarkTreeNode,
    nodeByIdMap: Record<string, BookmarkTreeNode>
  ) {
    let node = mainNode;
    const title = mainNode.title;

    let path = '';
    while ((node = nodeByIdMap[node.parentId || ''])) {
      path = `${node.title}/${path}`;
    }

    return { title, path };
  }

  private getFaviconUrl(url: string) {
    return (global as any).IS_TEST
      ? ''
      : `chrome-extension://${
          chrome.runtime.id
        }/_favicon/?pageUrl=${encodeURIComponent(url)}&size=16`;
  }
}

export const bookmarksBuilder = new BookmarksBuilder();
