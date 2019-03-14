// jquery的every和some拓展
$.fn.some = function (callback) {
  var result = false;
  var self = this;
  this.each(function (index, element) { // 对调用改方法的每一个jquery对象进行循环
      if (callback(index, element, self)) { // 传入的回调函数，用来判断true或false的条件
          result = true; // 当有对应项为真时直接跳出循环, 整个函数返回true
          return false;
      }
  });
  return result; // 没有对应项为真,则返回result原始值false
};
$.fn.every = function (callback) {
  var result = true;
  var self = this;
  this.each(function (index, element) {
      if (!callback(index, element, self)) {
          result = false; // 当有对应项为假时直接跳出循环, 返回false
          return false;
      }
  });
  return result;
};