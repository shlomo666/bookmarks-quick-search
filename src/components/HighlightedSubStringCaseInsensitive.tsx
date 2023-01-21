export function HighlightedSubStringCaseInsensitive({
  string,
  subString,
}: {
  string: string;
  subString: string;
}) {
  const subStringIdx = string.toLowerCase().indexOf(subString.toLowerCase());

  if (subStringIdx === -1) {
    return <>{string}</>;
  }

  const subStringLength = subString.length;

  const beforeSubString = string.substring(0, subStringIdx);
  const subStringMatch = string.substring(
    subStringIdx,
    subStringIdx + subStringLength
  );
  const afterSubString = string.substring(subStringIdx + subStringLength);

  return (
    <>
      {beforeSubString}
      <b className="highlighted-substring">{subStringMatch}</b>
      {afterSubString}
    </>
  );
}
