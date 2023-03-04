import { observer } from 'mobx-react';
import { BookmarksList } from 'src/features/bookmarks';
import { Header } from 'src/features/header';
import 'src/shortcuts/loadShortcutsInBackground';

function App() {
  return (
    <div>
      <Header />
      <BookmarksList />
    </div>
  );
}

export default observer(App);
