import { observer } from 'mobx-react';

import { BookmarksList } from './BookmarksList';
import { Header } from './Header';
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
