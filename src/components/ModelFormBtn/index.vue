<template>
    <slot name="btn">
        <a-button type="primary" @click="open = true" v-bind="$attrs">
            <slot></slot>
        </a-button>
    </slot>
    <ModelForm :config="config" v-model:open="open"></ModelForm>
</template>
<script setup lang="ts">
import ModelForm from "@/components/ModelForm/index.vue"
import { ref } from "vue";
const open = ref(false)
const props = defineProps({
    config: {
        type: Object,
        default: () => ({})
    }
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