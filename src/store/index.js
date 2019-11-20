import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    splashScreen: {
      data: null,
      duration: null
    },
    chapterMarks: []
  },
  getters: {
    getSplashScreenObject: state => {
      return state.splashScreen;
    },
    getChapterMarks: state => {
      return state.chapterMarks;
    }
  },
  mutations: {
    setSplashScreenObject: (state, payload) => {
      state.splashScreen.data = payload.data;
      state.splashScreen.duration = payload.duration;
    },
    setChapterMarks: (state, payload) => {
      state.chapterMarks = payload;
    }
  },
  actions: {},
  modules: {}
});
