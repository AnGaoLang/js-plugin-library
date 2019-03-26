import Vue from 'vue';
import Axios from 'axios';

// 成功调用并返回数据，则直接返回数据主体内容
// 失败调用或返回数据失败，则只返回null

// const baseUrl = 'http://xysh.whcewei.com'; // 正式
const baseUrl = 'http://xyshtest.whcewei.com'; // 测试

// 请求发送之前的拦截器
Axios.interceptors.request.use(
  config => {
    // 调用成功
    Vue.$vux.loading.show({
      text: '加载中'
    });
    document.body.style.overflow = 'hidden';
    return config; // 必须有返回值，请求才能继续
  },
  error => {
    // 调用失败
    Vue.$vux.loading.show({
      text: '请求调用失败'
    });
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      Vue.$vux.loading.hide();
      document.body.style.overflow = 'auto';
    }, 1000);
    return Promise.reject(error);
  }
);

// 请求返回后的拦截器
Axios.interceptors.response.use(
  response => {
    // 请求成功
    if (response.data.success && response.data.success) {
      Vue.$vux.loading.hide();
      document.body.style.overflow = 'auto';
      return response.data.result; // 此处的返回值会反给Axios({}).then(res => {})中的res
    } else {
      Vue.$vux.loading.hide();
      document.body.style.overflow = 'auto';

      // 返回的错误消息（单个直接返回，多个拼接成字符串返回）
      let errorMsg = '';
      if (response.data.error.message) {
        errorMsg = response.data.error.message;
      }
      if (response.data.error.validationErrors) {
        response.data.error.validationErrors.forEach(item => {
          errorMsg += item.message + ',';
        });
        errorMsg = errorMsg.substring(0, errorMsg.length - 1);
      }

      Vue.$vux.loading.show({
        text: `请求调用失败：${errorMsg}`
      });
      setTimeout(() => {
        Vue.$vux.loading.hide();
      }, 1000);
      return null; // 请求错误直接反null
    }
  },
  error => {
    // 请求失败
    Vue.$vux.loading.show({
      text: `请求调用失败：${error}`
    });
    setTimeout(() => {
      Vue.$vux.loading.hide();
    }, 1000);
    return Promise.reject(error); // 请求失败直接返回null，该值会返给catch
  }
);

function post (url, data) {
  // 返回一个promise
  return Axios({
    baseURL: baseUrl, // 测试
    url: url,
    // url: '/repair' + url,
    method: 'post',
    data: data,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization':
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJhZG1pbiIsInN1YiI6IjEwMzMiLCJqdGkiOiI4OWY5NjVhZC1hOTA2LTQyNjktOTkzNy1hZTNlZWQ5NzE0ODEiLCJpYXQiOjE1MzU5NDQxMzAsIm5iZiI6MTUzNTk0NDEzMCwiZXhwIjoxNTY3NDgwMTMwLCJpc3MiOiJNeUFCUFZ1ZUNvcmUiLCJhdWQiOiJNeUFCUFZ1ZUNvcmUifQ.OjLKgE5aZRPjPQ_0R-lQxyQvU66dOpiNuZZmFi0efZc'
    }
  }).then(
    response => {
      // 返回的也是一个promise
      return response;
    },
    error => {
      console.log(error);
      return null;
    }
  );
}

export { baseUrl, post };
