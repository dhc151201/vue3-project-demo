<template>
  <a-card title="商品列表" size="small" :bordered="false">
    <template #extra>
      <ModelFormBtn :config="addConfig">新增</ModelFormBtn>
      <BtnExport>导出</BtnExport>
    </template>
    <DcTable :columns="columns">
      <template #oper="{record}">
        <ModelFormBtn :config="editConfig" size="small" ghost @click="handelEdit(record)">编辑</ModelFormBtn>
        <a-button type="primary" size="small" ghost>置顶</a-button>
        <a-button type="primary" size="small" ghost>上下架</a-button>
        <a-button type="primary" size="small" ghost danger>删除</a-button>
      </template>
    </DcTable>
  </a-card>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
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

const editInfo = ref({})
const addConfig = ref<ModelFormOptions>({
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
})
const editConfig = ref<ModelFormOptions>({
    title: `编辑`,
    width: 1000,
    model: {},
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
})

const handelEdit = (record: any) => {
  editConfig.value.model = {
    ...record,
    src: record.src? [{
      url: record.src,
      name: 'image.png',
      status: 'done',
    }] : undefined
  }
}
</script>