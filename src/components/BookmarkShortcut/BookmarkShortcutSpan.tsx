import { observer } from 'mobx-react';
import { store } from 'src/store';

export const BookmarkShortcutSpan = observer(
  ({ onClick, bookmarkIdx }: { onClick: () => void; bookmarkIdx: number }) => {
    const shortcut = store.shortcuts[bookmarkIdx];

    return (
      <span
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
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
