import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/styles/index.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faMapMarkerAlt, faRoute, faClock, faMapMarker, faMap, faPlane, faTimes, faCaretLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { gqlProvider } from './vue-apollo'
import VueElementLoading from 'vue-element-loading'

library.add(faMapMarkerAlt, faRoute, faClock, faMapMarker, faMap, faPlane, faTimes, faCaretLeft)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('vue-element-loading', VueElementLoading)

Vue.config.productionTip = false

export default new Vue({
  router,
  store,
  apolloProvider: gqlProvider,
  render: h => h(App)
}).$mount('#app')
