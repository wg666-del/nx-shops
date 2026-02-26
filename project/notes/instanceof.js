function myInstanceof(instance, constructor) {
  const prototype = constructor.prototype;
  let proto = Object.getPrototypeOf(instance);
  while (proto) {
    if (prototype === proto) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

export default myInstanceof;
