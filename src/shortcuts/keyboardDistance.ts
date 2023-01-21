import { keyNodes } from './keyNodes';

const MAX_KEYBOARD_KEYS_DISTANCE = 100;
const keyboardDistanceMap: Record<string, number> = {};

export function keyboardDistance(...chars: string[]) {
  const [ch1, ch2] = chars;

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

function distance(p1: [number, number], p2: [number, number]) {
  const [[y1, x1], [y2, x2]] = [p1, p2];
  return Math.sqrt((y1 - y2) ** 2 + (x1 - x2) ** 2);
}
