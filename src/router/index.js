import Vue from "vue";
import VueRouter from "vue-router";
import Upload from "../views/Upload.vue";
import Test from "../components/Test.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Test
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
