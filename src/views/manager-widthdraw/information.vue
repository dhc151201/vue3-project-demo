<template>
    <a-card title="提现资料管理" size="small" :bordered="false">
      <DcTable ref="refTable" :columns="columns">
      </DcTable>
    </a-card>
  </template>
  <script setup lang="ts">
  import type { TableColumns } from "@/types/index"

  const columns: TableColumns = [
      { title: "真实姓名", dataIndex: 'name', },
      { title: "开户银行", dataIndex: 'src', picture: true },
      { title: "银行卡号", dataIndex: 'ss', },
      { title: "注册系统账号", dataIndex: 'time', },
      { title: "手机号码", dataIndex: 'time', },
  ]
  </script>