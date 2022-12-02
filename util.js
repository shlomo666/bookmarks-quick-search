const util = (() => {
  const MAX_KEYBOARD_KEYS_DISTANCE = 100;

  const keyboardDistanceMap = {};
  function keyboardDistance(ch1, ch2) {
    if (ch1 === ch2) return 0;
    const val = keyboardDistanceMap[ch1 + ch2];
    if (val) {
      return val;
    }

    const p1 = keyNodes[ch1];
    const p2 = keyNodes[ch2];
    if (!p1 || !p2) return MAX_KEYBOARD_KEYS_DISTANCE;

    const retVal = distance(p1, p2);
    keyboardDistanceMap[ch1 + ch2] = keyboardDistanceMap[ch2 + ch1] = retVal;
    return retVal;
  }

  function distance(p1, p2) {
    const [[y1, x1], [y2, x2]] = [p1, p2];
    return Math.sqrt((y1 - y2) ** 2 + (x1 - x2) ** 2);
  }

  /**
   * @param {string[]} chars
   * @param {number} length
   */
  function allCombinations(chars, length) {
    let combinations = chars;
    for (let i = 0; i < length - 1; i++) {
      combinations = combinations
        .map((s) => chars.map((ch) => s + ch))
        .flat()
        .sort(
          (s1, s2) =>
            keyboardDistance(...s1.slice(-2)) -
            keyboardDistance(...s2.slice(-2))
        );
    }

    return combinations;
  }

  let lastTime = performance.now();
  function timePassedMS() {
    const now = performance.now();
    const diff = lastTime - now;
    lastTime = now;
    return Math.abs(diff);
  }

  return { keyboardDistance, allCombinations, timePassed: timePassedMS };
})();

Array.prototype.minBy = function (fn) {
  let minVal, minScore;
  this.forEach((v, i, arr) => {
    const score = fn(v, i, arr);
    if (i === 0 || score < minScore) {
      minScore = score;
      minVal = v;
    }
  });
  return minVal;
};

Array.prototype.keyBy = function (fn) {
  const ret = {};
  this.forEach((v, i, arr) => {
    ret[fn(v, i, arr)] = v;
  });
  return ret;
};
