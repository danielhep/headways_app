import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'
// import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    showInSidebar: false,
    component: Home
  },
  {
    path: '/:feed/dash',
    name: 'Dashboard',
    showInSidebar: true,
    icon: 'plane',
    component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue')
  },
  {
    path: '/:feed/map',
    name: 'Map',
    showInSidebar: true,
    icon: 'map',
    component: () => import(/* webpackChunkName: "about" */ '../views/Map.vue')
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (!store.state.currentFeed && to.params.feed) {
    const currentFeed = store.state.feeds.find(feed => to.params.feed === feed.id)
    store.commit('setFeed', currentFeed)
  }
  next()
})

export default router
export { routes }
