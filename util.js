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

  return { distance, keyboardDistance };
})();
