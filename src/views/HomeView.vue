<script setup lang="ts">
import Form from "@/components/Form/index.vue"

const config = {
  onSubmit: (values: any) => {
    debugger
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
    }
  ]
}
</script>

<template>
  <Form ref="refForm" :config="config">
    <template #default="{submit}">
      <a-button type="primary" @click.prevent="submit">Create</a-button>
    </template>
  </Form>
  
</template>