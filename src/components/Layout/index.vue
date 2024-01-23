<template>
    <a-layout class="layout-box" :class="{ 'has-header': !fullRouterView }">
        <a-layout-header v-if="!fullRouterView" class="layout-header">
            <slot name="header"></slot>
        </a-layout-header>
        <a-layout>
            <slot v-if="!fullRouterView" name="menu"></slot>
            <a-layout-content class="layout-content">
                <slot name="page-content"></slot>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>
<script setup lang="ts">
defineProps({
    fullRouterView: {
        type: Boolean,
        default: true
    }
})
</script>
<style lang="less" scoped>
.ant-layout {
    background-color: transparent;
}

.layout-sider {
    background-color: @bg-blank;
}

.layout-header {
    height: 55px;
    padding-inline: 0;
    background-color: @bg-blank;
}

.layout-content {
    background-color: @bg-blank;
}

.has-header {
    height: 100vh;

    .layout-content {
        padding-left: 1.5rem;
        padding-top: 1.5rem;
        padding-right: 1.5rem;
        padding-bottom: 1rem;
        overflow: auto;
    }
}
</style>