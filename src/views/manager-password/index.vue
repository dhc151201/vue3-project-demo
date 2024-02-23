<template>
    <ModelForm v-model:open="open" :config="addConfig"></ModelForm>
</template>
<script setup lang="ts">
import { ref } from "vue";
import type { ModelFormOptions } from "@/types/index"
const open = ref(true)
const addConfig = ref<ModelFormOptions>({
    title: '密码修改',
    width: 600,
    api: '/errr',
    options: { labelCol: { span: 5 } },
    onSubmit: async (values) => {
        debugger
    },
    items: [
        {
            label: "账号",
            field: 'id',
            required: true
        },
        {
            label: "重置密码",
            field: 'name',
            type: "password",
            required: true
        },
        {
            label: "确认重置密码",
            field: 'name',
            type: "password",
            required: true
        },
    ]
})
</script>