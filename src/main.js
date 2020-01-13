import Vue from "vue"
import App from "./App"

import VueRouter from 'vue-router'
Vue.use( VueRouter )

import Vuetify from "vuetify"
import "vuetify/dist/vuetify.min.css"
Vue.use( Vuetify )

// import VueCodeHighlight from 'vue-code-highlight'

const vuetify = new Vuetify({
  lang: {
    current: "en" // en | es | fr | pl | ru
  }
})

import router from './components/routerInstance'
import store from './components/DataStore'

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  store,
  el: "#app",
  components: {
    App
  },
  template: "<App/>",
  mounted () {
    this.$store.dispatch('GET_MAP_MARKERS')
    this.$store.dispatch('INIT_SPEED_TEST_API')
  }
})
