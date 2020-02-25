import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

let store = new Vuex.Store({
  state: {
    user: {
      is_logged: false,
      role: null
    },
    profile: {
      name: null,
      avatar: null,
      group: null
    },
    token: null,
    video: {
      id: null,
      title: null,
      file: null,
      authors: [],
      tags: []
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
    },
    getToken: state => {
      return state.token;
    },
    getUser: state => {
      return state.user;
    },
    getProfile: state => {
      return state.profile;
    }
  },
  mutations: {
    setVideoObject: (state, payload) => {
      state.video.id = payload.id;
      state.video.title = payload.title;
      state.video.file = payload.file;
      state.video.authors = payload.authors;
      state.video.tags = payload.tags;
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
    },
    setToken: (state, payload) => {
      state.token = payload;
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setProfile: (state, payload) => {
      state.profile = payload;
    },
    removeToken: state => {
      state.token = null;
      state.user = {
        is_logged: false,
        role: null
      };
      store.commit("setVideoDefault");
    },
    setVideoDefault: state => {
      state.video = {
        id: null,
        title: null,
        file: null,
        authors: [],
        tags: []
      };
      state.splashScreen = {
        data: "null",
        duration: null
      };
      state.watermark = {
        file: null,
        opacity: null,
        widthRatio: null,
        position: {
          leftRatio: null,
          topRatio: null
        }
      };
      state.chapterMarks = [];
      state.questionMarks = [];
    }
  },
  actions: {},
  modules: {},
  plugins: [createPersistedState()]
});

export default store;
