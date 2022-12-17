'use strict';

const MAX_BOOKMARKS = 300;
let search = document.querySelector('input');
const root = document.getElementById('root');
let finishedHtmlLoad = Promise.resolve();

/** @type {() => Promise<chrome.bookmarks.BookmarkTreeNode[]>} */
const getTree = () => new Promise((r) => chrome.bookmarks.getTree(r));

setTimeout(loadResults, 1);
search.focus();

/** @param {string} q */
async function loadResults(q) {
  let all = await getBookmarks();
  let bookmarks = filterBookmarks(all, q);

  const hasMore = bookmarks.length > MAX_BOOKMARKS;
  bookmarks = bookmarks.slice(0, MAX_BOOKMARKS);

  currentNodeOptions = bookmarks;
  currentNodeOptionsIndex = 0;

  root.innerHTML =
    bookmarks
      .map(
        ({ faviconUrl, title, shortcut, path }, i) =>
          `<div>
            <div id="div_${i}">
              <img src="${faviconUrl}" />
              <span id="bookmarkTitle_${i}" class="bookmarkTitle" title="${title}">${title}</span>
              ${
                !shortcut
                  ? `<span id="shortcut_${i}" class="bookmarkShortcut"></span>`
                  : `<span class="bookmarkShortcut" title="Search '${shortcut}' to get this bookmark as the first result">${shortcut}</span>`
              }
            </div>
          ${
            path
              ? path
                  .split('/')
                  .filter((part) => part)
                  .map(
                    (pathPart, idx) =>
                      `<span class="bookmarkPath" id="bookmarkPath_${i}_${idx}" title="Search in this folder">${pathPart}/</span>`
                  )
                  .join('')
              : ''
          }
          </div>`
      )
      .join('<hr>') +
    (hasMore ? '<hr><div class="andMore">And more...</div>' : '');

  boldText(currentNodeOptionsIndex, true);
  bookmarks.forEach((p, i) => {
    const div = document.getElementById('div_' + i);
    if (div) {
      div.onclick = () => {
        currentNodeOptionsIndex = i;
        goto();
      };
      div.onmouseenter = () => {
        boldText(currentNodeOptionsIndex, false);
        currentNodeOptionsIndex = i;
        boldText(currentNodeOptionsIndex, true);
      };
    }

    let idx = -1;
    /** @type {HTMLElement} */
    let bookmarkPath;
    let path = '';
    const elements = [];
    while (
      (bookmarkPath = document.getElementById(`bookmarkPath_${i}_${++idx}`))
    ) {
      path += bookmarkPath.innerText;
      elements.push({ bookmarkPath, path });
    }

    elements.forEach(({ bookmarkPath, path }) => {
      bookmarkPath.onclick = () => {
        search.value = path;
        refreshPopup();
        search.focus();
      };

      bookmarkPath.onmouseenter = () => {
        boldTextForElement(bookmarkPath, true);
      };
      bookmarkPath.onmouseleave = () => {
        boldTextForElement(bookmarkPath, false);
      };
    });
  });

  highlightQueryInsideBookmarks(bookmarks.length, q);
  loadShortcuts(all, bookmarks);
}

let iteration = 1;
async function loadShortcuts(all, bookmarks) {
  const currIteration = ++iteration;
  const checkForEvents = async () => {
    if (util.timePassed() > 5) {
      await new Promise((r) => requestAnimationFrame(r));
    }
    if (iteration !== currIteration) {
      return true;
    }
  };
  for (let idx = 0; idx < bookmarks.length; idx++) {
    const bookmark = bookmarks[idx];
    const allChars = [
      ...new Set((bookmark.title + bookmark.path).toLowerCase().split('')),
    ];
    let shortcutLength = 0;
    let foundShortcut = false;
    while (++shortcutLength <= 3 && !foundShortcut) {
      const partials = util.allCombinations(allChars, shortcutLength);
      for (let i = 0; i < partials.length && !foundShortcut; i++) {
        if (await checkForEvents()) return;
        const shortcut = partials[i];
        const matched = findFirstBookmarkId(all, shortcut) === bookmark.id;
        if (matched) {
          displayShortcut(idx, shortcut);
          foundShortcut = true;
        }
      }
    }
  }
}

async function getBookmarks() {
  const tree = await getTree();
  const all = [...tree];
  for (let i = 0; i < all.length; i++) {
    all.push(...(all[i].children || []));
  }
  all.splice(0, 3);

  const nodeByIdMap = all.keyBy((p) => p.id);

  const bookmarks = all
    .filter((p) => p.url)
    .map((p) => ({
      ...getTitlePath(p, nodeByIdMap),
      faviconUrl: getFaviconUrl(p.url),
      url: p.url,
      id: p.id,
    }));

  return bookmarks;
}

/** @param {string} url */
function getFaviconUrl(url) {
  return IS_TEST
    ? ''
    : `chrome-extension://${
        chrome.runtime.id
      }/_favicon/?pageUrl=${encodeURIComponent(url)}&size=16`;
}

/**
 * @param {string} q 
 * @param {{
    faviconUrl: string;
    url: string;
    id: string;
    title: string;
    path: string;
}[]} bookmarks
*/
function filterBookmarks(bookmarks, q) {
  const qLowerCase = (q || '').toLowerCase();
  const words = qLowerCase
    .split(' ')
    .map((q) => q.trim())
    .filter((q) => q);

  let relevantBookmarks = bookmarks
    .filter((p) =>
      words.every((q) =>
        [p.path.toLowerCase(), p.title.toLowerCase()].some((s) => s.includes(q))
      )
    )
    .sort((a, b) =>
      [a, b]
        .map((p) =>
          (p.title.toLowerCase() + p.path.toLowerCase()).indexOf(words[0])
        )
        .reduce((a, b) => a - b)
    );
  if (relevantBookmarks.length === 0) {
    const chars = qLowerCase.split('');
    relevantBookmarks = bookmarks.filter((p) => {
      const set = new Set((p.path + p.title).toLowerCase().split(''));
      return chars.every((q) => set.has(q));
    });
  }
  return relevantBookmarks;
}

const findFirstBookmarkIdResponseCache = new Map();
/**
 * @param {string} q 
 * @param {{
    faviconUrl: string;
    url: string;
    id: string;
    title: string;
    path: string;
}[]} bookmarks
*/
function findFirstBookmarkId(bookmarks, q) {
  const cacheVal = findFirstBookmarkIdResponseCache.get(q);
  if (cacheVal) return cacheVal;

  const qLowerCase = (q || '').toLowerCase();
  const words = qLowerCase
    .split(' ')
    .map((q) => q.trim())
    .filter((q) => q);

  let relevantBookmark = bookmarks
    .filter((p) =>
      words.every((q) =>
        [p.path.toLowerCase(), p.title.toLowerCase()].some((s) => s.includes(q))
      )
    )
    .minBy((p) =>
      (p.title.toLowerCase() + p.path.toLowerCase()).indexOf(words[0])
    );
  if (!relevantBookmark) {
    const chars = qLowerCase.split('');
    relevantBookmark = bookmarks.find((p) => {
      const set = new Set((p.path + p.title).toLowerCase().split(''));
      return chars.every((q) => set.has(q));
    });
  }

  findFirstBookmarkIdResponseCache.set(q, relevantBookmark.id);
  return relevantBookmark.id;
}

/** @param {chrome.bookmarks.BookmarkTreeNode} mainNode */
/** @param {Record<string, chrome.bookmarks.BookmarkTreeNode>} nodeByIdMap */
function getTitlePath(mainNode, nodeByIdMap) {
  let node = mainNode;
  const title = mainNode.title;

  let path = '';
  while ((node = nodeByIdMap[node.parentId])) {
    path = `${node.title}/${path}`;
  }

  return { title, path };
}

let currentNodeOptions;
let currentNodeOptionsIndex = 0;
function goto() {
  const url = currentNodeOptions[currentNodeOptionsIndex].url;
  if (url.startsWith('javascript:')) {
    chrome.tabs.executeScript(null, { code: url.slice(11) });
    window.close();
  } else {
    chrome.tabs.create({ url });
  }
}

const refreshPopup = (search.oninput = () => {
  finishedHtmlLoad = loadResults(search.value);
});

function boldText(idx, bold) {
  const div = document.getElementById('div_' + idx);
  if (!div) return;
  boldTextForElement(div, bold);
}

function boldTextForElement(element, bold) {
  element.style.fontWeight = bold ? 'bolder' : 'normal';
  element.style.fontSize = bold ? 'large' : 'medium';
}

search.onkeydown = async (e) => {
  if (e.key === 'Enter') {
    await finishedHtmlLoad;
    goto();
  }
  if (e.key === 'ArrowDown') {
    boldText(currentNodeOptionsIndex, false);

    currentNodeOptionsIndex =
      (currentNodeOptionsIndex + 1) % currentNodeOptions.length;

    boldText(currentNodeOptionsIndex, true);
    e.preventDefault();
  }
  if (e.key === 'ArrowUp') {
    boldText(currentNodeOptionsIndex, false);

    currentNodeOptionsIndex =
      (currentNodeOptions.length + currentNodeOptionsIndex - 1) %
      currentNodeOptions.length;

    boldText(currentNodeOptionsIndex, true);
    e.preventDefault();
  }
};
