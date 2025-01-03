import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import Home from "../components/Home.vue";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "index",
    component: Home,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
