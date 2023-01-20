import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import scrollto from "vue-scrollto";

import "./assets/style.css";

const app = createApp(App);

app.use(router);
app.use(scrollto);
//app.use(VueGamepad);

app.mount("#app");
