import Vue from 'vue'
import VueRouter from 'vue-router'
import SelectFeed from '../views/SelectFeed.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Select Feed',
    component: SelectFeed
  },
  {
    path: '/feed/:feed',
    component: () => import('../views/ViewFeed.vue'),
    children: [
      {
        path: 'dash',
        name: 'Dashboard',
        icon: 'columns',
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: 'map',
        name: 'Map',
        icon: 'map',
        component: () => import('../views/Map.vue')
      },
      {
        path: 'stop',
        name: 'Stop Schedule',
        icon: 'map-marker-alt',
        component: () => import('../views/StopExplorer.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  // if (!store.state.currentFeed && to.params.feed) {
  //   const currentFeed = store.state.feeds.find(feed => parseInt(to.params.feed) === feed.feed_index)
  //   store.commit('setFeed', currentFeed)
  // }
  next()
})

export default router
export { routes }
