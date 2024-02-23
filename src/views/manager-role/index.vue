<template>
    <a-card title="角色列表" size="small" :bordered="false">
      <template #extra>
        <ModelFormBtn :config="addConfig">新增</ModelFormBtn>
      </template>
      <DcTable ref="refTable" :columns="columns" :query="query">
        <template #oper="{record}">
          <ModelFormBtn :config="editConfig" size="small" ghost @click="handelEdit(record)">编辑</ModelFormBtn>
          <a-button type="primary" size="small" ghost  @click="handelOpenEmnus(record)">菜单配置</a-button>
          <DelBtn ghost api="" :query="{}"></DelBtn>
        </template>
      </DcTable>
    </a-card>

    <a-modal v-model:open="openEmnus" title="菜单配置">
      <a-tree
        class="mt-1"
        v-model:selectedKeys="selectedKeys"
        v-model:checkedKeys="checkedKeys"
        autoExpandParent
        defaultExpandAll
        checkable
        :tree-data="treeData"
      ></a-tree>
    </a-modal>
  </template>
  <script setup lang="ts">
  import { ref } from "vue";
  import type { TableColumns, ModelFormOptions } from "@/types/index"
  import menus from "@/enums/menus"
  
  const query = ref<{keyword: string}>({keyword: ''})
  const refTable = ref()
  const refreshTable = () => {
    refTable.value?.refresh({page: 1})
  }
  const columns: TableColumns = [
      { title: "角色名称", dataIndex: 'name', },
      { title: "是否超级管理员", dataIndex: 'time', },
      { title: "修改时间", dataIndex: 'up_time', },
      { title: "修改时间", dataIndex: 'up_time', },
      { title: "操作", slot: 'oper', width: 260, align: 'center' },
  ]
  
    const addConfig = ref<ModelFormOptions>({
        title: '新增',
        width: 500,
        api: '/errr',
        onSubmit: (values) => {
            debugger
        },
        items: [
            {
                label: "名称",
                field: 'id',
            }
        ]
    })
  const editConfig = ref<ModelFormOptions>({
      ...addConfig.value,
      title: `编辑`,
      model: {},
      onSubmit: (values) => {
        debugger
      }
  })
  
  const handelEdit = (record: any) => {
    editConfig.value.model = {
      ...record,
      src: record.src
    }
  }

  const openEmnus = ref(false)
  const treeData = menus.map(item => {
    return {
        title: item.label,
        key: item.key,
        children: item.children?.map(item => {
        return {
          title: item.label,
          key: item.key
        }
      })
    }
  })
  const selectedKeys = ref<string[]>([]);
  const checkedKeys = ref<string[]>([]);
  const handelOpenEmnus = (record: any) => {
    openEmnus.value = true;
  }
  </script>