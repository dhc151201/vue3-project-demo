<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"
import { includes } from "@/hooks/useKeepalive"
import Layout from "./components/Layout/index.vue"
import Header from "./views/components/Header.vue"
import Menu from "./views/components/Menu.vue"
import menus from "@/enums/menus"

const route = useRoute()
const fullRouterView = computed(() => {
  return route.path.includes('/login')
})
</script>

<template>
  <Layout :fullRouterView="fullRouterView">
    <template #header>
      <Header></Header>
    </template>
    <template #menu>
      <Menu :menus="menus"></Menu>
    </template>
    <template #page-content>
      <router-view v-slot="{ Component }">
        <!-- 登录页面时，主动释放keep-alive -->
        <keep-alive v-if="!route.fullPath.includes('/login')" :include="includes">
          <component :key="route.name || route.path" :is="Component" v-if="$route.meta.keepAlive" />
        </keep-alive>
        <component :key="route.name || route.path" :is="Component" v-if="!$route.meta.keepAlive" />
      </router-view>
    </template>
  </Layout>
</template>

<style scoped></style>
