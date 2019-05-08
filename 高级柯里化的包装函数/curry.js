/**
 * 
 * @param {*function} fn - 传入一个被包装的函数
 */
function currying(fn) {
  return function curried(...args) {
      // 传入的实参长度 >= 初始函数形参长度 的时候，则直接执行初始函数
      if(args.length>=fn.length) {  
          return fn.apply(this, args); // 这里的this指向window
      } else {
          // 否则 得到一个 偏函数，递归carried方法，直到获得所有参数后，再执行原函数
          return function(...args2) {
              return curried.apply(this, args.concat(args2)); // 这里的this指向window, 
          }
      }
  }
};