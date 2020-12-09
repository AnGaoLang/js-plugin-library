import { formatCurrency } from '../基础工具函数/fundamental';

/**
 * 数值转百分比
 * value: 输入值
 * digit 保留几位小数
 * 
 */
Vue.filter('percent', function (value, digit) {
  if (!digit) {
    digit = 2;
  }
  if (!value) return "0.00%";
  value = (value * 100).toFixed(digit);
  var result = value.toString() + "%";
  return result;
})

/**
 * 数值转百分比
 */
Vue.filter('price', function (price) {
  if (!price) return '';
  return formatCurrency(price);
})

// 校验是否为空数据
export function isBlank(chr) {
    if (chr == null || chr == '' || chr == undefined || chr == 'undefined' || chr == 'null' || chr.length == 0) {
        return true;
    };
    let str = chr.toString();
    str = str.replace(/(^\s*)|\s*$/g, '');
    if (chr == null || chr == '' || chr == undefined || chr == 'undefined' || chr == 'null' || chr.length == 0) {
        return true;
    };
    return false;
}

export function checkInteger(value, max = 1000, isInterger = true) {
  let returnValue = value;
  if (isInterger) {
    returnValue = parseInt(returnValue)
  };
  if (returnValue > max) {
    returnValue = max;
  };
  return returnValue;
}

/**
 * paramsType: Object
 * params: a, b
 * return: Boolean
 */
export function isObjectValueEqual(a, b) {
    // 判断两个对象是否指向同一内存，指向同一内存返回true
    if (a === b) return true
    // 获取两个对象键值数组
    let aProps = Object.getOwnPropertyNames(a)
    let bProps = Object.getOwnPropertyNames(b)
    // 判断两个对象键值数组长度是否一致，不一致返回false
    if (aProps.length !== bProps.length) return false
    // 遍历对象的键值
    for (let prop in a) {
        // 判断a的键值，在b中是否存在，不存在，返回false
        if (b.hasOwnProperty(prop)) {
            // 判断a的键值是否为对象，是则递归，不是对象直接判断键值是否相等，不相等返回false
            if (typeof a[prop] === 'object') {
                if (!isObjectValueEqual(a[prop], b[prop])) return false
            } else if (a[prop] !== b[prop]) {
                return false
            }
        } else {
            return false
        }
    }
    return true
}