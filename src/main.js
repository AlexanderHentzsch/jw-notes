import Vue from "vue/dist/vue.min"
import VueRouter from "vue-router/dist/vue-router.min"
import {routes} from "@/routes";

Vue.config.productionTip = false;
Vue.use(VueRouter);

new Vue({
  router: new VueRouter({routes}),
  el: "#app"
});
