<template>
    <a-card title="账户列表" size="small" :bordered="false">
      <template #extra>
        <a-input-search
          v-model:value="query.keyword"
          placeholder="账户名称"
          enter-button
          @search="refreshTable"
        />
        <ModelFormBtn :config="addConfig">新增</ModelFormBtn>
      </template>
      <DcTable ref="refTable" :columns="columns" :query="query">
        <template #oper="{record}">
          <ModelFormBtn :config="editConfig" size="small" ghost @click="handelEdit(record)">重置密码</ModelFormBtn>
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
      { title: "账号", dataIndex: 'name', },
      { title: "创建时间", dataIndex: 'time', },
      { title: "修改时间", dataIndex: 'up_time', },
      { title: "操作", slot: 'oper', width: 260, align: 'center' },
  ]
  
    const addConfig = ref<ModelFormOptions>({
        title: '新增',
        width: 500,
        api: '/errr',
        options: { labelCol: {span: 4} },
        onSubmit: async (values) => {
            debugger
        },
        items: [
            {
                label: "账号",
                field: 'name',
                required: true
            },
            {
                label: "密码",
                field: 'name',
                type: "password",
                required: true
            },
            {
                label: "确认密码",
                field: 'name',
                type: "password",
                required: true
            },
        ]
    })
  const editConfig = ref<ModelFormOptions>({
      ...addConfig.value,
      title: `重置密码`,
      model: {},
      onSubmit: async (values) => {
        debugger
      }
  })
  
  const handelEdit = (record: any) => {
    editConfig.value.items[0].inputOptions = {
      disabled: true
    }
    editConfig.value.items[1].label = "重置密码"
    editConfig.value.model = {
      ...record
    }
  }
  </script>