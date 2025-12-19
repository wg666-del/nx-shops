function flatten1(array) {
  if (!array.length) return [];
  return array.reduce((prev, cur) => {
    return Array.isArray(cur) ? [...prev, ...flatten1(cur)] : [...prev, cur];
  }, []);
}

function flatten2(array) {
  if (!array.length) return [];
  while (array.some((item) => Array.isArray(item))) {
    array = [].concat(...array);
  }
  return array;
}

function flatten3(array, depth) {
  if (!array.length) return [];
  let arrayCopy = JSON.parse(JSON.stringify(array)),
    maxDepth = 0;
  while (arrayCopy.some((item) => Array.isArray(item))) {
    maxDepth++;
    arrayCopy = [].concat(...arrayCopy);
  }
  while (array.some((item) => Array.isArray(item)) && maxDepth > depth) {
    maxDepth--;
    array = [].concat(...array);
  }
  return array;
}

export { flatten1, flatten2, flatten3 };
