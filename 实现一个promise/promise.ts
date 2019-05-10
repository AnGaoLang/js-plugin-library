
type IfunNoReturn = (value:any) => void

type IfunWithReturn = (value:any) => any

interface IMyPromise {
  (resolve: IfunNoReturn, reject: IfunNoReturn):void
};

class MyPromise {
  private value:symbol = Symbol.for('value');
  private status:symbol = Symbol.for('status');
  private resolveValue:symbol = Symbol.for('resolveValue');
  private rejectValue:symbol = Symbol.for('rejectValue');

  constructor (fun:IMyPromise) {
    this[this.value] = '';
    this[this.status] = 'pending';
    this[this.resolveValue] = '';
    this[this.rejectValue] = '';

    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
    this.then = this.then.bind(this);

    try {
      fun(this.resolve, this.reject); // 实例化promise时便直接运行传入的函数，此处报错则直接reject
    } catch(e) {
      this.reject(e);
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
    }
  }

  /**
   * 
   * @param value reject后要传递的值
   */
  protected reject (value:any):void {
    if (this[this.status] == 'pending') {
      this[this.status] = 'rejected';
      this[this.rejectValue] = value;
    }
  }
 
  // 在一次promise运行过程中，resolve和reject中只有一个会被触发，不可能在一次promise运行过程中同时触发resolve和reject
  public then (onResolved:IfunWithReturn, onRejected?:IfunWithReturn): any {
    switch(this[this.status]){
      case 'resolved':
        onResolved(this[this.resolveValue]);
      break;
      case 'rejected':
        onRejected(this[this.rejectValue]);
      break;
    }
  }
};

new MyPromise((resolve:IfunNoReturn, reject:IfunNoReturn) => {
  if (2 > 1) {
    resolve('123')
  }
}).then((res) => {console.log(res)});
