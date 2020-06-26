import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/styles/index.scss'
import 'vue-slider-component/theme/default.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faMapMarkerAlt, faRoute, faClock, faMapMarker, faMap, faTimes, faCaretLeft, faCheckSquare, faCheckDouble, faColumns, faWindowMaximize, faWindowMinimize } from '@fortawesome/free-solid-svg-icons'
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
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('vue-element-loading', VueElementLoading)

Vue.use(VueInputAutowidth)

library.add(faCheckDouble, faMapMarkerAlt, faRoute, faClock, faMapMarker, faMap, faColumns, faTimes, faCaretLeft, faCheckSquare, faWindowMaximize, faWindowMinimize)

Vue.config.productionTip = false

export default new Vue({
  router,
  store,
  apolloProvider: gqlProvider,
  render: h => h(App)
}).$mount('#app')

console.log('Buses are good.')
