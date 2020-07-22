import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  { // Home page
    path: '',
    name: 'Home',
    component: Home
  },
  {
    path: "/register",
    name: "UserRegister",
    component: () => import("@/views/UserRegister.vue")
  },
  {
    path: "/login",
    name: "UserLogin",
    component: () => import("@/views/UserLogin.vue")
  },
  {
    path: "/user",
    name: "Profile",
    component: () => import("@/views/Profile.vue"),
    redirect: { name: 'UserProfile' },
    children: [
      {
        name: 'UserProfile',
        path: '',
        component: () => import("@/views/UserProfile.vue")
      },
      {
        name: 'UserSettings',
        path: 'settings',
        component: () => import("@/views/UserSettings.vue")
      }
    ]
  },
  {
    path: "/urls",
    name: "Url",
    component: () => import("@/views/Url.vue"),
    redirect: { name: 'UrlList' },
    children: [
      {
        path: '',
        name: "UrlList",
        component: () => import("@/views/UrlList.vue")
      },
      {
        path: 'add',
        name: "UrlAdd",
        component: () => import("@/views/UrlAdd.vue")
      }
    ]
  },
  {
    path: "/:slug",
    name: "Redirect",
    component: () => import("@/views/Redirect.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
