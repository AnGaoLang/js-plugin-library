
type IfunNoReturn = (value:any) => void

type IfunWithReturn = (value:any) => any

type IfunNoParam = () => any

interface IMyPromise {
  (resolve: IfunNoReturn, reject: IfunNoReturn):void
};

class MyPromise {
  private aa= '';
  private value:string = '';
  private status:string = 'pending';
  private resolveValue:string = '';
  private rejectValue:string = '';
  //用数组是为了保证在异步时有多次promise.then的情况 
  private resolveArray:any[] = []; // 为什么这里不给初始化值，转为js该属性会被自动忽略，没有转为this.
  private rejectArray:any[] = [];

  constructor (fun:IMyPromise) {
    // this.value = '';
    // this.status = 'pending';
    // this.resolveValue = '';
    // this.rejectValue = '';

    this.InResolve = this.InResolve.bind(this);
    this.InReject = this.InReject.bind(this);
    this.then = this.then.bind(this);
    // this.catch = this.catch.bind(this);

    try {
      fun(this.InResolve, this.InReject); // 实例化promise时便直接运行传入的函数，此处报错则直接reject
    } catch(e) {
      this.InReject(e);
    }
  }

  /**
   * resolve实际上在初始化传入的函数内部调用，其this指向依据的是传入函数内部的上下文，
   * 所以这里需要将resolve方法的this指向导向当前MyPromise实例
   * @param value resolve后要传递的值
   */
  protected InResolve (value:any):void {
    if (this.status == 'pending') {
      this.status = 'resolved';
      this.resolveValue = value;
      // 异步完成resolve被调用时，遍历调用缓存的传入then的处理函数
      this.resolveArray.forEach((funItem) => funItem(this.resolveValue));
    }
  }

  /**
   * 
   * @param value reject后要传递的值
   */
  protected InReject (value:any):void {
    if (this.status == 'pending') {
      this.status = 'reject';
      this.rejectValue = value;
      // 异步完成reject被调用时，遍历调用缓存的传入then的处理函数
      this.rejectArray.forEach((funItem) => funItem(this.rejectValue));
    }
  }
 
  private resolvePromise (promise:MyPromise, thenReturn:any, resolve:IfunNoReturn, reject:IfunNoReturn):void {
    // 若传入的是当前的promise对象，reject抛出一个错误
    if(promise === thenReturn){
      return reject(new TypeError("禁止返回当前Promise实例，循环引用错误"));
    };
    let isUsed:boolean; //promise2是否已经resolve 或reject了
    // 当return的是一个对象或者函数
    if (thenReturn !== null && (typeof thenReturn === "object" || typeof thenReturn === "function")) {
      try{
        let then = thenReturn.then;
        // thenReturn是一个thenable对象或函数，只要有then方法的对象，
        // 当thenReturn上存在then且为函数时，则thenReturn为promise实例，否则只是普通的对象和函数
        if(typeof then === "function"){
          // 处理then方法返回promise的情况，调用thenReturn这个新promise的then方法
          then.call(thenReturn,(res:IfunWithReturn) => {
            //如果promise2已经成功或失败了，则不会再处理了
            if(isUsed)return;
            isUsed = true;
            this.resolvePromise(promise,res,resolve,reject);
          },function(err:IfunWithReturn){
            if(isUsed)return;
            isUsed = true;
            reject(err);
          })
        }else{
          //仅仅是一个函数或者是对象
          resolve(thenReturn);
        }
      }catch(e){
        if(isUsed)return;
        isUsed=true;
        reject(e);
      }
    }else{
        //返回基本类型，直接resolve
      resolve(thenReturn);
    }
  }

  // 在一次promise运行过程中，resolve和reject中只有一个会被触发，不可能在一次promise运行过程中同时触发resolve和reject
  public then (onResolved:IfunWithReturn, onReject?:IfunWithReturn): any {
    // 当then方法没传递onResolved时，给一个默认函数，将promise内部的值传递给下一个then
    onResolved = typeof onResolved === 'function' ? onResolved : (res) => res;
    // 没传递onReject时,将错误抛出，走下一个then的onReject
    onReject = typeof onReject === 'function' ? onReject : (err) => {throw err};

    let promise:MyPromise;
    switch(this.status){
      case 'pending': // 异步时，将传入的处理方法推入缓存数组，以待异步完成时，遍历调用
        promise = new MyPromise((resolve:IfunNoReturn, reject:IfunNoReturn) => {
          // resolve
          this.resolveArray.push(() => {
            setTimeout(() => {
              try {
                let resolveReturn:IfunWithReturn = onResolved(this.resolveValue); // promise内部的值会被传递进resolve并被执行
                this.resolvePromise(promise,resolveReturn,resolve,reject);
              } catch(e) {
                reject(e);
              }
            })
          });
          // reject
          this.rejectArray.push(() => {
            setTimeout(() => {
              try {
                let rejectReturn:IfunWithReturn = onReject(this.rejectValue);
                this.resolvePromise(promise,rejectReturn,resolve,reject);
              } catch (e) {
                reject(e);
              };
            });
          });
        });
      break;
      case 'resolved': // 正常的同步调用
        promise = new MyPromise((resolve:IfunNoReturn, reject:IfunNoReturn) => {
          setTimeout(() => {
            try {
              let resolveReturn:IfunWithReturn = onResolved(this.resolveValue);
              this.resolvePromise(promise,resolveReturn,resolve,reject);
            } catch(e) {
              reject(e)
            }
          })
        });
      break;
      case 'reject': // 正常的同步调用
        // 返回一个新的promise，上一个then的两个处理函数返回值若正常都走resolve，错误才走reject
        // 把setTimeout放在promise外面，将无法正常返回promise，因为setTimeout异步，return promise已经调用完毕。
        
          promise = new MyPromise((resolve:IfunNoReturn, reject:IfunNoReturn) => {
            setTimeout(() => {
              try {
                let rejectReturn:IfunWithReturn =  onReject(this.rejectValue);
                this.resolvePromise(promise,rejectReturn,resolve,reject);
              } catch(e) {
                reject(e)
              };
            })
          });
      break;
    };
    return promise;
  }

  // catch方法
  public catch (onReject?:IfunWithReturn) {
    return this.then(null, onReject)
  }

  // finally方法
  public finally (callback:IfunNoParam) {
    return this.then(
      // 执行callback()并将value作为最后的then传递/抛出以 reason 为理由的错误
      value  => MyPromise.resolve(callback()).then(() => value),
      reason => MyPromise.resolve(callback()).then(() => { throw reason })
    )
  }

  // MyPromise类上的all的静态方法，
  // 传入一个数组，数组成员全resolve，all才resolve一个数组，若有一个reject，则reject
  public static all (promises:any) {
    let array:any[] = [];
    let count:number = 0;
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        if (!(promises[i] instanceof MyPromise)) {
          promises[i] = MyPromise.resolve(promises[i]);
        };
        promises[i].then((res:any) => {
          array[i] = res;
          if (++count == promises.length) {
            resolve(array);
          }
        }, (err:any) => {
          // 若数组内某一个promise错误，则直接reject
          reject(err)
        });
      }
    })
  }

  // MyPromise类上的race的静态方法,传入一个数组，那个成员先resolve/reject，则resolve/reject
  public static race (promises:any) {
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        if (!(promises[i] instanceof MyPromise)) {
          promises[i] = MyPromise.resolve(promises[i]);
        };
        promises[i].then((res:any) => {
            resolve(res);
        }, (err:any) => {
          reject(err);
        });
      }
    })
  }

  // MyPromise类上的resolve的静态方法
  public static resolve (param?:any) {
    return new MyPromise((resolve, reject) => {
      resolve(param)
    })
  }

  // MyPromise类上的reject的静态方法
  public static reject (param?:any) {
    return new MyPromise((resolve, reject) => {
      reject(param)
    })
  }

  // 执行测试用例需要用到的代码,必须是定义在类上的静态方法
  public static deferred () {
    let defer:any = {};
    defer.promise = new MyPromise((resolve, reject) => {
        defer.resolve = resolve;
        defer.reject = reject;
    });
    return defer;
  }
};

export default MyPromise;
// module.exports = MyPromise;

// module.exports = MyPromise;
// new Promise以及then是同步的，实例化promise时传入的异步方法则会延迟调用。
// 当then方法本身以及传入then方法的函数已经同步执行完成时，resolve/reject被延迟执行，
// 因为resolve/reject被延迟执行，promise状态仍是pending，未被改变，then方法在常规实现方法下也无法获取异步方法内resolve传递的值。
// 所以当promise同步执行且状态仍为pending时，将传入then方法的处理函数外层再包裹一个匿名函数，并推入一个缓存数组(队列)，以待遍历调用。(实际上then已同步调用完)
// 当传入promise的异步方法调用完成时，resolve被调用，则从数组中取出缓存的传入then的方法(传入resolve的值是promise的实例属性)，遍历调用。
// 以此实现promise的异步处理功能
// new MyPromise((resolve:IfunNoReturn, reject:IfunNoReturn) => {
//   setTimeout(() => reject('异步1234'), 1000)
// }).then(function (res) {console.log(res)}, undefined).then(undefined, function (err) {
//   console.log(err)
// });