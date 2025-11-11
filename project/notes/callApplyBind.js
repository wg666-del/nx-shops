Function.prototype.myCall = function (context, ...args) {
  context = context || window;
  const fn = Symbol();
  context[fn] = this;
  context[fn](...args);
};

Function.prototype.myApply = function (context, args) {
  context = context || window;
  const fn = Symbol();
  context[fn] = this;
  context[fn](...args);
};

// bind的实现要稍微复杂一点
Function.prototype.myBind = function (context, ...args) {
  context = context || window;
  const self = this;
  // 返回一个新的函数
  return function F(...newArgs) {
    // 判断是否通过new操作符调用
    if (this instanceof F) {
      // 通过new操作符调用则忽略绑定的this
      return new self(...args, ...newArgs);
    } else {
      return self.apply(context, args.concat(newArgs));
    }
  };
};
