import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/form', name: 'form', component: () => import('../views/FormView.vue') },
  { path: '/feedback', name: 'feedback', component: () => import('../views/FeedbackView.vue') },
  { path: '/data-display', name: 'data-display', component: () => import('../views/DataDisplayView.vue') },
  { path: '/navigation', name: 'navigation', component: () => import('../views/NavigationView.vue') },
  { path: '/overlay', name: 'overlay', component: () => import('../views/OverlayView.vue') },
  { path: '/advanced-input', name: 'advanced-input', component: () => import('../views/AdvancedInputView.vue') },
  { path: '/bo-demo', name: 'bo-demo', component: () => import('../views/BoDemoView.vue') },
]

export default createRouter({
  history: createWebHistory(),
  routes
})
