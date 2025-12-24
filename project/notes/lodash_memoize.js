// 缓存API请求
const fetchUserData = async (userId) => {
  console.log(`Fetching user ${userId}...`);
  const response = await fetch(`https://api.example.com/users/${userId}`);
  return response.json();
};

// 记忆化异步函数
const memoizedFetch = _.memoize(fetchUserData);

// 使用示例
async function getUser(id) {
  return await memoizedFetch(id);
}

// 第一次请求用户1
getUser(1); // 发送请求
// 稍后再次请求用户1（可能是其他组件）
getUser(1); // 直接返回缓存，不发送请求

function memoize(func) {
  const memoized = function (...args) {
    const key = JSON.stringify(args);
    if (memoized.cache.has(key)) {
      return memoized.cache.get(key);
    }
    const result = func.apply(this, args);
    memoized.cache.set(key, result);
    return result;
  };
  memoized.cache = new Map();
  return memoized;
}

