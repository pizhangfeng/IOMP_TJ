import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    theme: 'chalk',

    //产品检测结束时间
    overTime: new Date(),
    //当前产品编号
    prodCurr: 0,
    //合格产品数量
    prodQual: 0,
    //不合格产品数量
    prodDisq: 0,
    //当前产品结果
    currProdResult: null,

    //本月用电量
    monthEle: 0,
  },
  mutations: {
    changeTheme(state) {
      if (state.theme === 'chalk') {
        // state.theme = 'vintage'
        state.theme = 'westeros'
      } else {
        state.theme = 'chalk'
      }
    },
    changeOverTime(state){
      state.overTime = new Date()
    },
    increaseProdQual(state){
      state.prodQual++
    },
    increaseProdDisq(state){
      state.prodDisq++
    },
    changeCurrProdResult(state, result){
      state.currProdResult = result
    },
    changeMonthEle(state, sum){
      state.monthEle = sum
      console.log("+++++++++++++++++" + state.monthEle);
    }
  },
  actions: {
  },
  modules: {
  }
})
