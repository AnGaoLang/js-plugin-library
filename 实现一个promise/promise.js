;
var MyPromise = /** @class */ (function () {
    function MyPromise(fun) {
        this.value = Symbol["for"]('value');
        this.status = Symbol["for"]('status');
        this.resolveValue = Symbol["for"]('resolveValue');
        this.rejectValue = Symbol["for"]('rejectValue');
        this[this.value] = '';
        this[this.status] = 'pending';
        this[this.resolveValue] = '';
        this[this.rejectValue] = '';
        this.resolve = this.resolve.bind(this);
        this.reject = this.reject.bind(this);
        this.then = this.then.bind(this);
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
        if (this[this.status] == 'pending') {
            this[this.status] = 'resolved';
            this[this.resolveValue] = value;
        }
    };
    /**
     *
     * @param value reject后要传递的值
     */
    MyPromise.prototype.reject = function (value) {
        if (this[this.status] == 'pending') {
            this[this.status] = 'rejected';
            this[this.rejectValue] = value;
        }
    };
    MyPromise.prototype.then = function (onResolved, onRejected) {
        switch (this[this.status]) {
            case 'resolved':
                onResolved(this[this.resolveValue]);
                break;
            case 'rejected':
                onRejected(this[this.rejectValue]);
                break;
        }
    };
    return MyPromise;
}());
;
new MyPromise(function (resolve, reject) {
    reject('456')
    if (2 > 1) {
        resolve('123');
    }
    reject('456')
}).then(function (res) { console.log(res); }, (err) => {console.log(err)});
