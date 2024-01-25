<template>
    <a-card title="提现管理" size="small" :bordered="false">
      <template #extra>
        <Form :config="SearchStateConfig" v-model:form-state="SearchModel"></Form>
        <a-button @click="refreshTable" type="primary">搜索</a-button>
        <BtnExport />
      </template>
      {{ SearchModel }}
      <DcTable ref="refTable" :columns="columns" :query="query">
        <template #oper="{record}">
            <ModelFormBtn :config="tranConfig" size="small" ghost>转账成功</ModelFormBtn>
            <ModelFormBtn :config="viewConfig" size="small" ghost @click="handelEdit(record)">详情</ModelFormBtn>
        </template>
      </DcTable>
    </a-card>
  </template>
  <script setup lang="ts">
  import { ref } from "vue";
  import Form from "@/components/Form/index.vue"
  import type { TableColumns, ModelFormOptions, FormOptions } from "@/types/index"

  const SearchModel = ref({name: 1})
  const statusOptions = [
        { label: "待审核", value: 0 }, 
        { label: "审核拒绝", value: 1 }, 
        { label: "待审通过", value: 2 }, 
  ]
  const SearchStateConfig = ref<FormOptions>({
    options: { layout: 'inline' },
    items: [
      { field: "user", inputOptions: { placeholder: "会员账号" } },
      { field: "phone", inputOptions: { placeholder: "会员手机号" } },
      { field: "account", inputOptions: { placeholder: "推广员账号" },  },
      { field: "date", inputOptions: { placeholder: "提现申请时间" }, type: 'date' },
      { field: "order", inputOptions: { placeholder: "提现订单号" } },
      { field: "status", inputOptions: { placeholder: "提现状态" }, type: "select", dic: statusOptions },
    ]
  })
 
  const query = ref({})
  const refTable = ref()
  const refreshTable = () => {
      query.value = { ...SearchModel.value }
    refTable.value?.refresh({page: 1})
  }
  const columns: TableColumns = [
      { title: "提现金额", dataIndex: 'name', },
      { title: "提现申请时间", dataIndex: 'src', picture: true },
      { title: "提现申请账号", dataIndex: 'ss', },
      { title: "提现订单号", dataIndex: 'time', },
      { title: "提现金额", dataIndex: 'time', },
      { title: "提现杠杆比例", dataIndex: 'time', },
      { title: "纳税比例", dataIndex: 'time', },
      { title: "平台固定门槛比例", dataIndex: 'up_time', },
      { title: "操作", slot: 'oper', width: 180, align: 'center' },
  ]
  
  const viewConfig = ref<ModelFormOptions>({
      title: '详情',
      width: 1000,
      readonly: true,
      options: {
        labelCol: {span: 3}
      },
      items: columns.slice(0, -1).map(v => {
            return {
                label: v.title,
                field: v.dataIndex
            }
      }).concat([
            {
                label: '真实姓名',
                field: 'ee'
            },
            {
                label: '开户银行',
                field: 'ee'
            },
            {
                label: '银行卡号',
                field: 'ee'
            },
            {
                label: '提现金额',
                field: 'ee'
            },
      ]) as any
  })
  const handelEdit = (record: any) => {
    viewConfig.value.model = record
  }

  const tranConfig = ref<ModelFormOptions>({
        title: '提现结果',
        options: {
            labelCol: {span: 5}
        },
        items: [
            {
                label: "是否成功",
                required: true,
                field: "result",
                type: "radio",
                dic: [
                      { label: "成功", value: 0 },
                      { label: "失败", value: 1 }
                ],
                defaultValue: 1
            },
            {
                label: "失败原因",
                required: true,
                field: "note",
                type: "textarea",
                used: (model: any) => model.result === 1
            }
        ]
  })
  </script>
  <style lang="less" scoped>
  .date :deep(.ant-select-selector),
  .date :deep(input){
    width: 140px !important;
  }
</style>