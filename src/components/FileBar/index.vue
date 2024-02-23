<template>
    <div class="file-bar">
        <template v-if="listType === 'picture'">
            <img v-if="isPicture(file.name)" :src="previewImage" />
            <span class="file-name">{{file.name}}</span>
        </template>
        <EyeOutlined v-if="openPreview && isPicture(file.name)" @click="handlePreview()" />
        <DeleteOutlined  v-if="openDelete" @click="emits('remove', file)" />
        <Loading v-if="openDownload" :loading="downloadLoading" noBg tip="" size="small">
            <DownloadOutlined @click="downloadHandel" style="transform: translateX(-5px);"/>
        </Loading>
    </div>

    <a-modal :open="previewVisible" :zIndex="1060" :width="'unset'" :title="previewTitle" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
</template>
<script setup lang="ts">
import { ref, computed, onBeforeMount, } from "vue"
import { EyeOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import { isPicture } from "@/utils";
import { downloadFile } from "@/hooks/useDownload";

const props = defineProps({
    file: {
        type: Object,
        default: () => ({})
    },
    openPreview: {
        type: Boolean,
        default: true
    },
    openDelete: {
        type: Boolean,
        default: false
    },
    openDownload: {
        type: Boolean,
        default: false
    },
    listType: {
        type: String,
        default: "picture"
    }
})

const emits = defineEmits(['preview', 'remove', 'download'])

const localSrc = ref();
onBeforeMount(async () => {
    if (isPicture(props.file.name) && !props.file.url) {
        localSrc.value = (await getBase64(props.file as File));
    }
})

const {run: downloadFun ,loading: downloadLoading} = downloadFile()
const downloadHandel = () => {
    if (props.file.hash) {
        downloadFun({ hash: props.file.hash })
    } else {
        emits('download', props.file)
    }
}


const previewTitle = computed(() => {
    return props.file.name || props.file.url?.substring(props.file.url?.lastIndexOf('/') + 1) || '';
});
const previewImage = computed(() => {
    return props.file.url || props.file.preview || localSrc.value
})

const previewVisible = ref(false);
const handleCancel = () => previewVisible.value = false;
const handlePreview = () => previewVisible.value = true;

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
</script>
<style lang="less" scoped>
.file-bar{
    display: flex;
    align-items: center;
    width: 100%;
    color: @text-label-color;
    background-color: @bg-blank;
    border-radius: 2px;
    margin-top: 0.5rem;
    padding: 2px 4px;
    img{
        width: 20px;
        height: 20px;
        object-fit: cover;
        margin-right: 0.4rem;
    }
    .file-name{
        flex: 1;
        min-width: 0;
    }
    :deep(.anticon){
        margin-left: 0.8rem;
        &:hover{
            color: @color-primary;
            cursor: pointer;
        }
    }
}
</style>