import { createRouter, createWebHashHistory } from 'vue-router'
import FarmList from '@/views/Farm/List.vue'

const routes = [
  {
    path: '/farms',
    component: FarmList,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/farms',
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
