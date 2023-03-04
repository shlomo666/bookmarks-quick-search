import { reaction } from 'mobx';
import { observer } from 'mobx-react';
import { useEffect, useRef } from 'react';
import { invokeBookmark } from 'src/actions/invokeBookmark';
import { store } from 'src/store';

export const SearchBar = observer(() => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() =>
    reaction(
      () => store.query,
      () => ref.current?.focus()
    )
  );

  return (
    <input
      ref={ref}
      type="text"
      value={store.query}
      onChange={(e) => store.setQuery(e.target.value)}
      placeholder="Let's search in bookmarks"
      autoFocus
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          invokeBookmark(store.highlightedBookmarkUrl);
        }
        if (e.key === 'ArrowDown') {
          store.increaseHighlightedBookmarkIdx();
          e.preventDefault();
        }
        if (e.key === 'ArrowUp') {
          store.decreaseHighlightedBookmarkIdx();
          e.preventDefault();
        }
      }}
    />
  );
});
