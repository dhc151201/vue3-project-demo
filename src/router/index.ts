import { createRouter, createWebHashHistory } from 'vue-router'
import { addKeepAliveCache } from '@/hooks/useKeepalive'
export const openKeepAlive: boolean = false

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        keepAlive: openKeepAlive
      }
    },
    {
      path: '/login',
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: '/home',
      component: () => import('@/views/home.vue'),
    },
    {
      path: '/manager-goods',
      component: () => import('@/views/manager-goods/index.vue'),
    },
    {
      path: '/manager-order',
      component: () => import('@/views/manager-orders/index.vue'),
    },
    {
      path: '/manager-spread',
      component: () => import('@/views/manager-spread/index.vue'),
    },
    {
      path: '/manager-recharge',
      component: () => import('@/views/manager-recharge/index.vue'),
    }
  ]
})

router.afterEach((to) => {
  if (to.meta?.keepAlive) {
      const matched = router.currentRoute.value.matched ?? []
      const instance = matched.find((instan: any) => instan.path === to.path)
      // 读取路由组件实例的name属性
      const name: string = String(instance?.components?.default?.name || '');
      if (name) {
        addKeepAliveCache(name)
      }
  }
})

export default router
