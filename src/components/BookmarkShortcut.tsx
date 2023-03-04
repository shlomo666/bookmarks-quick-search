import { observer } from 'mobx-react';
import { store } from 'src/store';

export const BookmarkShortcut = observer(
  ({ bookmarkIdx }: { bookmarkIdx: number }) => {
    const shortcut = store.shortcuts[bookmarkIdx];
    return (
      <span
        className="bookmark-shortcut stick-to-right"
        title={
          shortcut &&
          `Search '${shortcut}' to get this bookmark as the first result`
        }
      >
        {shortcut}
      </span>
    );
  }
);
