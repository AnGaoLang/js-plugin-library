import { table } from './example.js';

// 去除数组的空项或false项
// 另外还可以用array.filter(Boolean); 筛选出数组的真值成员。在数组成员不为false可用此方法删除空项。
function deleteEmpty(array) {
  var returnArray = array;
  for (var i = 0; i < returnArray.length; i++) {
      if (!returnArray[i]) {
          returnArray.splice(i, 1);
          i = i - 1; // 删除数组项后，数组项长度会变短，这里减一则防止下一数组项背跳过
      }
  };
  return returnArray;
};

// 用新的数组项，覆盖对应的目标数组项，source的数组项要和update数组项对等，才能一一覆盖
function updateArray(source, update) {
  // 深拷贝
  var source = JSON.parse(JSON.stringify(source));
  // 先循环待更新的数据源，然后循环目标数据源，一一配对。
  update.forEach(function (item) {
      for (var i = 0; i < source.length; i++) {
          // 如果预设的表格里的项和当前表格里的项相同，则改变为被选中状态
          if (source[i].key == item.key) {
            source[i] = item;
          };
      }
  });
  return source;
};

// 数组去重
/*
* 给传入数组排序，排序后相同值相邻，
* 然后遍历时,新数组只加入不与前一值重复的值。
* 会打乱原来数组的顺序
* */
function uniq(array){
  array.sort(); // 此处传入处理函数，给引用类型的值排序
  var temp=[array[0]];
  for(var i = 1; i < array.length; i++){
      if( array[i] !== temp[temp.length-1]){
          temp.push(array[i]);
      }
  }
  return temp;
}

/**
 * table的列传行，以便循环
 * @param {} source : 引入的table.json,输出值如下
 */
function columnToRow (source) {
  var that = this;
  // 最外层的包裹数组
  var arrayOuter = [];
  // 目标类型的总数量
  var arrayLength = source[0].target.length;
  // 以目标类型的总数量为长度创造二维数组，每一个数组项即当前目标类型的所有人员的完成情况
  for (var i = 0; i < arrayLength; i++) {
      var arrayInner = {
          targetName: '', // 当前目标类型的名称
          targetList: [] // 当前目标类型的所有人员数据构成的数组
      };
      // 将每一个人员的当前目标类型的数据推入数组
      source.forEach(function (item) {
          arrayInner.targetName = item.target[i].name;
          // 加入销售人员id
          item.target[i]['marketerID'] = item.marketerID;
          arrayInner.targetList.push(item.target[i]);
      })
      // 推入最外层数组
      arrayOuter.push(arrayInner);
  }
  return arrayOuter;
}

/**
 * 数值转货币，100.000.00
 * @param {number} num 传入的数值 
 */
export function formatCurrency(num) {
  num = num.toString().replace(/\$|\,/g, '');
  if (isNaN(num)) num = "0";
  sign = (num == (num = Math.abs(num)));
  num = Math.floor(num * 100 + 0.50000000001);
  cents = num % 100;
  num = Math.floor(num / 100).toString();
  if (cents < 10) cents = "0" + cents;
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
    num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
  }
  return (((sign) ? '' : '-') + num + '.' + cents);
}  


// ["#4682b4", "#934554", "#cda0a8", "#696969", "#ca8604", "#9932cc", "#046570", "#ff7f50", "#173c1a", "#3cb371", 
//  "#4b0082", "#ff8c00", "#001464", "#ff45ff", "#5e8b22", "#00ced1", "#2f4f6b", "#808000", "#b22222", "#32cd32", 
//  "#1e90ff", "#d48265", "#800000", "#ba55d3", "#5f9ea0", "#dc143c", "#c71585", "#8b668b", "#008b00", "#d2691e", 
//  "#0000ff", "#ff1493", "#7b1086", "#ff0000", "#db7093", "#000000", "#faebd7", "#c0ff3e", "#00ffff", "#98fb98", 
//  "#ff69b4", "#c1ffc1", "#bebebe", "#b0e0e6", "#ffff00", "#00ff7f", "#deb887", "#87cefa", "#ffa07a", "#ffdead", 
//  "#7fffd4", "#ffd700", "#e066ff", "#7cfc00", "#ffb6c1", "#40e0d0", "#eed2ee", "#dda0dd", "#00ff00"]
/**
 * 16进制颜色转rgb颜色
 * @param {string} hex: 16进制颜色 (只支持3个字符和6个字符的16进制颜色模式)
 */
function hexToRgb(hex) {
  // 去除'#'
  var hex = hex.replace('#', '');
  var length = hex.length;
  if (length == 3 || length == 6) {
    // 3个字符的，拓展为6个字符
    if (length == 3) {
      var array = hex.split('');
      array = array.map(function (item) {
        return item + item + '';
      })
      hex = array.join('');
    }
    // 使用正则匹配
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null;
  } else {
    console.log('输入正确的16进制颜色格式');
  }
}

// rgb转16进制
function colorRGB2Hex(color) {
  var rgb = color.split(',');
  var r = parseInt(rgb[0].split('(')[1]);
  var g = parseInt(rgb[1]);
  var b = parseInt(rgb[2].split(')')[0]);

  var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  return hex;
}

// rgb转rgba
function rgbTorgba(rgb) {r
    var rgb = rgb;
    var end = rgb.length - 1;
    rgb = rgb.slice(4, end);
    return 'rgba(' + rgb + ', 0.2' + ')';
}
// rgba转rgb
function rgbaTorgb(rgba) {
    var rgb = rgba;
    var end = rgb.length - 6;
    rgb = rgb.slice(5, end);
    return 'rgb(' + rgb + ')';
}

// 取十六进制的反色
function clorReverse (OldColorValue){
  var OldColorValue="0x"+OldColorValue.replace(/#/g,"");
  var str="000000"+(0xFFFFFF-OldColorValue).toString(16);
  return '#' + str.substring(str.length-6,str.length);
};

/**
 * 
 * @param {*string rgb颜色} OldColorValue 
 * 根据 灰度/亮度 公式，依据给定颜色，反白色或黑色
 */
var clorReverse = function (color){
  if (!color) return '';
  if (color == '' || color == 'transparent') return color;
  var hex = color;
  if (length == 3) {
    var array = hex.split('');
    array = array.map(function (item) {
      return item + item + '';
    })
    hex = array.join('');
  };
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var red = parseInt(result[1], 16);
  var green = parseInt(result[2], 16);
  var black = parseInt(result[3], 16);
  var gratLight = (0.299 * red + 0.587 * green + 0.114 * black) / 255;
  return gratLight > 0.5 ? '#333' : '#fff';
};

// 获取目标节点到页面根节点顶部的距离，递归使用offsetParent获取offsetTop
function getPageOffsetTop(ele, direction) {
  var dir = 'offset' + direction.charAt(0).toUpperCase() + direction.substring(1);
  if(ele.offsetParent) {
    return getPageOffsetTop(ele.offsetParent, direction) + ele[dir];
  };
  return ele.offsetTop;
};

// cookie格式化,字符串转为对象
function parseCookie(cookie) {
  var cookieObj = {};
  if (!cookie) return cookie;
  var list = cookie.split(';');
  for(var i = 0; i < cookie.length; i++) {
    var pair = list[i].split('=');
    cookieObj[pair[0].trim()] = pair[1];
  };
  return cookieObj;
};

// 循环对一个数组的数据进行不重复随机抽取
// 每次随机抽取返回一个数组成员
// 函数实参为引用类型时，会维持引用
function randomSelection(randomArray, cacheArray) {
  var returnItem;
  var index;
  if (randomArray[0]) {
    index = Math.floor(Math.random() * randomArray.length);
    returnItem = randomArray[index];
    randomArray.splice(index, 1);
  } else {
    randomArray = JSON.parse(JSON.stringify(cacheArray));
    index = Math.floor(Math.random() * randomArray.length);
    returnItem = randomArray[index];
    randomArray.splice(index, 1);
  };
  return returnItem;
}

// 数组成员内是否全部相等（仅限原始数据类型）
function allSame (a) {
	for(var i =0;i<a.length;i++) {
		if (a[0] != a[i]) {
			return false;
		}
  }
  return true;
};

// 模板字符串
// template：'<input type="${type}" name="${name}" id="${id}"/>'
// data = { type: type, name: item.id + '_' + inputIndex };
// input = temString(input, inputData);
function temString(template, data) {
  return template.replace(/\$\{(.*?)\}/g, (match, $1) => data[$1.trim()]); // $1依次匹配子表达式 (.*?)
};

// 获取url后面的参数
function getParam (key) {
  var obj = {};
  var searchArray = decodeURIComponent(window.location.search).slice(1).split('&');
  searchArray.forEach(function (item) {
    var array = item.split('=');
    obj[array[0]] = array[1];
  });
  if (key) {
    return obj[key]
  } else {
    return obj
  }
}

function getParam(key) {
  var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i');
  var param = window.location.search.substring(1).match(reg)[0];
  param = param.replace(/&/g, '');
  return unescape(param.split('=')[1]);
}

function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]); return null;
};

//传入经纬度计算距离
function distance(la1, lo1, la2, lo2) {
  if (!la1 || !lo1 || !la2 || !lo2) {
    return "";
  }
  var La1 = la1 * Math.PI / 180.0;
  var La2 = la2 * Math.PI / 180.0;
  var La3 = La1 - La2;
  var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
  s = s * 6378.137; //地球半径
  s = Math.round(s * 10000) / 10000;
  return s
  // console.log("计算结果",s)
}

// 对象转url参数
function urlEncode(param, key, encode) {
  if (param == null) return '';
  var paramStr = '';
  var t = typeof(param);
  if (t == 'string' || t == 'number' || t == 'boolean') {
    paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
      paramStr += urlEncode(param[i], k, encode)
    }
  }
  return paramStr;
}

// 毫秒转换为天、时、分、秒
function toTimeCount(start, end) {
  start = new Date(start).getTime();
  end = new Date(end).getTime();
  var diffTime = parseInt((end - start) / 1000);
  var difDay = parseInt(diffTime / 60 / 60 / 24);
  diffTime = diffTime - (difDay * 60 * 60 * 24);
  var difHour = parseInt(diffTime / 60 / 60);
  diffTime = diffTime - (difHour * 60 * 60);
  var difSecond = parseInt(diffTime / 60);
  diffTime = diffTime - (difSecond * 60);
  return '倒计时：' + difDay + '天' + difHour + '时' + difSecond + '分' + diffTime + '秒';
}