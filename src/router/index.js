import Vue from "vue";
import VueRouter from "vue-router";
import Upload from "../views/Upload.vue";
import Search from "../views/Search.vue";
import User from "../views/User.vue";
import Embed from "../views/Embed.vue";
import Test from "../views/Test.vue";
import Insight from "../views/Insight.vue";
import Report from "../views/Report.vue";
import NotFound from "../views/NotFound.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Search",
    component: Search
  },
  {
    path: "/user",
    name: "User",
    component: User
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
    path: "/insight",
    name: "Insight",
    component: Insight
  },
  {
    path: "/report",
    name: "Report",
    component: Report
  },
  {
    path: "/test",
    name: "Test",
    component: Test
  },
  { path: "/404", component: NotFound },
  { path: "*", redirect: "/404" }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
