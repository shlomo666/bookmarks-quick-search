import { BookmarkDetails } from './common/types';

export class BookmarksFilterer {
  constructor(private readonly bookmarks: BookmarkDetails[]) {}

  filter(q: string) {
    const { bookmarks } = this;

    const qLowerCase = (q || '').toLowerCase();
    const words = qLowerCase
      .split(' ')
      .map((q) => q.trim())
      .filter((q) => q);

    let relevantBookmarks = bookmarks
      .filter((p) =>
        words.every((q) =>
          [p.path.toLowerCase(), p.title.toLowerCase()].some((s) =>
            s.includes(q)
          )
        )
      )
      .sort((a, b) =>
        [a, b]
          .map((p) =>
            (p.title.toLowerCase() + p.path.toLowerCase()).indexOf(words[0])
          )
          .reduce((a, b) => a - b)
      );
    if (relevantBookmarks.length === 0) {
      const chars = qLowerCase.split('');
      relevantBookmarks = bookmarks.filter((p) => {
        const set = new Set((p.path + p.title).toLowerCase().split(''));
        return chars.every((q) => set.has(q));
      });
    }
    return relevantBookmarks;
  }
}
