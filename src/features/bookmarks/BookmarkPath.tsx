import { BookmarkPathPart } from './BookmarkPathPart';

export function BookmarkPath({ path }: { path: string }) {
  return path ? (
    <>
      {path
        .split('/')
        .filter(Boolean)
        .map((pathPart, idx, parts) => (
          <BookmarkPathPart
            key={idx}
            idx={idx}
            pathPart={pathPart}
            fullPath={parts.slice(0, idx + 1).join('/')}
          />
        ))}
    </>
  ) : null;
}
