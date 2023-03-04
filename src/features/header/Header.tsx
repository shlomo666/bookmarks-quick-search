import { HeaderImage } from './HeaderImage';
import { SearchBar } from './SearchBar';

export function Header() {
  return (
    <div className="header">
      <HeaderImage />
      <SearchBar />
    </div>
  );
}
