<template>
    <a-modal v-model:open="visable" :title="config.title" :width="config.width" :footer="null" :maskClosable="false">
        <!-- 表格头部内容 -->
        <slot name="table-header"></slot>
        <Table  ref="refTable" v-bind="$attrs">
            <template v-for="(_value, name) in $slots" #[name]="slotData">
                <slot :name="name" v-bind="slotData || {}" />
            </template>
        </Table>
        <!-- 表格底部内容 -->
        <slot name="table-footer"></slot>
    </a-modal>
</template>
<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import Table from "@/components/Table/index.vue"
import { computed } from "vue";

const props = defineProps({
    config: {
        type: Object,
        default: () => ({})
    },
    open: {
        type: Boolean,
        default: false
    }
})
const emits = defineEmits(['update:open'])
const visable = computed({
    get() {
        return props.open
    },
    set(value: Boolean) {
        emits('update:open', value)
    }
})
const cancel = () => {
    visable.value = false;
}
defineExpose({
    closeModel: () => cancel()
})



const instance: any = getCurrentInstance()
const refTable = ref()
onMounted(() => {
    const entries = Object.entries(refTable.value?.$?.exposed || {})
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
</style>