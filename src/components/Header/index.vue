<template>
    <header>
        <UserTag v-if="USER.user_info.user_name" style="margin-right: 1rem" 
            :user_name="USER.user_info.user_name" 
            :role_name="compRole(USER.user_info)"
        ></UserTag>
        <Timezone></Timezone>
        <LangSwitch></LangSwitch>
        <LogoutOutlined class="login-out" @click="loginOut()" />
    </header>
</template>
<script setup lang="ts">
import UserTag from "@/components/UserTag/index.vue"
import LangSwitch from "@/components/Lang/index.vue"
import Timezone from "@/components/TimeZone/index.vue"
import { LogoutOutlined } from '@ant-design/icons-vue';
import { loginOut } from "@/hooks/useUserInfo"
import { USER } from "@/hooks/useUserInfo"
import { compRole } from "@/hooks/useRole";
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
    & > *:not(:first-child){
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