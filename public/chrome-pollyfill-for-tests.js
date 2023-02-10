var IS_TEST = false;

// eslint-disable-next-line no-use-before-define
if (!chrome.bookmarks) {
  // eslint-disable-next-line no-unused-vars
  IS_TEST = true;

  var chrome = {
    bookmarks: {
      getTree: async function () {
        return getBookmarks();
      },
    },
  };

  const getBookmarks = () => {
    return [];
  };
}
