import { createRouter, createWebHistory } from "vue-router";
// import { useStore } from "vuex";

// const requireAuth = async (to, from, next) => {
//   const store = useStore();
//   const userTest = await store.currentUser();
//   console.log(userTest);
//   if (to.meta.requiresAuth && !store.userAuth) return "/logIn" {
//     next();
//   // } else {
//   //   next("logIn");
//   // }
// };

const routes = [
  {
    path: "/",
    redirect: "/logIn",
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/DashBoard.vue"),
    // beforeEnter: requiresAuth,
  },
  {
    path: "/logIn",
    name: "logIn",
    component: () => import("../views/LogIn.vue"),
  },
  //Route 404
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("../views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
