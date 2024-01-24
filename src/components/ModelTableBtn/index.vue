<template>
    <slot name="btn">
        <a-button type="primary" @click="open = true" v-bind="$attrs">
            <slot></slot>
        </a-button>
    </slot>
    <ModelTable ref="refModelTable" v-bind="$attrs" :columns="columns" :config="config" v-model:open="open">
        <template v-for="(_value, name) in $slots" #[name]="slotData">
            <slot :name="name" v-bind="slotData || {}" />
        </template>
    </ModelTable>
</template>
<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import ModelTable from "@/components/ModelTable/index.vue"
const open = ref(false)
defineProps({
    config: {
        type: Object,
        default: () => ({})
    },
    columns: {
        type: Array,
        default: undefined
    }
})
defineExpose({
    closeModel: () => open.value = false
})

const instance: any = getCurrentInstance()
const refModelTable = ref()
onMounted(() => {
    const entries = Object.entries(refModelTable.value?.$?.exposed || {})
    for (const [key, value] of entries) {
        if (!instance.exposed) {
            instance.exposed = {}
        }
        instance.exposed[key] = value
    }
})
</script>
<style lang="less" scoped>
    .btns{
        display: flex;
        justify-content: end;
        padding-top: 1rem;
    }
    .ant-btn + .ant-btn{
        margin-left: 1rem;
    }
</style>