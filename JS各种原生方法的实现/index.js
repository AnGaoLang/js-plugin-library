// call, apply, bind 实现
Function.prototype.myCall = function(object) {
  const context = object || window;
  const fun = Symbol();
  context[fun] = this;
  const arg = [...arguments].slice(1);
  const result = context[fun](...arg);
  delete context[fun];
  return result;
}

Function.prototype.myApply = function(object, array) {
  const context = object || window;
  const fun = Symbol();
  context[fun] = this;
  const result;
  if (!array) {
    result = context[fun]();
  } else {
    result = context[fun](...array);
  };
  delete context[fun];
  return result;
}

Function.prototype.myBind = function(object) {
  const context = object || window;
  const fun = Symbol();
  context[fun] = this;
  const arg = [...arguments].slice(1);
  return function() {
    return context[fun](...arg)
  };
}

// insranceof实现
Object.prototype.myInstanceof = function(object) {
  if (!object || typeof object !== 'object') return false;
  const context = object|| window;
  let proto = Object.getPrototypeOf(this);
  white(true) {
    
  }
}