<template>
  <a-card title="订单列表" size="small" :bordered="false">
    <template #extra>
      <a-input v-model:value="query.user" placeholder="会员账号" />
      <a-input v-model:value="query.user" placeholder="会员手机号" />
      <a-input v-model:value="query.user" placeholder="推广员账号" />
      <a-date-picker v-model:value="query.user" placeholder="下单时间" class="date" />
      <a-input v-model:value="query.user" placeholder="订单号" />
      <a-input v-model:value="query.user" placeholder="物流单号" />
      <a-button @click="refreshTable" type="primary">搜索</a-button>
      <BtnExport />
    </template>
    <DcTable ref="refTable" :columns="columns">
      <template #oper="{record}">
        <BtnExport :query="record" />
      </template>
    </DcTable>
  </a-card>
</template>
<script setup lang="ts">
import { ref } from "vue";
import type { TableColumns } from "@/types/index"

const query = ref<{[key: string]: any}>({keyword: ''})
const refTable = ref()
const refreshTable = () => {
  refTable.value?.refresh({page: 1})
}
const columns: TableColumns = [
    { title: "订单号", dataIndex: 'name', },
    { title: "下单人账号", dataIndex: 'src22' },
    { title: "下单人手机号", dataIndex: 'ss', },
    { title: "下单抵扣积分", dataIndex: 'time', },
    { title: "商品数量", dataIndex: 'up_time', },
    { title: "下单抵扣总积分", dataIndex: 'up_time', },
    { title: "邀请人", dataIndex: 'up_time', },
    { title: "创建时间", dataIndex: 'up_time', },
    { title: "是否发货", dataIndex: 'up_time', },
    { title: "物流单号", dataIndex: 'up_time', },
    { title: "物流公司", dataIndex: 'up_time', },
    { title: "操作", slot: 'oper', width: 140, align: 'center' },
]
</script>
<style lang="less" scoped>
  .date :deep(input){
    width: 140px;
  }
</style>