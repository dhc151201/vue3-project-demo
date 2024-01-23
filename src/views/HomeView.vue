<script setup lang="ts">
import { awaitTime } from "@/utils";

const config = {
  title: "DEMO",
  onBeforeMount: async () => {
    await awaitTime(1000)
  },
  onSubmit: (values: any) => {
    console.log(values)
  },
  items: [
    {
      label: "姓名",
      field: 'name',
      required: true,
      isInt: true,
      defaultValue: 222,
      options: {
        extra: "额外然后问巴博萨发送卡"
      }
    },
    {
      label: "密码",
      field: 'pwd',
      type: 'password',
      options: {
        extra: "额外然后问巴博萨发送卡"
      }
    },
    {
      label: "图片",
      field: 'files',
      type: 'picture',
      maxLength: 2,
      defaultValue: [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }
      ]
    },
    {
      label: "文件",
      field: 'upFiles',
      type: 'file',
      defaultValue: [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }
      ]
    }
  ]
}
</script>

<template>
  <ModelFormBtn :config="config">Open Modal</ModelFormBtn>
  <a-card title="卡片" size="small" :bordered="false">
    <template #extra><a href="#">more</a></template>
    <DcTable></DcTable>
  </a-card>
</template>