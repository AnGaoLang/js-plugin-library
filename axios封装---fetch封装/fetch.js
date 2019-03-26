// const baseUrl = "http://hhlqr.whcewei.com/huanghelou1916-h5";
const baseUrl = "/huanghelou1916-h5";
// baseUrl + 

const get = function (url, data) {
  // 获取传入的对象，转码后拼接在链接尾部
  let str;
  if (!!data) {
    str = '?';
    for (let key in data) {
      str += encodeURI(`${key}=${data[key]}&`);
    }
    str = str.slice(0, str.length - 1);
  }
  return fetch(baseUrl + url + str, {
    method: 'get',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  }).then((response) => {
    return response;
  }).catch((error) => {
    alert(error)
  })
}

const post = function (url,data) {
  return fetch(baseUrl + url, {
    method: 'post',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  }).then((response) => {
    return response;
  }).catch((error) => {
    alert(error)
  })
}

export { get, post };
