groupBy([6.1, 4.2, 6.3], Math.floor); // { '4': [4.2], '6': [6.1, 6.3] }
groupBy(['one', 'two', 'three'], 'length'); // { '3': ['one', 'two'], '5': ['three'] }

function groupBy(array, iteratee) {
  const result = {};
  for (const item of array) {
    const key =
      typeof iteratee === 'function' ? iteratee(item) : item[iteratee];
    if (result[key]) {
      result[key].push(item);
    } else {
      result[key] = [item];
    }
  }
  return result;
}
