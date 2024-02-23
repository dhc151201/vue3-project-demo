<template>
    <a-button type="primary" danger size="small" @click="del" v-bind="$attrs">{{ t('btn.delete') }}</a-button>
</template>
<script setup lang="ts">
import useRequest from "@/hooks/useRequest"
import useConfirm from "@/hooks/useConfirm"
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps({
    api: {
        type: String,
        default: ""
    },
    query: {
        type: Object,
        default: () => ({})
    }
})
const emits = defineEmits(['del-success'])

const { run: delFun } = useRequest(props.api, { manual: true, method: "post" })
const del = async () => {
    await useConfirm(null, { delete: true })
    if (props.api) {
        await delFun(props.query)
    }
    emits('del-success')
}
</script>
<style lang="">
    
</style>