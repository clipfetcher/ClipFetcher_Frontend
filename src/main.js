import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './assets/my.css'
import store from './store/index'

Vue.use(BootstrapVue)
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // 要到的頁面 (to)，它的 meta 如果有 requiresAuth 的話，就"不會"直接放行
    const api = `${process.env.VUE_APP_ROOT_API}/api/admin/users`;
    axios.get(api, {
      params: {
        token: store.state.auth.token,
      },
    })
      .then(() => {
        next();
      })
      .catch(() => {
        store.dispatch("auth/setAuth", {
          token: "",
          isLogin: false,
        });
        next({
          path: '/',
        })
      });
  } else {
    // 反之，若沒有 requiresAuth 的話，就會直接放行
    const api2 = `${process.env.VUE_APP_ROOT_API}/api/user`;
    axios.get(api2, {
      params: {
        token: store.state.auth.token,
      },
    })
      .then(() => {
        next();
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400 || error.response.status === 400) {
            store.dispatch("auth/setAuth", {
              token: "",
              isLogin: false,
            });
          }
        }
        next();
      });
  }
})

new Vue({
  created() {
    const html = document.documentElement // returns the html tag
    html.setAttribute('lang', 'zh-Hant')
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')
