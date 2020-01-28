import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/styles/index.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faRoute, faClock, faMapMarker, faMap, faPlane, faTimes, faCaretLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faRoute, faClock, faMapMarker, faMap, faPlane, faTimes, faCaretLeft)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
