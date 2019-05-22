
type func = (...param:any) => any

/**
 * 
 * @param fun 传入被包装的函数
 */
function thunkify (fun:func):func {
  return function () {
    // let args = Array.prototype.slice.call(arguments);
    let that = this;
    let args = [...arguments];

    return (callback:func) => {
      let called: boolean;

      args.push(function () {
        if (called) return;
        called = true;
        callback.apply(null, arguments)
      });

      try {
        fun.apply(that, args)
      } catch(e) {
        callback(e)
      }
    }
  }
}

module.exports = thunkify;
