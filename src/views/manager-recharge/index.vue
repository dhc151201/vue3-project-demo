<template>
  <a-card title="充值列表" size="small" :bordered="false">
    <template #extra>
      <ModelFormBtn :config="addConfig">新增</ModelFormBtn>
      <BtnExport>导出</BtnExport>
    </template>
    <DcTable :columns="columns"></DcTable>
  </a-card>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import BtnExport from "@/components/Export/index.vue"
import type { TableColumns, ModelFormOptions } from "@/types/index"
const columns: TableColumns = [
    { title: "充值金额", dataIndex: 'name', },
    { title: "充值订单号", dataIndex: 'src1', },
    { title: "充值时间", dataIndex: 'ss', },
    { title: "管理员名称", dataIndex: 'time', },
    { title: "管理员ID", dataIndex: 'up_time', },
    { title: "充值推广员账号", dataIndex: 'up_time', },
]

const addConfig = ref<ModelFormOptions>({
    title: '新增',
    width: 400,
    onSubmit: (values) => {
    },
    items: [
      {
        label: "重置金额",
        field: 'name'
      },
      {
        label: "充值账户",
        field: 'src',
      },
    ]
})
const editConfig = ref<ModelFormOptions>({
    ...addConfig.value,
    title: `编辑`,
    model: {},
    onSubmit: (values) => {
      
    }
})

const handelEdit = (record: any) => {
  editConfig.value.model = record
}
</script>