import { observer } from 'mobx-react';
import { Fragment } from 'react';

import { store } from '../store';

import { AndMore } from './AndMore';
import { Bookmark } from './Bookmark';

export const BookmarksList = observer(() => {
  return (
    <div className="bookmarks-list">
      {store.bookmarks.map((bookmark, i) => (
        <Fragment key={`bookmark-${bookmark.id}`}>
          {i > 0 ? <hr /> : null}
          <Bookmark {...bookmark} idx={i} />
        </Fragment>
      ))}
      {store.hasMore ? <AndMore /> : null}
    </div>
  );
});
