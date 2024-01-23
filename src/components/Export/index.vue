<template>
    <slot name="btn">
        <a-button type="primary" @click="handelExport" v-bind="$attrs" :loading="loading" :disabled="loading">
            <slot></slot>
        </a-button>
    </slot>
</template>
<script setup lang="ts">
import fileDownload from "js-file-download";
import useRequest from "@/hooks/useRequest";
import { notice } from "@/hooks/useNotice";

const props = defineProps({
    query: {
        type: Object,
        default: () => ({})
    },
    fileName: {
        type: String,
        default: ''
    }
})

const { run, loading } = useRequest('', {
    manual: true,
    method: 'post',
    onSuccess: (res: any) => {
        notice.success('开始下载中, 请在浏览器下载管理中查看下载进度')
        fileDownload(res, props.fileName);
    }
})

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