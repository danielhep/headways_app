import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/styles/index.scss'
import 'vue-slider-component/theme/default.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCogs, faMapMarkerAlt, faRoute, faClock, faMapMarker, faMap, faTimes, faCaretLeft, faCheckSquare, faCheckDouble, faColumns, faWindowMaximize, faWindowMinimize, faCheckCircle, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { gqlProvider } from './vue-apollo'
import { sync } from 'vuex-router-sync'
import VueElementLoading from 'vue-element-loading'
import VueSlider from 'vue-slider-component'
import VueInputAutowidth from 'vue-input-autowidth'
import VCalendar from 'v-calendar'

sync(store, router)

Vue.use(VCalendar)
Vue.component('VueSlider', VueSlider)
Vue.component('FontAwesomeIcon', FontAwesomeIcon)
Vue.component('VueElementLoading', VueElementLoading)

Vue.use(VueInputAutowidth)

library.add(faCogs, faCheckDouble, faMapMarkerAlt, faRoute, faClock, faMapMarker, faMap, faColumns, faCheckCircle, faTimes, faCaretLeft, faCheckSquare, faWindowMaximize, faWindowMinimize, faChevronDown, faChevronRight)

Vue.config.productionTip = false

export default new Vue({
  router,
  store,
  apolloProvider: gqlProvider,
  render: h => h(App)
}).$mount('#app')

console.log('Buses are good.')
