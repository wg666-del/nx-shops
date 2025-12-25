const users = [
  { user: 'bar', active: true },
  { user: 'foo', active: true },
  { user: 'js', active: false },
];

countBy(users, (user) => user.active); // { true: 2, false: 1 }
countBy([6.1, 4.2, 6.3], Math.floor); // { '4': 1, '6': 2 }
countBy(['one', 'two', 'three'], 'length'); // { '3': 2, '5': 1 }

function countBy(array, iteratee) {
  const result = {};
  for (const item of array) {
    const key =
      typeof iteratee === 'function' ? iteratee(item) : item[iteratee];
    if (result[key]) {
      result[key]++;
    } else {
      result[key] = 1;
    }
  }
  return result;
}
