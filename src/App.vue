<script setup lang="ts">
import {includes} from "@/hooks/useKeepalive"
import { RouterView, useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <router-view v-slot="{ Component }">
    <!-- 登录页面时，主动释放keep-alive -->
    <keep-alive v-if="!route.fullPath.includes('/login')" :max="5" :include="includes">
      <component :key="route.name || route.path" :is="Component" v-if="$route.meta.keepAlive" />
    </keep-alive>
    <component :key="route.name || route.path" :is="Component" v-if="!$route.meta.keepAlive" />
  </router-view>
</template>

<style scoped></style>
