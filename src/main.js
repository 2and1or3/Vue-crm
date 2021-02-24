import Vue from 'vue'
import App from './App.vue'
import Vuelidate from 'vuelidate/src'
import './registerServiceWorker'
import router from './router'
import store from './store'
import dateFilter from '@/filters/date.filter'
import messagePlugin from './utils/message.plugin'
import Loader from './components/app/Loader'
import 'materialize-css/dist/js/materialize.min'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import currencyFilter from '@/filters/currency.filter'
import tooltypDirective from './directives/tooltip.directive'

Vue.config.productionTip = false

Vue.filter('date', dateFilter)
Vue.filter('currency', currencyFilter)
Vue.use(Vuelidate)
Vue.use(messagePlugin)
Vue.component('Loader', Loader)
Vue.directive('tooltip', tooltypDirective)

const config = {
  apiKey: 'AIzaSyAXxMkjhfSYatziSjdGvAvFhzc8lpwkUnY',
  authDomain: 'vue-crm-practice-b8e63.firebaseapp.com',
  projectId: 'vue-crm-practice-b8e63',
  storageBucket: 'vue-crm-practice-b8e63.appspot.com',
  messagingSenderId: '894320742140',
  appId: '1:894320742140:web:1fb198a55308ebce11d179'
}

firebase.initializeApp(config)

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
