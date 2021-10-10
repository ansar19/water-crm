import Vue from 'vue'
import Vuelidate from 'vuelidate'
import vSelect from 'vue-select'
import Paginate from 'vuejs-paginate'
import VueMeta from 'vue-meta'
import App from './App.vue'
import router from './router'
import store from './store'
import dateFilter from '@/filters/date.filter'
import currencyFilter from '@/filters/currency.filter'
import localizeFilter from '@/filters/localize.filter'
import tooltipDirective from '@/directives/tooltip.directive'
import messagePlugin from '@/utils/message.plugin'
import titlePlugin from '@/utils/title.plugin'
import Loader from '@/components/app/Loader'
import './registerServiceWorker'
import 'materialize-css/dist/js/materialize.min'
import 'leaflet/dist/leaflet.css'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)

Vue.config.productionTip = false

Vue.use(messagePlugin)
Vue.use(titlePlugin)
Vue.use(Vuelidate)
Vue.use(VueMeta)
Vue.filter('date', dateFilter)
Vue.filter('localize', localizeFilter)
Vue.filter('currency', currencyFilter)
Vue.directive('tooltip', tooltipDirective)
Vue.component('Loader', Loader)
Vue.component('Paginate', Paginate)
Vue.component('v-select', vSelect)

firebase.initializeApp({
  apiKey: 'AIzaSyC40OAMvw4z7ndNRYw7ItotxkPvuE_IOCE',
  authDomain: 'ecomarinewtn.firebaseapp.com',
  databaseURL: 'https://ecomarinewtn.firebaseio.com',
  projectId: 'ecomarinewtn',
  storageBucket: 'ecomarinewtn.appspot.com',
  messagingSenderId: '753747716191'
})

let app

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
