import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueHtml2Canvas from "vue-html2canvas";
import VuePlyr from "vue-plyr";
import i18n from "./i18n";
import FlagIcon from "vue-flag-icon";
import VueTreeList from "vue-tree-list";

Vue.use(VueTreeList);
Vue.use(FlagIcon);
Vue.use(VueHtml2Canvas);
Vue.use(VuePlyr);

Vue.config.productionTip = false;

var truncate = function(text, length, clamp) {
  clamp = clamp || "...";
  var node = document.createElement("div");
  node.innerHTML = text;
  var content = node.textContent;
  return content.length > length ? content.slice(0, length) + clamp : content;
};

var upperFirst = function(v) {
  return v.charAt(0).toUpperCase() + v.slice(1);
};

var secondToHHMMSS = function(time) {
  var date = new Date(null);
  date.setSeconds(time);
  var result = date.toISOString().substr(11, 8);
  return result;
};

Vue.filter("truncate", truncate);
Vue.filter("upperFirst", upperFirst);
Vue.filter("secondToHHMMSS", secondToHHMMSS);

Vue.mixin({
  data: function() {
    return {
      API_URL: store.state.URL,
    };
  },
});

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
