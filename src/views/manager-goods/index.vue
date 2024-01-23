<template>
  <a-card title="商品列表" size="small" :bordered="false">
    <template #extra>
      <ModelFormBtn :config="addEditconfig">新增</ModelFormBtn>
    </template>
    <DcTable :columns="columns"></DcTable>
  </a-card>
</template>
<script setup lang="ts">
import { computed } from "vue";
import type { TableColumns, ModelFormOptions } from "@/types/index"
const columns: TableColumns = [
    { title: "商品名称", dataIndex: 'name', },
    { title: "商品图片", dataIndex: 'src', picture: true },
    { title: "购买所需积分", dataIndex: 'ss', },
    { title: "创建时间", dataIndex: 'time', },
    { title: "修改时间", dataIndex: 'up_time', },
]

const addEditconfig = computed((): ModelFormOptions => {
  return {
    title: '新增',
    width: 1000,
    onSubmit: (values) => {
      debugger
     },
    items: [
      {
        label: "商品名称",
        field: 'name'
      },
      {
        label: "商品图片",
        field: 'src',
        type: "picture",
        maxLength: 1
      },
      {
        label: "购买积分",
        field: 'jf',
        type: "number",
        minValue: 0
      },
      {
        label: "商品详情",
        field: 'context',
        type: "htmlTextarea",
        minValue: 0
      },
    ]
  }
})
</script>