import { observer } from 'mobx-react';
import { useInitializedStore } from 'src/hooks/useInitializedStore';

import { BookmarksList } from './BookmarksList';
import { Header } from './Header';
import 'src/shortcuts/loadShortcutsInBackground';

function App() {
  const initializedStore = useInitializedStore();

  return initializedStore ? (
    <div>
      <Header />
      <BookmarksList />
    </div>
  ) : null;
}

export default observer(App);
