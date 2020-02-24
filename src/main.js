import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/styles/index.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faMapMarkerAlt, faRoute, faClock, faMapMarker, faMap, faPlane, faTimes, faCaretLeft, faCheckSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { gqlProvider } from './vue-apollo'
import VueElementLoading from 'vue-element-loading'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

Vue.component('VueSlider', VueSlider)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('vue-element-loading', VueElementLoading)

library.add(faMapMarkerAlt, faRoute, faClock, faMapMarker, faMap, faPlane, faTimes, faCaretLeft, faCheckSquare)

Vue.config.productionTip = false

export default new Vue({
  router,
  store,
  apolloProvider: gqlProvider,
  render: h => h(App)
}).$mount('#app')

console.log('Buses are good.')
