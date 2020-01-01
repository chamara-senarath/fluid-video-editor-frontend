import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    video: {
      id: null,
      title: null,
      file: null
    },
    splashScreen: {
      data: "null",
      duration: null
    },
    watermark: {
      file: null,
      opacity: null,
      widthRatio: null,
      position: {
        leftRatio: null,
        topRatio: null
      }
    },
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
      state.video.id = payload.id;
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
      if (payload == null) {
        state.watermark.opacity = null;
        state.watermark.widthRatio = null;
        state.watermark.position = null;
        state.watermark.file = null;
      } else {
        state.watermark.opacity = payload.opacity;
        state.watermark.widthRatio = payload.widthRatio;
        state.watermark.position = payload.position;
        state.watermark.file = payload.file;
      }
    }
  },
  actions: {},
  modules: {}
});
