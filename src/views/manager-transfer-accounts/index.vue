<template>
    <a-card title="转账列表" size="small" :bordered="false">
      <template #extra>
        <BtnExport />
      </template>
      <DcTable :columns="columns">
        <template #oper="{record}">
        </template>
      </DcTable>
    </a-card>
  </template>
  <script setup lang="ts">
  import { computed, ref } from "vue";
  import type { TableColumns, ModelFormOptions } from "@/types/index"
  const columns: TableColumns = [
      { title: "转账金额", dataIndex: 'name', },
      { title: "转账时间", dataIndex: 'src' },
      { title: "线下打款时间", dataIndex: 'ss', },
      { title: "到账状态", dataIndex: 'time', },
      { title: "到账时间", dataIndex: 'time', },
      { title: "到账失败原因", dataIndex: 'time', },
      { title: "银行卡账号", dataIndex: 'time', },
      { title: "开户行", dataIndex: 'time', },
      { title: "转账凭证", dataIndex: 'time', },
      { title: "银行转账流水工单号", dataIndex: 'time', },
      { title: "汇款理由", dataIndex: 'time', },
    //   { title: "操作", slot: 'oper', width: 260, align: 'center' },
  ]
  </script>