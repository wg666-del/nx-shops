const isObject = (obj) => typeof obj === 'object' && obj !== null;

const deepClone = (obj) => {
  const clone = {};
  for (let key in obj) {
    const value = obj[key];
    if (Array.isArray(value)) {
      clone[key] = value.map(item =>
        isObject(item) ? deepClone(item) : item
      );
    } else if (isObject(value)) {
      clone[key] = deepClone(value);
    } else {
      clone[key] = value;
    }
  }
  return clone;
};

export default deepClone;
