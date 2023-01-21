import { keyboardDistance } from './keyboardDistance';

export function getAllCharCombinations(chars: string[], length: number) {
  let combinations = chars;
  for (let i = 0; i < length - 1; i++) {
    combinations = combinations
      .map((s) => chars.map((ch) => s + ch))
      .flat()
      .sort(
        (s1, s2) =>
          keyboardDistance(...s1.slice(-2)) - keyboardDistance(...s2.slice(-2))
      );
  }

  return combinations;
}
