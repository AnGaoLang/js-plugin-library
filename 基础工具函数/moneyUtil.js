function numberFormat(number, decimals, decPoint, thousandsSep, roundtag) {
  /*
      * 参数说明：
      * number：要格式化的数字
      * decimals：保留几位小数
      * dec_point：小数点符号
      * thousands_sep：千分位符号
      * roundtag:舍入参数，默认 'ceil' 向上取,'floor'向下取,'round' 四舍五入
      * */
  number = (number + '').replace(/[^0-9+-Ee.]/g, '');
  roundtag = roundtag || 'ceil';// 'ceil','floor','round'
  var n = !isFinite(+number) ? 0 : +number;
  var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
  var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep;
  var dec = (typeof decPoint === 'undefined') ? '.' : decPoint;
  var s = '';
  var toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      console.log();

      return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)) / k
  };
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  var re = /(-?\d+)(\d{3})/;
  while (re.test(s[0])) {
      s[0] = s[0].replace(re, '$1' + sep + '$2')
  }

  if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0')
  }
  if (CURRENT_LANG != DEFAULT_LANG) {
      return s.join(dec) + ' yuan'
  }
  return s.join(dec) + "元"
}

function formatCurrency(num) {
  if (num) {
      //将num中的$,去掉，将num变成一个纯粹的数据格式字符串
      num = num.toString().replace(/\$|\,/g, '');
      //如果num不是数字，则将num置0，并返回
      if ('' == num || isNaN(num)) {
          return 'Not a Number ! ';
      }
      //如果num是负数，则获取她的符号
      var sign = num.indexOf("-") > 0 ? '-' : '';
      //如果存在小数点，则获取数字的小数部分
      var cents = num.indexOf(".") > 0 ? num.substr(num.indexOf(".")) : '';
      cents = cents.length > 1 ? cents : '';//注意：这里如果是使用change方法不断的调用，小数是输入不了的
      //获取数字的整数数部分
      num = num.indexOf(".") > 0 ? num.substring(0, (num.indexOf("."))) : num;
      //如果没有小数点，整数部分不能以0开头
      if ('' == cents) {
          if (num.length > 1 && '0' == num.substr(0, 1)) {
              return 'Not a Number ! ';
          }
      }
      //如果有小数点，且整数的部分的长度大于1，则整数部分不能以0开头
      else {
          if (num.length > 1 && '0' == num.substr(0, 1)) {
              return 'Not a Number ! ';
          }
      }
      //针对整数部分进行格式化处理，这是此方法的核心，也是稍难理解的一个地方，逆向的来思考或者采用简单的事例来实现就容易多了
      /*
        也可以这样想象，现在有一串数字字符串在你面前，如果让你给他家千分位的逗号的话，你是怎么来思考和操作的?
        字符串长度为0/1/2/3时都不用添加
        字符串长度大于3的时候，从右往左数，有三位字符就加一个逗号，然后继续往前数，直到不到往前数少于三位字符为止
       */
      for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
          num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
      }
      //将数据（符号、整数部分、小数部分）整体组合返回
      return (sign + num + cents);
  }
}