import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/jogo',
    component: () => import('../views/Game.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
