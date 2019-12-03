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
    watermark: null,
    chapterMarks: [],
    questionMarks: []
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
    },
    getQuestionMarks: state => {
      return state.questionMarks;
    },
    getWatermark: state => {
      return state.watermark;
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
    },
    setQuestionMarks: (state, payload) => {
      state.questionMarks = payload;
    },
    setWatermark: (state, payload) => {
      state.watermark = payload;
    }
  },
  actions: {},
  modules: {}
});
