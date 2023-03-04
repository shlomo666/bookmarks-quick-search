import { observer } from 'mobx-react';
import { invokeBookmark } from 'src/actions/invokeBookmark';
import { BookmarkDetails } from 'src/common/types';
import { store } from 'src/store';

import { BookmarkFaviconUrl } from './BookmarkFaviconUrl';
import { BookmarkPath } from './BookmarkPath';
import { BookmarkShortcut } from './BookmarkShortcut/BookmarkShortcut';
import { BookmarkTitle } from './BookmarkTitle';

export const Bookmark = observer(
  (bookmarkDetails: BookmarkDetails & { idx: number }) => {
    const { idx, faviconUrl, title, path, url } = bookmarkDetails;

    const extraBookmarkContentClasses = getExtraBookmarkContentClasses(idx);

    return (
      <div className="content-row">
        <div
          className={`bookmark-main-content ${extraBookmarkContentClasses}`}
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

function getExtraBookmarkContentClasses(idx: number) {
  const isHighlighted = store.isHighlightedBookmark(idx);
  const specificBookmarkContentStyle = isHighlighted ? 'highlighted' : '';
  return specificBookmarkContentStyle;
}
