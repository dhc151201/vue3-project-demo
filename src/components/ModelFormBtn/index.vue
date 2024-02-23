<template>
    <slot name="btn">
        <a-button type="primary" @click="open = true" v-bind="$attrs">
            <slot></slot>
        </a-button>
    </slot>
    <ModelForm :config="config" :params="params" v-model:open="open" @submit-success="emits('submit-success')" @download="download">
        <template v-for="(_value, name) in $slots" #[name]="slotData">
            <slot :name="name" v-bind="slotData || {}" />
        </template>
    </ModelForm>
</template>
<script setup lang="ts">
import ModelForm from "@/components/ModelForm/index.vue"
import { ref } from "vue";
const open = ref(false)
defineProps({
    config: {
        type: Object,
        default: () => ({})
    },
    params: {
        type: Object,
        default: () => ({})
    },
})

const emits = defineEmits(['submit-success', 'download'])
const download = (file: any) => emits('download', file)
</script>
<style lang="less" scoped>
    .btns{
        display: flex;
        justify-content: end;
        padding-top: 1rem;
    }
    .ant-btn + .ant-btn{
        margin-left: 1rem;
    }
</style>