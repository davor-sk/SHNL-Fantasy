import { createRouter, createWebHistory } from "vue-router";

import PrijavaKorisnika from "../views/PrijavaKorisnika.vue";
import HomePage from "../views/HomePage.vue";
import BiranjeEkipe from "../views/BiranjeEkipe.vue";
import LogIn from "../views/logIn.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/home",
      redirect: "/",
    },
    {
      path: "/registracija",
      name: "registracija",
      component: LogIn,
    },
    {
      path: "/prijava",
      name: "prijava",
      component: PrijavaKorisnika,
    },
    {
      path: "/biranje-ekipe",
      name: "biranje-ekipe",
      component: BiranjeEkipe,
    },
  ],
});

export default router;
