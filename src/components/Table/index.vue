<template>
    <a-table :loading="loading" :data-source="dataSource" :columns="columns || TEST.columns" v-bind="$attrs">
        <template #bodyCell="{ text, column, record }">
            <!-- 空值 -->
            <template v-if="[undefined, null, ''].includes(text)">--</template>
            <!-- 自定义插槽 -->
            <slot v-else-if="column.slot" :name="column.slot" :text="text" :column="column" :record="record"></slot>
            <!-- 日期时间 -->
            <template v-else-if="column.date">
                {{ text ? dayjs(text).format(column.dateFormat || 'YYYY-MM-DD') : text }}
            </template>
            <!-- 枚举 -->
            <template v-else-if="column.dic">
                {{ column.dic[text] ?? text }}
            </template>
            <!-- 其他 -->
            <template v-else-if="column.dataIndex">
                {{ text }}
            </template>
        </template>
    </a-table>
</template>
<script lang="ts" setup>
import useRequest from "@/hooks/useRequest"
import type { Record } from "@/types"
import { ref, watch } from "vue"
import dayjs from "dayjs"

const TEST: any = {
    columns: [
        { title: '姓名', dataIndex: 'name' },
        { title: '年龄', dataIndex: 'age' },
        { title: '性别', dataIndex: 'sex', dic: ['女', '男'] },
        { title: '创建日期', dataIndex: 'date',  date: true }
    ],
    data: [
        { name: '张三丰', age: 72, sex: 1, date: 1705990341821 },
        { name: '张三丰', age: 72, sex: 1 },
        { name: '张三丰', age: 72, sex: 0 },
    ]
}

const props = defineProps({
    api: {
        type: String,
        default: ""
    },
    query: {
        type: Object,
        default: () => ({})
    },
    columns: {
        type: Array,
        default: () => undefined
    },
})

const dataSource = ref<any[]>(TEST.data)
const pagination = ref<{ page: number, limit: number, total: number }>({ page: 1, limit: 10, total: 0 })
const { loading, run: getTableData } = useRequest(props.api, {
    manual: true,
    debounceInterval: 300,
    defaultParams: () => Object.assign(pagination.value, props.query),
    onSuccess: (res: any) => {
        dataSource.value = res.data ?? []
        pagination.value.total = res.total ?? 0
    }
})

watch(() => props.query, () => {
    getTableData();
}, {
    immediate: true,
    deep: true
})

defineExpose({
    refresh: (query: Record) => {
        Object.assign(pagination.value, query),
        getTableData(query);
    },
})
</script>
<style lang="less" scoped>
    
</style>