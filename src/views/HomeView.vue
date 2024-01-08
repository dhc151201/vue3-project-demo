<script setup lang="ts">
import useRequest from "@/hooks/useRequest";
import API from "@/https"
const { loading, run, cancel } = useRequest(API.Login, {
  manual: true,
  defaultParams: { a: 1 },
  debounceInterval: 3000
})

setTimeout(() => {
  run({
    b: 100
  })
  cancel()
}, 1000)
</script>

<template>
  {{ loading }}
</template>