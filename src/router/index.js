import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/Game.vue'),
  },
  {
    path: '/test',
    component: () => import('../views/Test.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
