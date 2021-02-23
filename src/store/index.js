import Vue from "vue";
import Vuex from "vuex";
import modules from "./modules";
import axios from "axios";

Vue.prototype.$axios = axios;

Vue.use(Vuex);

const store = new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== "production",
});

store.$axios = axios;

// Автоматически запустить действие `init` для каждого существующего модуля
for (const moduleName of Object.keys(modules)) {
  if (modules[moduleName].actions && modules[moduleName].actions.init) {
    store.dispatch(`${moduleName}/init`);
  }
}

export default store;
