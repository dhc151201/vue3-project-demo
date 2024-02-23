<template>
    <div ref="CurrentInstance" class="dc-darpdown-box">
        <a-select ref="refInput" class="dc-select" :class="{ 'empty-options': ($attrs.options as any[] | undefined)?.length === 0 }"
            v-bind="$attrs" :getPopupContainer="getPopupContainer">
            <template v-for="(_value, name) in $slots" #[name]="slotData">
                <slot :name="name" v-bind="slotData || {}" />
            </template>
        </a-select>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'

const instance: any = getCurrentInstance()

const refInput = ref()

const CurrentInstance = ref()
const getPopupContainer = () => {
    return CurrentInstance?.value
}

onMounted(() => {
    const entries = Object.entries(refInput.value?.$?.exposed || {})
    for (const [key, value] of entries) {
        if (!instance.exposed) {
            instance.exposed = {}
        }
        instance.exposed[key] = value
    }
})
</script>
<style lang="less" scoped>
.dc-darpdown-box {
    position: relative;
    display: inline-block;
}

.dc-select {
    width: 100%;
}
.empty-options{
    :deep(.ant-select-selection-item) {
        opacity: 0;
    }
}
</style>