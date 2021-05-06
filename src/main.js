import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

// axios.defaults.baseURL = 'http://noah-sub1.duckdns.org:8080';
// axios.defaults.headers.get['Content-Type'] = 'application/json; charset=utf-8';
// axios.defaults.headers.get['Access-Control-Allow_Origin'] = '*';


Vue.use(BootstrapVue)
Vue.use(ElementUI)

import VueNativeSock from 'vue-native-websocket'
Vue.use(VueNativeSock, 'ws://noah-sub1.duckdns.org:3030')

import VueKonva from 'vue-konva'
Vue.use(VueKonva)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
