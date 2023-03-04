var IS_TEST = false;

// eslint-disable-next-line no-use-before-define
if (!chrome.bookmarks) {
  // eslint-disable-next-line no-unused-vars
  IS_TEST = true;

  var chrome = {
    bookmarks: {
      getTree: async () => {
        return getBookmarks();
      },
    },
    tabs: {
      create: (options) => {
        console.log('create tab', options);
      },
    },
  };

  const getBookmarks = () => {
    return [];
  };
}
