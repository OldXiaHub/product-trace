import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import qs from 'qs'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import echarts from "echarts" 

Vue.config.productionTip = false
Vue.use(ElementUI,{ size: 'small', zIndex: 3000 });
Vue.prototype.$axios = axios //为了保证每个Vue的实例 都有了$axios属性
Vue.prototype.$qs = qs
Vue.prototype.$echarts = echarts
axios.defaults.withCredentials=true;//跨域

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
