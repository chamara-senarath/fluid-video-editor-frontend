import Vue from "vue";
import VueRouter from "vue-router";
import Upload from "../views/Upload.vue";
import Search from "../views/Search.vue";
import TOC from "../views/TOC.vue";
import Profile from "../views/Profile.vue";
import Embed from "../views/Embed.vue";
import Test from "../views/Test.vue";
import Insight from "../views/Insight.vue";
import UserManagement from "../views/UserManagement.vue";
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
      hasAuth: true,
    },
  },
  {
    path: "/toc",
    name: "TOC",
    component: TOC,
    meta: {
      hasAuth: true,
    },
  },
  {
    path: "/upload",
    name: "upload",
    component: Upload,
    meta: {
      hasAuth: true,
      onlyAdmin: true,
    },
  },
  {
    path: "/comments/:vid",
    name: "Comments",
    component: Comments,
    meta: {
      hasAuth: true,
    },
  },
  {
    path: "/embed/:vid/:uid",
    name: "Embed",
    component: Embed,
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
      hasAuth: true,
    },
  },
  {
    path: "/userManagement",
    name: "UserManagement",
    component: UserManagement,
    meta: {
      hasAuth: true,
      onlyAdmin: true,
    },
  },
  {
    path: "/report",
    name: "Report",
    component: Report,
    meta: {
      hasAuth: true,
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      hasAuth: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      alreadyLogged: true,
    },
  },
  {
    path: "/test",
    name: "Test",
    component: Test,
  },
  { path: "/404", component: NotFound },
  { path: "*", redirect: "/404" },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  let { is_logged, role } = store.getters.getUser;

  if (to.matched.some((record) => record.meta.alreadyLogged)) {
    if (is_logged) {
      next("/");
      return;
    }
    next();
  }

  if (to.matched.some((record) => record.meta.hasAuth)) {
    if (!is_logged) {
      next("/login");
      return;
    }
    next();
  }

  if (to.matched.some((record) => record.meta.onlyAdmin)) {
    if (is_logged && role == "admin") {
      next();
      return;
    }
    next("/");
  } else {
    next();
  }
});

export default router;
