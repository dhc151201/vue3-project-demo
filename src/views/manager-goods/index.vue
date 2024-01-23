<template>
  <a-card title="商品列表" size="small" :bordered="false">
    <template #extra>
      <ModelFormBtn :config="addEditconfig">新增</ModelFormBtn>
      <BtnExport>导出</BtnExport>
    </template>
    <DcTable :columns="columns">
      <template #oper="{record}">
        <a-button type="primary" size="small" ghost>编辑</a-button>
        <a-button type="primary" size="small" ghost>置顶</a-button>
        <a-button type="primary" size="small" ghost>上下架</a-button>
        <a-button type="primary" size="small" ghost danger>删除</a-button>
      </template>
    </DcTable>
  </a-card>
</template>
<script setup lang="ts">
import { computed } from "vue";
import BtnExport from "@/components/Export/index.vue"
import type { TableColumns, ModelFormOptions } from "@/types/index"
const columns: TableColumns = [
    { title: "商品名称", dataIndex: 'name', },
    { title: "商品图片", dataIndex: 'src', picture: true },
    { title: "购买所需积分", dataIndex: 'ss', },
    { title: "创建时间", dataIndex: 'time', },
    { title: "修改时间", dataIndex: 'up_time', },
    { title: "操作", slot: 'oper', width: 260, align: 'center' },
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