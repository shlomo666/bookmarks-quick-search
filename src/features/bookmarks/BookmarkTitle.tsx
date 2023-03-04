import { observer } from 'mobx-react-lite';
import { store } from 'src/store';

import { HighlightedSubStringCaseInsensitive } from './HighlightedSubStringCaseInsensitive';

export const BookmarkTitle = observer(({ title }: { title: string }) => {
  return (
    <span className="bookmark-title" title={title}>
      <HighlightedSubStringCaseInsensitive
        string={title}
        subString={store.query}
      />
    </span>
  );
});
