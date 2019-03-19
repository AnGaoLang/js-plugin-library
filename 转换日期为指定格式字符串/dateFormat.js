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