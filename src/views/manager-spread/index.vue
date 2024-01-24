<template>
  <a-card title="推广员列表" size="small" :bordered="false">
    <template #extra>
      <ModelFormBtn :config="addConfig">新增</ModelFormBtn>
      <BtnExport />
    </template>
    <DcTable :columns="columns">
      <template #oper="{record}">
        <ModelTableBtn size="small" ghost :config="{ title: '资金记录', width: 1100 }" :columns="capitalColumns">资金记录
          <template #oper>
            <a-button type="primary" size="small" ghost danger>删除资金记录</a-button>
          </template>
        </ModelTableBtn>
        <ModelTableBtn size="small" ghost :config="{ title: '充值记录', width: 1100 }" :columns="rechargeColumns">充值记录
          <template #oper>
            <a-button type="primary" size="small" ghost danger>删除充值记录</a-button>
          </template>
        </ModelTableBtn>
      </template>
    </DcTable>
  </a-card>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import type { TableColumns, ModelFormOptions } from "@/types/index"
const columns: TableColumns = [
    { title: "可用余额", dataIndex: 'name', },
    { title: "待提取薪资", dataIndex: 'src' },
    { title: "已提取薪资", dataIndex: 'ss', },
    { title: "上级邀请人", dataIndex: 'time', },
    { title: "操作", slot: 'oper', width: 260, align: 'center' },
]

const capitalColumns: TableColumns = [
    { title: "可用余额", dataIndex: 'name', },
    { title: "待提取薪资", dataIndex: 'abv' },
    { title: "已提取薪资", dataIndex: 'ss', },
    { title: "上级邀请人", dataIndex: 'time', },
    { title: "操作", slot: 'oper', width: 260, align: 'center' },
]

const rechargeColumns: TableColumns = [
    { title: "可用余额", dataIndex: 'name', },
    { title: "待提取薪资", dataIndex: 'abv' },
    { title: "已提取薪资", dataIndex: 'ss', },
    { title: "上级邀请人", dataIndex: 'time', },
    { title: "操作", slot: 'oper', width: 260, align: 'center' },
]
</script>