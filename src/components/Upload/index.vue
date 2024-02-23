<template>
    <!-- 图片上传 -->
    <template v-if="item.type == 'picture'">
        <a-upload
            v-model:file-list="model"
            list-type="picture-card"
            :disabled="disabled"
            :beforeUpload="beforeUpload"
            v-bind="item.inputOptions"
        >
            <div v-if="!disabled">
                <plus-outlined />
                <div style="margin-top: 8px">选择文件</div>
            </div>
        </a-upload>
        <span v-if="item.maxLength" class="upload-tip">最多上传{{item.maxLength}}个图片</span>
    </template>
    <!-- 文件上传 -->
    <template v-if="item.type == 'file'">
        <a-upload
            list-type="picture"
            :showUploadList="false"
            :disabled="disabled"
            :beforeUpload="beforeUpload"
            v-bind="item.inputOptions"
        >
            <div class="chose-file-bar">
                <a-button size="small" type="primary" :disabled="disabled">
                    选择文件
                </a-button>
                <span @click.stop v-if="item.maxLength" style="margin-left: 0.5rem;" class="upload-tip">最多上传{{item.maxLength}}个文件</span>    
            </div>
        </a-upload>
        <div @click.stop>
            <FileBar 
                v-for="file of model"
                :key="(file as any).name"
                :file="(file as any)" 
                :open-delete="!readonly" 
                :open-download="!!readonly"
                listType="picture" 
                @remove="handelRemove" 
                @download="download"
            ></FileBar>
        </div>
    </template>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
// import { PlusOutlined } from '@ant-design/icons-vue';
import FileBar from "@/components/FileBar/index.vue"
import { notice } from '@/hooks/useNotice';
import { $t } from '@/hooks/useLang';

const props = defineProps({
    readonly: {
        type: Boolean,
        default: undefined
    },
    item: {
        type: Object,
        default: ()=> ({})
    },
    value: {
        type: Array,
        default: undefined
    }
})
const emits = defineEmits(['update:value', 'update:remove', 'download'])
const model = computed(() => props.value || [])
const disabled = computed(() => props.item.maxLength && model.value.length >= props.item.maxLength)

const beforeUpload = (file: File, fileList: File[]) => {
    if (model.value && model.value.find((v: any) => v.name === file.name)) {
        notice.warning('相同的文件名上传')
    } else {
        emits('update:value', model.value.concat([file]))
    }
    return Promise.reject('')
}

const removeFiles = ref<any[]>([])
const handelRemove = (file: any) => {
    const newValue = model.value.filter(v => v!== file)
    emits('update:value', newValue?.length ? newValue : undefined)
    // 已上传过得文件进行移除
    if (file.url) {
        removeFiles.value.push(file)
        emits('update:remove', removeFiles.value)
    }
}

const download = (file: any) => emits('download', file)
</script>
<style lang="less" scoped>
.chose-file-bar{
    min-height: 32px;
    padding-top: 4px;
    .upload-tip{
        opacity: 0.9;
        font-size: 0.8rem;
    }
}
.no-event{
    :deep(.ant-upload){
        pointer-events: none;
        .ant-btn{
            opacity: 0.5;
        }
    }
}
</style>