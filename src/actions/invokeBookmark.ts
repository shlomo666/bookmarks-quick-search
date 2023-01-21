export function invokeBookmark(url: string = '') {
  // eslint-disable-next-line no-script-url
  if (url.startsWith('javascript:')) {
    chrome.tabs.executeScript({ code: url.slice(11) });
    window.close();
  } else {
    chrome.tabs.create({ url });
  }
}
