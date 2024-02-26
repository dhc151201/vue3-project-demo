<template>
    <a-card title="系统配置" size="small" :bordered="false">
        <template #extra>
            <ModelFormBtn :config="addConfig">新增</ModelFormBtn>
        </template>
        <DcTable :columns="columns">
          <template #oper="{record}">
            <ModelFormBtn :config="editConfig" size="small" ghost @click="handelEdit(record)">编辑</ModelFormBtn>
          </template>
        </DcTable>
      </a-card>
</template>
<script setup lang="ts">
 import { computed, ref } from "vue";
import type { TableColumns, ModelFormOptions } from "@/types/index"
  const columns: TableColumns = [
      { title: "名称", dataIndex: 'name', },
      { title: "key", dataIndex: 'src' },
      { title: "value", dataIndex: 'ss', },
      { title: "备注", dataIndex: 'time', },
      { title: "操作", slot: 'oper', width: 80, align: 'center' },
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
          label: "名称",
          field: 'name',
          required: true,
       },
       {
          label: "key",
          field: 'type',
          required: true,
        },
        {
          label: "value",
            field: 'jf',
            required: true,
        },
        {
          label: "备注",
          field: 'context',
          type: "textarea"
        },
      ]
})
const editConfig = ref<ModelFormOptions>({
    ...addConfig.value,
    title: `编辑`,
    model: {},
    onSubmit: async (values) => {
      debugger
    }
})

const handelEdit = (record: any) => {
  editConfig.value.model = {
    ...record
  }
}
</script>