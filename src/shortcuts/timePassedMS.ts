let lastTime = performance.now();
export function timePassedMS() {
  const now = performance.now();
  const diff = lastTime - now;
  lastTime = now;
  return Math.abs(diff);
}
