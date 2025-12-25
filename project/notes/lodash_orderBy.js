var users = [
  { user: 'fred', age: 48 },
  { user: 'barney', age: 34 },
  { user: 'fred', age: 40 },
  { user: 'barney', age: 36 },
];

// 以 `user` 升序排序 再  `age` 以降序排序。
orderBy(users, ['user', 'age'], ['asc', 'desc']); // [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]

// sort函数 compareFn(a, b)返回值 > 0，a 在 b 后，如 [b, a]

function orderBy(array, keyList, orderList) {
  let result = [...array];
  result.sort((a, b) => {
    for (let i = 0; i < keyList.length; i++) {
      const key = keyList[i];
      const order = orderList[i];
      const valueA = a[key];
      const valueB = b[key];
      // 比较
      if (valueA > valueB) {
        return order === 'asc' ? 1 : -1;
      }
      if (valueA < valueB) {
        return order === 'asc' ? -1 : 1;
      }
      // 相等则进行下一个key值的比较
    }
    // 所有属性都相等则不改变顺序
    return 0;
  });
  result = result.map((item) => keyList.map((key) => item[key]));
  return result;
}
