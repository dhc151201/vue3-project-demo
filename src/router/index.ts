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
