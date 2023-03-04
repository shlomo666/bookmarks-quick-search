import { calcMultipleShortcuts } from 'src/shortcuts/calcMultipleShortcuts';

export function MultiShortcutsList({
  bookmarkIdx,
  onClick,
}: {
  bookmarkIdx: number;
  onClick: () => void;
}) {
  const multiShortcuts: string[] = calcMultipleShortcuts(bookmarkIdx);

  return (
    <div
      className="multi-shortcuts-list stick-to-right"
      title={`When you type any of these you get this bookmark as the first result`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {multiShortcuts.map((shortcut) => (
        <div key={shortcut} className="multi-shortcut">
          {shortcut}
        </div>
      ))}
    </div>
  );
}
