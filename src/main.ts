import { createApp } from "vue";
import App from "./App.vue";
import scrollto from "vue-scrollto";
import router from "./router";

const app = createApp(App);
localStorage.setItem("officeId", localStorage.getItem("officeId") ?? "1");

app.use(router);
app.use(scrollto);

app.mount("#app");
