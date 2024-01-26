<template>
    <div>{{DateTimeZone('2024-12-12 12:00', 'YYYY-MM-DD HH:mm:ss')}}</div>
    <dc-select class="select" v-model:value="timezone" :options="timezoneOptions" @change="handleChange"></dc-select>
</template>
<script setup lang="ts">
import { notice } from "@/hooks/useNotice"
import { timezone, timezoneOptions, DateTimeZone } from "@/hooks/useTimezone"

const handleChange = () => notice.success("时区修改成功")
</script>
<style lang="less" scoped>
    .select{
        width: 90px;
    }
</style>