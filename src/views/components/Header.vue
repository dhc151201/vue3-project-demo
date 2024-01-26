<template>
    <header>
        <Timezone></Timezone>
        <LogoutOutlined class="login-out" @click="loginOut()" />
    </header>
</template>
<script setup lang="ts">
import Timezone from "@/components/TimeZone/index.vue"
import { LogoutOutlined } from '@ant-design/icons-vue';

const loginOut = () => {}
</script>
<style lang="less" scoped>
header{
    background: @bg-blank-light;
    height: 100%;
    border-bottom: 1px solid @bg-blank;
    display: flex;
    justify-content: end;
    align-items: center;
    padding-right: 1.5rem;
    &>*+*{
        margin-left: 1rem;
    }
}
.login-out{
    color: #fff;
    font-size: 1.3rem;
    &:hover{
        color: @color-primary;
    }
}
</style>