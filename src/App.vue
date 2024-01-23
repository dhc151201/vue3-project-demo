<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"
import zh_CN from "ant-design-vue/locale/zh_CN"
import EN from "ant-design-vue/locale/en_US"
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
  <a-config-provider :locale="zh_CN">
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
  </a-config-provider>
</template>

<style scoped></style>
