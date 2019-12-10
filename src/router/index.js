import Vue from "vue";
import VueRouter from "vue-router";
import Upload from "../views/Upload.vue";
import Search from "../views/Search.vue";
import Embed from "../views/Embed.vue";
import Test from "../views/Test.vue";

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
  },
  // {
  //   path: "/embed/:vid/:uid",
  //   name: "Embed",
  //   component: Embed
  // },
  {
    path: "/embed",
    name: "Embed",
    component: Embed
  },
  {
    path: "/test",
    name: "Test",
    component: Test
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
