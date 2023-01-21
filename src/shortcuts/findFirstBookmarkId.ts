import { minBy } from 'lodash';
import { BookmarkDetails } from 'src/common/types';

const findFirstBookmarkIdResponseCache = new Map();
export function findFirstBookmarkId(bookmarks: BookmarkDetails[], q: string) {
  const cacheVal = findFirstBookmarkIdResponseCache.get(q);
  if (cacheVal) return cacheVal;

  const qLowerCase = (q || '').toLowerCase();
  const words = qLowerCase
    .split(' ')
    .map((q) => q.trim())
    .filter((q) => q);

  const relevantBookmarks = bookmarks.filter((p) =>
    words.every((q) =>
      [p.path.toLowerCase(), p.title.toLowerCase()].some((s) => s.includes(q))
    )
  );
  let mostRelevantBookmark = minBy(relevantBookmarks, (p) =>
    (p.title.toLowerCase() + p.path.toLowerCase()).indexOf(words[0])
  );
  if (!mostRelevantBookmark) {
    const chars = qLowerCase.split('');
    mostRelevantBookmark = bookmarks.find((p) => {
      const set = new Set((p.path + p.title).toLowerCase().split(''));
      return chars.every((q) => set.has(q));
    });
  }

  findFirstBookmarkIdResponseCache.set(q, mostRelevantBookmark!.id);
  return mostRelevantBookmark!.id;
}
