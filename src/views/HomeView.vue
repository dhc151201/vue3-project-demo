<script setup lang="ts">
import useRequest from "@/hooks/useRequest";
import { apiLogin } from "@/https/user"
const { loading, run: Login } = useRequest(apiLogin, {
  manual: true,
  defaultParams: { a: 1 }
})

setTimeout(() => {
  Login({
    b: 100
  })
}, 1000)
</script>

<template>
  {{ loading }}
</template>
