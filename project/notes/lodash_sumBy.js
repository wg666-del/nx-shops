const products = [
  { name: '手机', price: 3999, quantity: 2 },
  { name: '耳机', price: 799, quantity: 5 },
  { name: '充电线', price: 59, quantity: 10 },
];

sumBy(products, (item) => item.price * item.quantity); // 3999 * 2 + 799 * 5 + 59 * 10 = 12583

function sumBy(array, iteratee) {
  let sum = 0;
  for (const item of array) {
    sum += iteratee(item);
  }
  return sum;
}
