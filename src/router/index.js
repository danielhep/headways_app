import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'

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
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/:feed/map',
    name: 'Map',
    showInSidebar: true,
    icon: 'map',
    component: () => import('../views/Map.vue')
  },
  {
    path: '/:feed/stop',
    name: 'Stop Explorer',
    showInSidebar: true,
    icon: 'map-marker-alt',
    component: () => import('../views/StopExplorer.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  if (!store.state.currentFeed && to.params.feed) {
    await store.dispatch('getFeeds')
    const currentFeed = store.state.feeds.find(feed => parseInt(to.params.feed) === feed.feed_index)
    store.commit('setFeed', currentFeed)
  }
  next()
})

export default router
export { routes }
