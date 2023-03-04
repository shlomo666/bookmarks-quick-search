import { useCallback, useState } from 'react';

import { BookmarkShortcutSpan } from './BookmarkShortcutSpan';
import { MultiShortcutsList } from './MultiShortcutsList';

export const BookmarkShortcut = ({ bookmarkIdx }: { bookmarkIdx: number }) => {
  const [showMultipleShortcuts, setShowMultipleShortcuts] = useState(false);

  const showMultiShortcutsList = useCallback(
    () => setShowMultipleShortcuts(true),
    [setShowMultipleShortcuts]
  );
  const hideMultiShortcutsList = useCallback(
    () => setShowMultipleShortcuts(false),
    [setShowMultipleShortcuts]
  );

  return showMultipleShortcuts ? (
    <MultiShortcutsList
      onClick={hideMultiShortcutsList}
      bookmarkIdx={bookmarkIdx}
    />
  ) : (
    <BookmarkShortcutSpan
      onClick={showMultiShortcutsList}
      bookmarkIdx={bookmarkIdx}
    />
  );
};
