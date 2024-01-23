<template>
    <header>
        <LogoutOutlined class="login-out" @click="loginOut()" />
    </header>
</template>
<script setup lang="ts">
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
}
.login-out{
    color: #fff;
    font-size: 1.3rem;
    &:hover{
        color: @color-primary;
    }
}
</style>