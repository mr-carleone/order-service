import { createRouter, createWebHistory } from "vue-router";
import RequestTable from "../components/RequestTable.vue";
import SendMessage from "../components/SendMessage.vue";

const routes = [
  { path: "/requests", component: RequestTable },
  { path: "/send", component: SendMessage },
  { path: "/", redirect: "/requests" }, // Перенаправление на страницу заявок по умолчанию
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
