function curry(fn) {
    return function curried(...args) {
        if (args.length === fn.length) {
            return fn.apply(this, args)
        } else {
            return function(...newArgs) {
                return curried(...args, ...newArgs)
            }
        }
    }
}

function sum(a, b, c) {
    return a + b + c
}

const curriedSum = curry(sum)
curriedSum(1, 2, 3) // 6
curriedSum(1)(2, 3) // 6
curriedSum(1, 2)(3) // 6
curriedSum(1)(2)(3) // 6

export default curry

function validate(regExp, content) {
    return regExp.test(content)
}
// 验证手机号 普通调用比较复杂
// validate(/^1[3-9]\d{9}$/, 手机号码1)
// validate(/^1[3-9]\d{9}$/, 手机号码2)
// validate(/^1[3-9]\d{9}$/, 手机号码3)

// 用柯里化方式调用 调用比较简单
// const validatePhone = curry(validate)
// validatePhone(手机号码1)
// validatePhone(手机号码2)
// validatePhone(手机号码3)

// 总结：降低函数的通用性，提高函数的适用性，使函数的调用更加灵活