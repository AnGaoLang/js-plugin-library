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
