export function invokeBookmark(url: string = '') {
  // eslint-disable-next-line no-script-url
  if (!url.startsWith('javascript:')) {
    chrome.tabs.create({ url });
  }
}
