import Vue from "vue";
import Router from "vue-router";
import { constantRouterMap } from "./devRouter";
import { ACCESS_TOKEN } from "@/store/mutation-types";

Vue.use(Router);
const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap,
});

export default router;
