import { createApp } from "vue"; // Utilisation de Vue 3
import App from "./App.vue"; // Importation de votre composant principal
import router from "./router"; // Assurez-vous que ce chemin est correct

import BootstrapVue3 from "bootstrap-vue-3"; // Importation de BootstrapVue 3
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";

const app = createApp(App); // Initialisation de l'application Vue 3
app.use(BootstrapVue3); // Utilisation de BootstrapVue 3
app.use(router);
app.mount("#app"); // Montage de l'application
