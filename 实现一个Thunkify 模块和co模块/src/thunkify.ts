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

// function file (a:any,b:any,callback:any) {
//   console.log(a)
//   console.log(b)
//   setTimeout(() => {
//     callback()
//   }, 2000)
// }
// const toThunk = thunkify(file);

// const toThunk1 = toThunk('a','b');

// toThunk1((aa:any) => {console.log(`"aa"${aa}`)})

module.exports = thunkify;

// export default thunkify;
