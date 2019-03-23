export class Format {
  constructor () {
    this.regex = new RegExp(/Y{4}|M{2}|D{2}|h{2}|m{2}|s{2}/g);
  }

  dateToStr (str) {
    let toString = {
      'YYYY': () => {
        return this.date.getFullYear();
      },
      'MM': () => {
        let month = this.date.getMonth() + 1;
        return month.toString().padStart(2, '0');
      },
      'DD': () => {
        let day = this.date.getDate();
        return day.toString().padStart(2, '0');
      },
      'hh': () => {
        let hour = this.date.getHours();
        return hour.toString().padStart(2, '0');
      },
      'mm': () => {
        let minute = this.date.getMinutes();
        return minute.toString().padStart(2, '0');
      },
      'ss': () => {
        let second = this.date.getSeconds();
        return second.toString().padStart(2, '0');
      }
    };
    return toString[str]();
  }

  // date: new Date()
  // regexString: 'YYYY-MM-DD hh:mm:ss'
  toStr (date, regexString) {
    const regString = regexString;

    this.date = date;
    
    return regString.replace(this.regex, (match) => {
      return this.dateToStr(match);
    })
  }
}

// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 (this获取的是new Date()的值)
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18  
Date.prototype.Format = function format (fmt) {
  var o = {
      "M+": this.getMonth() + 1,                 //月份   
      "d+": this.getDate(),                    //日   
      "h+": this.getHours(),                   //小时   
      "m+": this.getMinutes(),                 //分   
      "s+": this.getSeconds(),                 //秒   
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
      "S": this.getMilliseconds()             //毫秒   
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  } 
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }     
  return fmt;
}