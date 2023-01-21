import { observer } from 'mobx-react';
import { store } from 'src/store';

import { HighlightedSubStringCaseInsensitive } from './HighlightedSubStringCaseInsensitive';

export const BookmarkPathPart = observer(
  ({
    idx,
    pathPart,
    fullPath,
  }: {
    idx: number;
    pathPart: string;
    fullPath: string;
  }) => {
    return (
      <span
        key={idx}
        className="bookmark-path"
        title="Search in this folder"
        onClick={() => store.setQuery(fullPath)}
      >
        <HighlightedSubStringCaseInsensitive
          string={pathPart}
          subString={store.query}
        />
        /
      </span>
    );
  }
);
