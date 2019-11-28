import Vue from "vue";
import VueRouter from "vue-router";
import Upload from "../views/Upload.vue";
import Search from "../views/Search.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Search
  },
  {
    path: "/upload",
    name: "upload",
    component: Upload
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
