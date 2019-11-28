import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    video: {
      title: null,
      file: null
    },
    splashScreen: {
      data: "null",
      duration: null
    },
    chapterMarks: []
  },
  getters: {
    getVideoObject: state => {
      return state.video;
    },
    getSplashScreenObject: state => {
      return state.splashScreen;
    },
    getChapterMarks: state => {
      return state.chapterMarks;
    }
  },
  mutations: {
    setVideoObject: (state, payload) => {
      state.video.title = payload.title;
      state.video.file = payload.file;
    },
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
