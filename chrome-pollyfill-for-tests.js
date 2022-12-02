IS_TEST = false;

if (!chrome.bookmarks) {
  IS_TEST = true;

  var chrome = {
    bookmarks: {
      getTree: function (callback) {
        return callback(getBookmarks());
      },
    },
  };

  const getBookmarks = () => {
    return [];
  };
}
