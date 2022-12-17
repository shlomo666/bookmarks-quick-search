/**
 * @param {number} idx
 * @param {string} shortcut
 */
function displayShortcut(idx, shortcut) {
  const span = document.getElementById(`shortcut_${idx}`);
  if (!span) return;
  span.innerText = shortcut;
  span.title = `Search '${shortcut}' to get this bookmark as the first result`;
}

/**
 * @param {number} bookmarksNumber
 * @param {string} query
 */
async function highlightQueryInsideBookmarks(bookmarksNumber, query) {
  if (!query) return;
  for (let i = 0; i < bookmarksNumber; i++) {
    if (util.timePassed() > 5) {
      await new Promise((r) => requestAnimationFrame(r));
    }

    const titleSpan = document.getElementById(`bookmarkTitle_${i}`);
    if (!titleSpan) continue;
    if (highlightSubStringInsideSpan(titleSpan, query)) continue;

    for (let j = 0; ; j++) {
      const pathSpan = document.getElementById(`bookmarkPath_${i}_${j}`);
      if (!pathSpan) break;
      if (highlightSubStringInsideSpan(pathSpan, query)) break;
    }
  }
}

/**
 * @param {HTMLSpanElement} span
 * @param {string} substr
 */
function highlightSubStringInsideSpan(span, substr) {
  const text = span.innerText;
  const substrIdx = text.toLowerCase().indexOf(substr.toLowerCase());
  if (substrIdx === -1) {
    return false;
  }

  const highlightedText = text.substring(substrIdx, substrIdx + substr.length);
  const textBefore = text.slice(0, substrIdx);
  const textAfter = text.slice(substrIdx + substr.length);
  span.innerHTML = `${textBefore}<b style="color: magenta">${highlightedText}</b>${textAfter}`;
  return true;
}
