<template>
    <slot name="btn">
        <a-button type="primary" @click="open = true" v-bind="$attrs">
            <slot>上传</slot>
        </a-button>
    </slot>
    <ModelForm :config="config" v-model:open="open"></ModelForm>
</template>
<script setup lang="ts">
import ModelForm from "@/components/ModelForm/index.vue"
import { ref, computed } from "vue";
import type { FormOptions } from "@/types/index"
const open = ref(false)
const props = defineProps({
    title: {
        type: String,
        default: ""
    },
    field: {
        type: String,
        default: 'file'
    },
    maxLength: {
        type: [Number, String],
        default: 1
    },
    
})

const config = computed(():FormOptions => {
    return Object.assign({
        items: [
            {
                field: props.field,
                maxLength: Number(props.maxLength),
                type: 'file',
                required: true,
            }
        ]
    }, props, {
        title: "上传",
    })
})

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