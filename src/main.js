import Vue from 'vue';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/base.css';
import moment from 'moment';
import CusBread from './components/cusBread'
import HttpServer from './components/http'

import App from './App';
import router from './router';


axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';

Vue.prototype.$http = axios;

Vue.use(ElementUI);
Vue.use(HttpServer);

Vue.config.productionTip = false;

// 全局过滤器处理日期

Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
});

Vue.component(CusBread.name, CusBread)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App,
  },
  template: '<App/>',
});
