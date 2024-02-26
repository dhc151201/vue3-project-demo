<template>
  <a-card title="商品列表" size="small" :bordered="false">
    <template #extra>
      <a-input-search
        v-model:value="query.keyword"
        placeholder="商品名称"
        enter-button
        @search="refreshTable"
      />
      <ModelUploadBtn />
      <ModelFormBtn :config="addConfig">新增</ModelFormBtn>
      <BtnExport />
    </template>
    <DcTable ref="refTable" :columns="columns" :query="query">
      <template #oper="{record}">
        <ModelFormBtn :config="editConfig" size="small" ghost @click="handelDetail(record)">详情</ModelFormBtn>
        <ModelFormBtn :config="editConfig" size="small" ghost @click="handelEdit(record)">编辑</ModelFormBtn>
        <a-button type="primary" size="small" ghost>置顶</a-button>
        <a-button type="primary" size="small" ghost>上下架</a-button>
        <DelBtn ghost api="" :query="{}"></DelBtn>
      </template>
    </DcTable>
  </a-card>
</template>
<script setup lang="ts">
import { ref } from "vue";
import type { TableColumns, ModelFormOptions } from "@/types/index"

const query = ref<{keyword: string}>({keyword: ''})
const refTable = ref()
const refreshTable = () => {
  refTable.value?.refresh({page: 1})
}
const columns: TableColumns = [
    { title: "商品名称", dataIndex: 'name', },
    { title: "商品图片", dataIndex: 'src', picture: true },
    { title: "购买所需积分", dataIndex: 'ss', },
    { title: "创建时间", dataIndex: 'time', },
    { title: "修改时间", dataIndex: 'up_time', },
    { title: "操作", slot: 'oper', width: 340, align: 'center' },
]

const addConfig = ref<ModelFormOptions>({
    title: '新增',
    width: 1000,
    api: '/errr',
    onSubmit: async (values) => {
      debugger
    },
    items: [
        {
          label: "商品名称",
          field: 'name',
          required: true,
       },
       {
          label: "商品类型",
          field: 'type',
          type: "select",
          dic: [],
          required: true,
        },
        {
          label: "商品图片",
          field: 'src',
          type: "picture",
          required: true,
          // defaultValue: [
          //   {
          //     status: 'done',
          //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          //   }
          // ]
        },
        {
          label: "所需积分",
          field: 'jf',
          type: "number",
        },
        {
          label: "商品详情",
          field: 'context',
          type: "htmlTextarea"
        },
      ]
})
const editConfig = ref<ModelFormOptions>({
    ...addConfig.value,
    title: `编辑`,
    readonly: true,
    model: {},
    onSubmit: (values) => {
      debugger
    }
})

const handelEdit = (record: any) => {
  editConfig.value.readonly = false
  editConfig.value.model = {
    ...record
  }
}

const detailConfig = ref<ModelFormOptions>({
    ...addConfig.value,
    title: `详情`,
    readonly: true,
    model: {},
})
const handelDetail = (record: any) => {
  detailConfig.value.model = {
    ...record
  }
}
</script>