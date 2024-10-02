import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/testInterface.vue"; // Exemple de page d'accueil
import Login from "@/components/LoginFrom.vue"; // Importez votre nouvelle page de connexion

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  // ... autres routes
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
