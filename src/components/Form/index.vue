<template>
    <Laoding :loading="loading" noBg tip="">
        <a-form ref="RefForm" v-bind="prop" :model="model" :class="{
            'form-loading' : !Visable,
            'form-readonly' : prop.readonly
        }">
            <template v-for="item of items">
                <!-- {{ item  }} -->
                <a-form-item v-bind="item.options">
                    <template v-if="prop.readonly">
                        {{ ['', undefined, null].includes(model[item.field]) ? '--' : model[item.field] }}
                    </template>
                    <template v-else-if="item.slot">
                        <slot :name="item.slot" :model="model" :option="item"></slot>
                    </template>
                    <template v-else>
                        <a-input v-if="!item.type || item.type == 'text'" v-model:value="model[item.field]" v-bind="item.inputOptions" v-trim />
                        <a-input-number v-else-if="item.type == 'number'" v-model:value="model[item.field]" v-bind="item.inputOptions" v-trim>
                            <template v-if="item.options?.suffix" #addonAfter>{{ item.options?.suffix }}</template>
                        </a-input-number>
                        <a-input-password v-else-if="item.type == 'password'" v-model:value="model[item.field]" v-bind="item.inputOptions"/>
                        <a-textarea v-else-if="item.type == 'textarea'" v-model:value="model[item.field]" v-bind="item.inputOptions"  v-trim/>
                        <a-date-picker v-else-if="item.type == 'date'" v-model:value="model[item.field]" v-bind="item.inputOptions" v-trim/>
                        <a-range-picker v-else-if="item.type == 'date-range'" v-model:value="model[item.field]" v-bind="item.inputOptions" v-trim/>
                        <a-checkbox-group v-else-if="item.type == 'checkbox'" v-model:value="model[item.field]" v-bind="item.inputOptions"/>
                        <a-radio-group v-else-if="item.type == 'radio'" v-model:value="model[item.field]" v-bind="item.inputOptions"/>
                        <a-select v-else-if="item.type == 'select'" v-model:value="model[item.field]" v-bind="item.inputOptions"/>
                        <a-switch v-else-if="item.type == 'switch'" v-model:checked="model[item.field]" v-bind="item.inputOptions"/>
                        <!-- 图片上传 -->
                        <template v-else-if="item.type == 'picture'">
                            <a-upload
                                v-model:file-list="model[item.field]"
                                list-type="picture-card"
                                @preview="handlePreview"
                                v-bind="item.inputOptions"
                            >
                                <div v-if="!model[item.field] || !item.maxLength || model[item.field].length < item.maxLength">
                                    <plus-outlined />
                                    <div style="margin-top: 8px">选择文件</div>
                                </div>
                            </a-upload>
                            <span v-if="item.maxLength" class="upload-tip">最多上传{{item.maxLength}}个图片</span>
                        </template>
                        <!-- 文件上传 -->
                        <template v-else-if="item.type == 'file'">
                            <a-upload
                                v-model:file-list="model[item.field]"
                                list-type="picture"
                                @preview="handlePreview"
                                :class="'file'"
                                v-bind="item.inputOptions"
                            >
                                <div>
                                    <a-button size="small" :disabled="item.inputOptions?.disabled">
                                        选择文件
                                    </a-button>
                                    <span @click.stop v-if="item.maxLength" style="margin-left: 0.5rem;" class="upload-tip">最多上传{{item.maxLength}}个文件</span>    
                                </div>
                            </a-upload>
                        </template>
                        <!-- 富文本编辑 -->
                        <template v-else-if="item.type === 'htmlTextarea'">
                            <Editor v-model:value="model[item.field]" />
                            <template v-if="item.options?.suffix">{{ item.options?.suffix }}</template>
                        </template>
                    </template>
                </a-form-item>
            </template>
            <slot :submit="handelSubmit" :model="model" :loading="loading"></slot>
        </a-form>
    </Laoding>

    <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
</template>
<script setup lang="ts">
import { ref, onBeforeMount, computed, watch } from "vue";
import { useForm } from "@/hooks/useFormModel";
import Laoding from "@/components/Loading/index.vue"
import { PlusOutlined, UploadOutlined } from '@ant-design/icons-vue';
import type { UploadProps } from 'ant-design-vue';
import Editor from "@/components/Editor/index.vue"
import useRequest from "@/hooks/useRequest";

const props = defineProps({
    config: { type: Object, default: () => ({}) },
    formState: { type: Object, default: () => ({}) },
})
const emits = defineEmits(['submit-success', 'update:formState'])

const {
    FormProps: prop,
    FormItems: items,
    FormState: model
} = useForm(props.config, props.config.items as any)
watch(model, () => {
    emits('update:formState', model.value)
}, { immediate: true, deep: true })

const Visable = ref(false)
const loading = computed(() => !Visable.value || props.config.loading)
onBeforeMount(async () => {
    if (props.config.onBeforeMount) {
        await props.config.onBeforeMount()
    }
    Visable.value = true
})


const RefForm = ref<any>(null)
const handelSubmit = async () => {
    try {
        await RefForm.value?.validateFields()
        if (props.config.onSubmit) {
            await props.config.onSubmit(model.value)
        } else if (props.config.api) {
            Visable.value = false
            const { run } = useRequest(props.config.api, {
                manual: true,
                method: 'post',
                defaultParams: () => model.value
            })
            await run()
            emits('submit-success')
        }
        return model.value
    } catch (e) {
        throw '表单验证未通过'
    } finally {
        Visable.value = true
    }
}
defineExpose({
    submit: handelSubmit,
    model: model.value
})


function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
};
const handlePreview = async (file: UploadProps['fileList'][number]) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string;
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};
</script>
<style lang="less" scoped>
    .form-loading{
        filter: blur(3px);
    }
    .form-readonly{
        .ant-form-item{
            pointer-events: none;
        }
        :deep(.ant-upload-select),
        .upload-tip,
        :deep(.btns){
            display: none !important;
        }
        :deep(.ant-form-item){
            .ant-form-item-label >label{
                height: unset;
            }
            .ant-form-item-control-input{
                min-height: unset;
            }
        }
    }
    :deep(.ant-form){
        transition: all 300ms;
        .ant-input-number,
        .ant-select,
        .ant-picker
        {
            width: 100%;
        }
    }
    .file{
        :deep(.ant-upload-list-item){
            height: unset !important;
            padding-top: 1px !important;
            padding-bottom: 1px !important;
            border-radius: 2px !important;
        }
        :deep(.ant-upload-list-item-thumbnail){
            width: 1rem !important;
            height: 1rem !important;
        }
    }
    .upload-tip{
        color: @text-label-color;
        font-size: 0.8rem;
    }
</style>