// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const MAX_BOOKMARKS = 300;
let search = document.getElementById('search');
const root = document.getElementById('root');
let finishedHtmlLoad = Promise.resolve();

// chrome.storage.sync.get('color', function (data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute('value', data.color);
// });

/** @type {() => Promise<chrome.bookmarks.BookmarkTreeNode[]>} */
const getTree = () => new Promise((r) => chrome.bookmarks.getTree(r));

setTimeout(loadResults, 1);
search.focus();

/**
 * @param {string[]} chars
 * @param {number} length
 */
function allCombinations(chars, length) {
  let ret = [...chars];
  for (let i = 0; i < length - 1; i++) {
    ret = [...new Set(ret)]
      .map((s) => {
        return [...chars].map((ch) => s + ch);
      })
      .flat()
      .sort(
        (s1, s2) =>
          util.keyboardDistance(...s1.slice(-2)) -
          util.keyboardDistance(...s2.slice(-2))
      );
  }
  return ret;
}

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
              <span class="bookmarkTitle" title="${title}">${title}</span>
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

  loadShortcuts(all, bookmarks);
}

let iteration = 1;
async function loadShortcuts(all, bookmarks) {
  const currIteration = ++iteration;
  for (let idx = 0; idx < bookmarks.length; idx++) {
    if (idx % 3 === 0) {
      await new Promise((r) => setTimeout(r));
      if (iteration !== currIteration) {
        return;
      }
    }
    const bookmark = bookmarks[idx];
    const allChars = (bookmark.title + bookmark.path).toLowerCase().split('');
    let shortcutLength = 0;
    let foundShortcut = false;
    while (++shortcutLength <= 3 && !foundShortcut) {
      const partials = allCombinations(allChars, shortcutLength);
      for (let i = 0; i < partials.length && !foundShortcut; i++) {
        const shortcut = partials[i];
        const matched = filterBookmarks(all, shortcut)[0].id === bookmark.id;
        if (matched) {
          const span = document.getElementById(`shortcut_${idx}`);
          if (!span) return;
          span.innerText = shortcut;
          span.title = `Search '${shortcut}' to get this bookmark as the first result`;
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

  const bookmarks = all
    .filter((p) => p.url)
    .map((p) => ({
      ...getTitlePath(p, all),
      faviconUrl: `chrome://favicon/${p.url.split('?')[0]}`,
      url: p.url,
      id: p.id
    }));

  return bookmarks;
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
  const words = (q || '')
    .toLowerCase()
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
    const chars = (q || '').toLowerCase().split('');
    relevantBookmarks = bookmarks.filter((p) => {
      const set = new Set((p.path + p.title).toLowerCase().split(''));
      return chars.every((q) => set.has(q));
    });
  }
  return relevantBookmarks;
}

/** @param {chrome.bookmarks.BookmarkTreeNode} mainNode */
function getTitlePath(mainNode, allNodes) {
  let node = mainNode;
  const title = mainNode.title;

  let path = '';
  node = allNodes.find((p) => p.id === node.parentId);
  while (node) {
    path += `${node.title}/`;
    node = allNodes.find((p) => p.id === node.parentId);
  }

  return { title, path };
}

let currentNodeOptions;
let currentNodeOptionsIndex = 0;
function goto() {
  chrome.tabs.create({
    url: currentNodeOptions[currentNodeOptionsIndex].url
  });
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
