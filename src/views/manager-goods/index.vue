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
        <ModelFormBtn :config="editConfig" size="small" ghost @click="handelEdit(record)">编辑</ModelFormBtn>
        <a-button type="primary" size="small" ghost>置顶</a-button>
        <a-button type="primary" size="small" ghost>上下架</a-button>
        <a-button type="primary" size="small" ghost danger>删除</a-button>
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
    { title: "操作", slot: 'oper', width: 260, align: 'center' },
]

const addConfig = ref<ModelFormOptions>({
    title: '新增',
    width: 1000,
    api: '/errr',
    // onSubmit: (values) => {
    //   debugger
    // },
  items: [
      {
        label: "id",
        field: 'id',
        hide: true
      },
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
        label: "文件",
        field: 'filefs',
        type: "file",
        maxLength: 3
      },
      {
        label: "日期",
        field: 'date',
        type: "date",
      },
      {
        label: "日期范围",
        field: 'daterange',
        type: "date-range",
      },
      {
        label: "切换",
        field: 'a',
        type: "switch",
      },
      {
        label: "复选",
        field: 'b',
        type: "checkbox",
        dic: [
          { label: "姓名", value: 1 }, 
          { label: "性别", value: 2 }, 
        ]
      },
      {
        label: "单选",
        field: 'c333',
        type: "radio",
        dic: [
          { label: "姓名", value: 1 }, 
          { label: "性别", value: 2 }, 
        ]
      },
      {
        label: "购买积分",
        field: 'jf',
        type: "select",
        dic: [
          { label: "姓名", value: 1 }, 
          { label: "性别", value: 2 }, 
        ]
      },
      {
        label: "商品详情",
        field: 'context',
        type: "htmlTextarea",
        used: false
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
    ...record,
    src: record.src
  }
}
</script>