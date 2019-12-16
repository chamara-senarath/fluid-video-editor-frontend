import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueHtml2Canvas from "vue-html2canvas";
import VuePlyr from "vue-plyr";

Vue.use(VueHtml2Canvas);
Vue.use(VuePlyr);

Vue.config.productionTip = false;

var filter = function(text, length, clamp) {
  clamp = clamp || "...";
  var node = document.createElement("div");
  node.innerHTML = text;
  var content = node.textContent;
  return content.length > length ? content.slice(0, length) + clamp : content;
};

Vue.filter("truncate", filter);

Vue.mixin({
  data: function() {
    return {
      get API_URL() {
        return "http://10.16.1.77";
      }
    };
  }
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
