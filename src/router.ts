import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard/Dashboard.vue'

const routes = [
  {
    path: '/',
    component: Dashboard
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
})