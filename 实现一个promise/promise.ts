
type IfunNoReturn = (value:any) => void

type IfunWithReturn = (value:any) => any

interface IMyPromise {
  (resolve: IfunNoReturn, reject: IfunNoReturn):void
};

class MyPromise {
  private value:symbol = Symbol.for('value');
  private status:symbol = Symbol.for('status');
  private resolveValue:symbol = Symbol.for('resolveValue');
  private rejectedValue:symbol = Symbol.for('rejectValue');
  public resolveArray:any[] = []; // 为什么这里不给初始化值，转为js该属性会被自动忽略，没有转为this.
  public rejectedArray:any[] = [];

  constructor (fun:IMyPromise) {
    this[this.value] = '';
    this[this.status] = 'pending';
    this[this.resolveValue] = '';
    this[this.rejectedValue] = '';

    this.resolve = this.resolve.bind(this);
    this.rejected = this.rejected.bind(this);
    this.then = this.then.bind(this);

    try {
      fun(this.resolve, this.rejected); // 实例化promise时便直接运行传入的函数，此处报错则直接reject
    } catch(e) {
      this.rejected(e);
    }
  }

  /**
   * resolve实际上在初始化传入的函数内部调用，其this指向依据的是传入函数内部的上下文，
   * 所以这里需要将resolve方法的this指向导向当前MyPromise实例
   * @param value resolve后要传递的值
   */
  protected resolve (value:any):void {
    if (this[this.status] == 'pending') {
      this[this.status] = 'resolved';
      this[this.resolveValue] = value;
      // 异步完成resolve被调用时，遍历调用缓存的传入then的处理函数
      this.resolveArray.forEach((funItem) => funItem(this[this.resolveValue]));
    }
  }

  /**
   * 
   * @param value reject后要传递的值
   */
  protected rejected (value:any):void {
    if (this[this.status] == 'pending') {
      this[this.status] = 'rejected';
      this[this.rejectedValue] = value;
      // 异步完成rejected被调用时，遍历调用缓存的传入then的处理函数
      this.rejectedArray.forEach((funItem) => funItem(this[this.rejectedValue]));
    }
  }
 
  // 在一次promise运行过程中，resolve和reject中只有一个会被触发，不可能在一次promise运行过程中同时触发resolve和reject
  public then (onResolved:IfunWithReturn, onRejected?:IfunWithReturn): any {
    switch(this[this.status]){
      case 'pending': // 异步时，将传入的处理方法推入缓存数组，以待异步完成时，遍历调用
        this.resolveArray.push(() => onResolved(this[this.resolveValue]));
        this.rejectedArray.push(() => onRejected(this[this.rejectedValue]));
      break;
      case 'resolved': // 正常的同步调用
        onResolved(this[this.resolveValue]);
      break;
      case 'rejected': // 正常的同步调用
        onRejected(this[this.rejectedValue]);
      break;
    }
  }
};

// new Promise以及then是同步的，实例化promise时传入的异步方法则会延迟调用。
// 当then方法本身以及传入then方法的函数已经同步执行完成时，resolve/rejected被延迟执行，
// 因为resolve/rejected被延迟执行，promise状态仍是pending，未被改变，then方法在常规实现方法下也无法获取异步方法内resolve传递的值。
// 所以当promise同步执行且状态仍为pending时，将传入then方法的处理函数外层再包裹一个匿名函数，并推入一个缓存数组，以待遍历调用。(实际上then已同步调用完)
// 当传入promise的异步方法调用完成时，resolve被调用，则从数组中取出缓存的传入then的方法(传入resolve的值是promise的实例属性)，遍历调用。0
// 以此实现promise的异步处理功能
new MyPromise((resolve:IfunNoReturn, reject:IfunNoReturn) => {
  setTimeout(() => resolve('异步1234'), 5000)
}).then((res) => {console.log('同步1234');console.log(res)});
