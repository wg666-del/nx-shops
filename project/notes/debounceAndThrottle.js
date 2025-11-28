function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) return clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 立即执行版本
function debounceImmediate(fn, delay, immediate = false) {
  let timer = null;
  return function (...args) {
    const callNow = immediate && !timer;
    if (callNow) fn.apply(this, args);
    if (timer) return clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

function throttle(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, args);
    }, delay);
  };
}

// 立即执行版本
function throttleImmediate(fn, delay) {
  let previous = 0;
  return function (...args) {
    const now = performance.now();
    if (now - previous >= delay) {
      previous = now;
      fn.apply(this, args);
    }
  };
}

export { debounce, debounceImmediate, throttle, throttleImmediate };
