;
var MyPromise = /** @class */ (function () {
    function MyPromise(fun) {
        this.value = Symbol["for"]('value');
        this.status = Symbol["for"]('status');
        this.resolveValue = Symbol["for"]('resolveValue');
        this.rejectValue = Symbol["for"]('rejectValue');
        //用数组是为了保证在异步时有多次promise.then的情况 
        this.resolveArray = []; // 为什么这里不给初始化值，转为js该属性会被自动忽略，没有转为this.
        this.rejectArray = [];
        this[this.value] = '';
        this[this.status] = 'pending';
        this[this.resolveValue] = '';
        this[this.rejectValue] = '';
        this.resolve = this.resolve.bind(this);
        this.reject = this.reject.bind(this);
        // this.then = this.then.bind(this);
        // this.catch = this.catch.bind(this);
        try {
            fun(this.resolve, this.reject); // 实例化promise时便直接运行传入的函数，此处报错则直接reject
        }
        catch (e) {
            this.reject(e);
        }
    }
    /**
     * resolve实际上在初始化传入的函数内部调用，其this指向依据的是传入函数内部的上下文，
     * 所以这里需要将resolve方法的this指向导向当前MyPromise实例
     * @param value resolve后要传递的值
     */
    MyPromise.prototype.resolve = function (value) {
        var _this = this;
        if (this[this.status] == 'pending') {
            this[this.status] = 'resolved';
            this[this.resolveValue] = value;
            // 异步完成resolve被调用时，遍历调用缓存的传入then的处理函数
            this.resolveArray.forEach(function (funItem) { return funItem(_this[_this.resolveValue]); });
        }
    };
    /**
     *
     * @param value reject后要传递的值
     */
    MyPromise.prototype.reject = function (value) {
        var _this = this;
        if (this[this.status] == 'pending') {
            this[this.status] = 'reject';
            this[this.rejectValue] = value;
            // 异步完成reject被调用时，遍历调用缓存的传入then的处理函数
            this.rejectArray.forEach(function (funItem) { return funItem(_this[_this.rejectValue]); });
        }
    };
    MyPromise.prototype.resolvePromise = function (promise, thenReturn, resolve, reject) {
        var _this = this;
        // 若传入的是当前的promise对象，reject抛出一个错误
        if (promise === thenReturn) {
            return reject(new TypeError("禁止返回当前Promise实例，循环引用错误"));
        }
        ;
        var isUsed; // 表示是否调用过成功或者失败
        // 当return的是一个对象或者函数
        if (thenReturn !== null && (typeof thenReturn === "object" || typeof thenReturn === "function")) {
            try {
                var then = thenReturn.then;
                // 当thenReturn上存在then且为函数时，则thenReturn为promise实例，否则只是普通的对象和函数
                if (typeof then === "function") {
                    // 处理then方法返回promise的情况，调用thenReturn这个新promise的then方法
                    then.call(thenReturn, function (res) {
                        if (isUsed)
                            return;
                        isUsed = true;
                        _this.resolvePromise(promise, res, resolve, reject);
                    }, function (err) {
                        if (isUsed)
                            return;
                        isUsed = true;
                        reject(err);
                    });
                }
                else {
                    //仅仅是一个函数或者是对象
                    resolve(thenReturn);
                }
            }
            catch (e) {
                if (isUsed)
                    return;
                isUsed = true;
                reject(e);
            }
        }
        else {
            //返回基本类型，直接resolve
            resolve(thenReturn);
        }
    };
    // 在一次promise运行过程中，resolve和reject中只有一个会被触发，不可能在一次promise运行过程中同时触发resolve和reject
    MyPromise.prototype.then = function (onResolved, onReject) {
        var _this = this;
        // 当then方法没传递onResolved时，给一个默认函数，将promise内部的值传递给下一个then
        onResolved = typeof onResolved === 'function' ? onResolved : function (res) { return res; };
        // 没传递onReject时,将错误抛出，走下一个then的onReject
        onReject = typeof onReject === 'function' ? onReject : function (err) { throw err; };
        var promise;
        switch (this[this.status]) {
            case 'pending': // 异步时，将传入的处理方法推入缓存数组，以待异步完成时，遍历调用
                promise = new MyPromise(function (resolve, reject) {
                    // resolve
                    _this.resolveArray.push(function () {
                        setTimeout(function () {
                            try {
                                var resolveReturn = onResolved(_this[_this.resolveValue]); // promise内部的值会被传递进resolve并被执行
                                _this.resolvePromise(promise, resolveReturn, resolve, reject);
                            }
                            catch (e) {
                                reject(e);
                            }
                        });
                    });
                    // reject
                    _this.rejectArray.push(function () {
                        setTimeout(function () {
                            try {
                                var rejectReturn = onReject(_this[_this.rejectValue]);
                                _this.resolvePromise(promise, rejectReturn, resolve, reject);
                            }
                            catch (e) {
                                reject(e);
                            }
                            ;
                        });
                    });
                });
                // this.resolveArray.push(() => onResolved(this[this.resolveValue]));
                // this.rejectArray.push(() => onReject(this[this.rejectValue]));
                break;
            case 'resolved': // 正常的同步调用
                promise = new MyPromise(function (resolve, reject) {
                    setTimeout(function () {
                        try {
                            var resolveReturn = onResolved(_this[_this.resolveValue]);
                            _this.resolvePromise(promise, resolveReturn, resolve, reject);
                        }
                        catch (e) {
                            reject(e);
                        }
                    });
                });
                break;
            case 'reject': // 正常的同步调用
                // 返回一个新的promise，上一个then的两个处理函数返回值若正常都走resolve，错误才走reject
                setTimeout(function () {
                    promise = new MyPromise(function (resolve, reject) {
                        try {
                            var rejectReturn = onReject(_this[_this.rejectValue]);
                            _this.resolvePromise(promise, rejectReturn, resolve, reject);
                        }
                        catch (e) {
                            reject(e);
                        }
                        ;
                    });
                });
                break;
        }
        ;
        return promise;
    };
    MyPromise.prototype["catch"] = function (onReject) {
        return this.then(null, onReject);
    };
    // 执行测试用例需要用到的代码,必须是定义在类上的静态方法
    MyPromise.deferred = function () {
        var defer = {};
        defer.promise = new MyPromise(function (resolve, reject) {
            defer.resolve = resolve;
            defer.reject = reject;
        });
        return defer;
    };
    return MyPromise;
}());
;
module.exports = MyPromise;
// new Promise以及then是同步的，实例化promise时传入的异步方法则会延迟调用。
// 当then方法本身以及传入then方法的函数已经同步执行完成时，resolve/reject被延迟执行，
// 因为resolve/reject被延迟执行，promise状态仍是pending，未被改变，then方法在常规实现方法下也无法获取异步方法内resolve传递的值。
// 所以当promise同步执行且状态仍为pending时，将传入then方法的处理函数外层再包裹一个匿名函数，并推入一个缓存数组(队列)，以待遍历调用。(实际上then已同步调用完)
// 当传入promise的异步方法调用完成时，resolve被调用，则从数组中取出缓存的传入then的方法(传入resolve的值是promise的实例属性)，遍历调用。
// 以此实现promise的异步处理功能
// new MyPromise((resolve:IfunNoReturn, reject:IfunNoReturn) => {
//   setTimeout(() => resolve('异步1234'), 1000)
// }).then((res) => {console.log('同步1234');console.log(res);return {a: 123}});
