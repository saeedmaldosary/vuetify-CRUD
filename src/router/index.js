import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Portal from "../views/Portal.vue";
import Dashboard from "../views/Dashboard.vue";
import Customers from "../views/Customers.vue";
import About from "../views/About.vue";
import PageNotFound from "../views/PageNotFound.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Portal",
    component: Portal,
    redirect: { name: "dashboard" },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        redirect: { name: "customers" },
        component: Dashboard,
        children: [
          {
            path: "/dashboard/customers",
            name: "customers",
            component: Customers,
          },
        ],
      },
      {
        path: "/about",
        name: "about",
        component: About,
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  { path: "*", component: PageNotFound },
];

const router = new VueRouter({
  routes,
});

export default router;
