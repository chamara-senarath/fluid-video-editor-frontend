import Vue from "vue";
import VueRouter from "vue-router";
import Upload from "../views/Upload.vue";
import Search from "../views/Search.vue";
import User from "../views/User.vue";
import Embed from "../views/Embed.vue";
import Test from "../views/Test.vue";
import Insight from "../views/Insight.vue";
import Report from "../views/Report.vue";
import Login from "../views/Login.vue";
import NotFound from "../views/NotFound.vue";
import Comments from "../views/Comments.vue";

import store from "../store/index";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Search",
    component: Search,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/user/:uid",
    name: "User",
    component: User,
    meta: {
      requiresUserAuth: true
    }
  },
  {
    path: "/upload",
    name: "upload",
    component: Upload,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/comments",
    name: "Comments",
    component: Comments,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/embed/:vid/:uid",
    name: "Embed",
    component: Embed
  },
  // {
  //   path: "/embed",
  //   name: "Embed",
  //   component: Embed
  // },

  {
    path: "/insight",
    name: "Insight",
    component: Insight,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/report",
    name: "Report",
    component: Report,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/test",
    name: "Test",
    component: Test
  },
  { path: "/404", component: NotFound }
  // { path: "*", redirect: "/404" }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  let { is_logged, role } = store.getters.getUser;

  if (to.matched.some(record => record.meta.requiresUserAuth)) {
    if (is_logged && role == "user") {
      next();
      return;
    }
    next("/login");
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (is_logged) {
      next();
      return;
    }
    next("/login");
  } else {
    next();
  }
});

export default router;
