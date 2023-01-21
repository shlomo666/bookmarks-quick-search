import { observer } from 'mobx-react';
import { invokeBookmark } from 'src/actions/invokeBookmark';
import { BookmarkDetails } from 'src/common/types';
import { store } from 'src/store';

import { BookmarkFaviconUrl } from './BookmarkFaviconUrl';
import { BookmarkPath } from './BookmarkPath';
import { BookmarkShortcut } from './BookmarkShortcut';
import { BookmarkTitle } from './BookmarkTitle';

export const Bookmark = observer(
  (bookmarkDetails: BookmarkDetails & { idx: number }) => {
    const { idx, faviconUrl, title, path, url } = bookmarkDetails;

    const isHighlighted = store.isHighlightedBookmark(idx);

    return (
      <div>
        <div
          className={`bookmark ${isHighlighted ? 'highlighted' : ''}`}
          onMouseEnter={() => store.setHighlightedBookmarkIdx(idx)}
          onClick={() => invokeBookmark(url)}
        >
          <BookmarkFaviconUrl faviconUrl={faviconUrl} />
          <BookmarkTitle title={title} />
          <BookmarkShortcut bookmarkIdx={idx} />
        </div>
        <BookmarkPath path={path} />
      </div>
    );
  }
);
