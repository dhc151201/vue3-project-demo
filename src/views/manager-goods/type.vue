<template>
    <a-card title="商品分类" size="small" :bordered="false">
      <template #extra>
        <ModelFormBtn :config="addConfig">新增</ModelFormBtn>
      </template>
      <DcTable ref="refTable" :columns="columns" :query="query">
        <template #oper="{record}">
          <ModelFormBtn :config="editConfig" size="small" ghost @click="handelEdit(record)">编辑</ModelFormBtn>
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
      { title: "商品分类名称", dataIndex: 'name', },
      { title: "创建时间", dataIndex: 'time', },
      { title: "操作", slot: 'oper', width: 260, align: 'center' },
  ]
  
  const addConfig = ref<ModelFormOptions>({
      title: '新增',
      width: 500,
      api: '/errr',
      onSubmit: async (values) => {
        debugger
      },
      items: [
          {
            label: "商品分类名称",
            field: 'name',
            required: true,
          }
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
  </script>