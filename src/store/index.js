import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    splashScreen: null
  },
  getters: {
    getSplashScreenObject: state => {
      return state.splashScreen;
    }
  },
  mutations: {
    setSplashScreenObject: (state, object) => {
      state.splashScreen = object;
    }
  },
  actions: {},
  modules: {}
});
