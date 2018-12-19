import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'  // 图片懒加载
import store from './store'

import 'common/stylus/index.styl'

// /* eslint-disable no-unused-vars */ // 规避eslint检测
// import vConsole from 'vconsole'  // 手机端调试工具

fastclick.attach(document.body)

Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
