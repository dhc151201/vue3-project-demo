<template>
    <slot name="btn">
        <a-button type="primary" @click="handelExport" v-bind="$attrs" :loading="loading" :disabled="loading">
            <slot>{{t('btn.export')}}</slot>
        </a-button>
    </slot>
</template>
<script setup lang="ts">
import { downloadFile } from "@/hooks/useDownload"
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps({
    api: {
        type: String,
        default: ''
    },
    query: {
        type: Object,
        default: () => ({})
    },
    fileName: {
        type: String,
        default: ''
    }
})

const { run, loading } = downloadFile()
const handelExport = () => {
    run(props.query)
}

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