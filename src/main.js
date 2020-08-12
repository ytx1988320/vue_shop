import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/css/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import { Message } from 'element-ui';
// 发起请求前
let loadingInstance = null;
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
// 默认地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 超时设置
axios.defaults.timeout = 2500;
// 请求拦截设置
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
}, err => {
  // ==================  错误处理  ====================
  Message.error({ message: '请求超时!' });
  return Promise.resolve(err);
})

//  RESPONSE 响应异常拦截
axios.interceptors.response.use(data => {
// ==============  所有请求完成后都要执行的操作  ==================
// 第一种方式
  // 根据返回的code值来做不同的处理（和后端约定）
  return data;
}, err => {
// ==============  错误处理  ====================
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '请求错误(400)';
        break;
      case 401:
        err.message = '未授权，请重新登录(401)';
        break;
      case 403:
        err.message = '拒绝访问(403)';
        break;
      case 404:
        err.message = '请求出错(404)';
        break;
      case 408:
        err.message = '请求超时(408)';
        break;
      case 500:
        err.message = '服务器错误(500)';
        break;
      case 501:
        err.message = '服务未实现(501)';
        break;
      case 502:
        err.message = '网络错误(502)';
        break;
      case 503:
        err.message = '服务不可用(503)';
        break;
      case 504:
        err.message = '网络超时(504)';
        break;
      case 505:
        err.message = 'HTTP版本不受支持(505)';
        break;
      default:
        err.message = `连接出错(${err.response.status})!`;
    }
  } else {
    err.message = '连接服务器失败!'
  }
  Message.error(err.message)
  return Promise.resolve(err);
})
Vue.prototype.$http = axios;
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
