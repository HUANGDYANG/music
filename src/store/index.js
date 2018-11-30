import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'  // vuex自带调试工具

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'  // 调试工具

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []  // 是否启用调试插件
})
