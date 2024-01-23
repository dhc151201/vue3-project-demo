<template>
    <div class="panel">
        <div class="top-logo">
            <div class="contant">
                <MenuUnfoldOutlined v-if="collapsed" @click="toggleCollapsed" />
                <MenuFoldOutlined v-else @click="toggleCollapsed" />
                <strong class="logo-text color-pink hidden-wap">系统</strong>
                <i class="version hidden-wap">2.3.0</i>
            </div>
        </div>
        <a-layout-sider v-model:collapsed="collapsed" collapsible :collapsedWidth="0">
            <a-menu v-model:selectedKeys="selectedKeys" :open-keys="openKeys" :items="menus" mode="inline" theme="dark"></a-menu>
        </a-layout-sider>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
import { useRoute } from "vue-router"
import {getPath} from "@/hooks/useMenus"
const route = useRoute()
const props = defineProps({
    menus: {
        type: Array,
        default: () => []
    }
})

const collapsed = ref(false)
const openKeys = ref<(string | undefined)[]>([])
const selectedKeys = ref<(string | undefined)[]>([])
const toggleCollapsed = () => {
    collapsed.value = !collapsed.value;
    const { path, parent } = getPath(route.path, props.menus)
    selectedKeys.value = [path]
    openKeys.value = [parent]
};

</script>
<style lang="less" scoped>
.ant-layout-sider {
    background-color: transparent !important;
}

:deep(.ant-layout-sider-trigger),
:deep(.ant-layout-sider-zero-width-trigger) {
    display: none;
}

:deep(.ant-menu-item) {
    background-color: transparent;
    border-radius: 0 !important;

    &:hover {
        color: @color-primary !important;
    }
}

:deep(.ant-menu-item-group-title) {
    font-size: 0.8em;
}

:deep(.ant-menu-item-selected) {
    background-color: rgba(92, 126, 229, .1) !important;
    border-radius: 0 !important;
    color: @color-primary;
}

:deep(.ant-menu-inline .ant-menu-sub.ant-menu-inline) {
    background-color: rgba(0, 0, 0, .2) !important;
}

:deep(.ant-menu-item:not(.ant-menu-item-disabled):focus-visible) {
    outline: none;
    background-color: rgba(0, 0, 0, .2);
}

.panel {
    background-color: @bg-blank-light !important;

    .ant-menu-dark {
        background-color: transparent !important;
        min-height: 40vh;
        max-height: calc(100vh - 56px);
        overflow: auto;

        .ant-menu-sub {
            background-color: transparent !important;
        }

        .ant-menu-submenu-title:focus-visible {
            outline: none;
        }
    }
}

.top-logo {
    position: relative;

    .contant {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 55px;
        display: flex;
        align-items: center;
        padding-left: 1.5rem;
    }

    .anticon,
    .logo-text {
        font-size: 1.3rem;
        word-break: keep-all;
    }

    .anticon {
        margin-right: 0.6rem;
    }

    .version {
        margin-left: 0.5rem;
        font-size: 0.8rem;
        margin-top: -0.6rem;
    }
}
</style>