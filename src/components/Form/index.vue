<template>
    <!-- {{ model }} -->
    <Laoding :loading="state.loading" noBg :tip="state.loadingTip">
        <a-form ref="RefForm" v-bind="FormProps" :model="model" :class="{
            'form-loading' : state.loading,
            'form-readonly' : FormProps.readonly
        }">
            <template v-for="item of items">
                <!-- {{ item  }}
                {{ getInputOptions(item) }} -->
                <a-form-item v-bind="FormItemProps(item)">
                    <!-- 查看时 -->
                    <template v-if="FormProps.readonly">
                        <template v-if="['', undefined, null].includes(model[item.field])">--</template>
                        <template v-else-if="isArray(model[item.field])">
                            <span v-for="(v, index) of model[item.field]" :key="v">
                                
                                <template v-if="index > 0">
                                    <span v-if="item.type ==='date-range'" class="split-code">~</span>
                                </template>
                                <!-- 多选、单选 -->
                                <template v-if="item.dic">
                                    {{ item.dic?.find((opt: any) => opt.value === v)?.label ?? v ?? '--' }}
                                </template>
                                <template v-else>
                                    {{v ?? '--'}}
                                </template>
                            </span>
                        </template>
                        <template v-else-if="['file', 'picture'].includes(item.type)">
                            <template v-for="file of model[item.field]" :key="file">
                                <file-bar :file="file" openDownload></file-bar>
                            </template>
                        </template>
                        <template v-else-if="isArray(item.dic)">
                            {{ item.dic?.find((opt: any) => opt.value === model[item.field])?.label ?? '--' }}
                        </template>
                        <template v-else>
                            {{model[item.field]}}
                        </template>
                    </template>
                    <!-- 编辑 自定义插槽 -->
                    <template v-else-if="item.slot">
                        <slot :name="item.slot" :model="model" :option="item"></slot>
                    </template>
                    <!-- 编辑 组件 -->
                    <template v-else>
                        <a-input v-if="!item.type || item.type == 'text'" v-model:value="model[item.field]" v-bind="getInputOptions(item)" v-trim v-stopAutocomplete />
                        <a-input-number v-else-if="item.type == 'number'" v-model:value="model[item.field]" v-bind="getInputOptions(item)" v-trim>
                            <template v-if="item.options?.suffix" #addonAfter>{{ item.options?.suffix }}</template>
                        </a-input-number>
                        <a-input-password v-else-if="item.type == 'password'" v-model:value="model[item.field]" v-bind="getInputOptions(item)" v-stopAutocomplete />
                        <a-textarea v-else-if="item.type == 'textarea'" v-model:value="model[item.field]" v-bind="getInputOptions(item)"  v-trim v-stopAutocomplete />
                        <a-date-picker v-else-if="item.type == 'date'" v-model:value="model[item.field]" v-bind="getInputOptions(item)" v-trim/>
                        <a-range-picker v-else-if="item.type == 'date-range'" v-model:value="model[item.field]" v-bind="getInputOptions(item)" v-trim/>
                        <a-checkbox-group v-else-if="item.type == 'checkbox'" v-model:value="model[item.field]" v-bind="getInputOptions(item)"/>
                        <a-radio-group v-else-if="item.type == 'radio'" v-model:value="model[item.field]" v-bind="getInputOptions(item)"/>
                        <dc-select v-else-if="item.type == 'select' || item.type == 'select-multiple'" v-model:value="model[item.field]" v-bind="getInputOptions(item)"/>
                        <a-switch v-else-if="item.type == 'switch'" v-model:checked="model[item.field]" v-bind="getInputOptions(item)"/>
                        <!-- 图片文件上传 -->
                        <template v-else-if="item.type == 'picture' || item.type == 'file'">
                            <Upload 
                                :item="item" 
                                v-model:value="model[item.field]"
                                v-model:remove="model[item.field+'_removes']"
                                :readonly="FormProps.readonly"
                                @download="download"
                            ></Upload>
                            <template v-if="item.options?.suffix">{{ item.options?.suffix }}</template>
                        </template>
                        <!-- 富文本编辑 -->
                        <template v-else-if="item.type === 'htmlTextarea'">
                            <Editor v-model:value="model[item.field]" />
                            <template v-if="item.options?.suffix">{{ item.options?.suffix }}</template>
                        </template>
                    </template>
                </a-form-item>
            </template>
            <slot :submit="handelSubmit" :model="model" :loading="state.loading" name="footer">
                <!-- <a-button :disabled="state.loading" type="primary" @click.prevent.stop="handelSubmit">保存</a-button> -->
            </slot>
        </a-form>
    </Laoding>
</template>
<script lang="ts" setup>
import { reactive, computed, watch, watchEffect } from 'vue'
import { isRef, ref, onBeforeMount, type Ref } from 'vue'
import FileBar from "@/components/FileBar/index.vue"
import Laoding from "@/components/Loading/index.vue"
import Editor from "@/components/Editor/index.vue"
import Upload from './../Upload/index.vue'
import useUpload from "@/hooks/useUpload"
import useRequest from "@/hooks/useRequest"
import { notice } from "@/hooks/useNotice"
import { $t } from '@/hooks/useLang'
import { isArray, isFunction, diffFiles } from '@/utils'
import type { Record, FormItem } from "@/types"
import { getValidator } from "./index"
const props = defineProps({
    config: { type: Object, default: () => ({}) },
    formState: { type: Object, default: undefined },
    params: { type: Object, default: () => ({}) }, // 表单提交的额外数据
})
const emits = defineEmits(['submit-success', 'update:formState', 'download'])

const state = reactive({
    loading: false,
    loadingTip: '',
    provideState : {}
})
onBeforeMount(async () => {
    addEventItem()
    resolveWatchField()
    await runOnBeforeMount()
    setDefaultValue()
    
    if (props.formState) {
        watch(() => props.formState, (value) => {
            Object.assign(model.value, value || {})
        }, { immediate: true, deep: true })
    } else if (isRef(props.config.model)) {
        watch(() => props.config.model?.value, (value) => {
            Object.assign(model.value, value || {})
        }, { immediate: true, deep: true })
    } else if (props.config.model) {
        Object.assign(model.value, props.config.model || {})
    }
})

const model = ref<Record>({})
onBeforeMount(() => {
    watch(() => model.value, (value) => {
        if (isFunction(props.config.onChange)) {
            props.config.onChange(value)
        }
        if(!value) return
        emits("update:formState", value)
    }, { immediate: true, deep: true })
})
// 表单项
const items = computed(() => props.config.items.filter((item: FormItem) => {
    // 不使用
    let used = null
    if (isRef(item.used)) used = item.used.value;
    if (isFunction(item.used)) used =  (item.used as Function)(model.value)
    if (typeof item.used === 'boolean') used = item.used
    if (used === false) {
        model.value[item.field] = undefined
        return false
    }
    // 隐藏
    let hide = null
    if (isRef(item.hide)) hide = item.hide.value;
    if (isFunction(item.hide)) hide =  (item.hide as Function)(model.value)
    if (typeof item.hide === 'boolean') hide = item.hide
    if (hide === true) {
        model.value[item.field] = item.defaultValue
        return false
    }
    return true;
}))
// 绑定在表单组件的属性
const FormProps = computed(() => {
    return Object.assign((isRef(props.config.options) ? props.config.options.value : props.config.options) ?? {},
        {
            readonly: props.config.readonly,
            scrollToFirstError: true,
            hideRequiredMark: props.config.readonly
        }
    )
})
// 绑定在表单项组件上的属性
const FormItemProps = computed(() => (item: FormItem) => {
    const option =  Object.assign({
        label: item.label,
        name: item.field,
        required: FormProps.value.readonly ? false : item.required,
        rules: getValidator(item)
    }, item.options ?? {})

    if (item.label && ['date', 'date-range'].includes(item.type || '')) {
        option.label = `${item.label || ''}（UTC+0）`
    }
    return option;
})
// 绑定在表单输入组件上的属性
function getInputOptions(item: FormItem) {
    const inputOptions = {
        placeholder: FormProps.value.readonly ? '' : '请输入',
        readonly: FormProps.value.readonly,
        name: item.field,
        maxLength: item.maxLength,
    }
    if (item.type === 'select' || item.type === 'checkbox' || item.type === 'radio') {
        Object.assign(inputOptions, {
            options: item.dic || [],
            placeholder: FormProps.value.readonly ? '' : '请选择',
            showArrow: !FormProps.value.readonly,
            allowClear: !FormProps.value.readonly,
        })
    }
    if (item.type === 'picture' || item.type === 'file') {
        Object.assign(inputOptions, {
            action: '',
            accept: item.type === 'picture' ? 'image/*' : '',
        })
    }
    if (item.type === 'date' || item.type === 'date-range') {
        Object.assign(inputOptions, {
            placeholder: FormProps.value.readonly ? '' : (item.type === 'date' ? '请选择' : ['开始日期', '结束日期']),
            inputReadOnly: true,
            format: 'YYYY-MM-DD',
            valueFormat: 'YYYY-MM-DD',
            showToday: false,
        })
    }

    if (item.type === 'switch') {
        Object.assign(inputOptions, {
            checkedValue: item.dic && item.dic[0].value,
            checkedChildren: item.dic && item.dic[0].label,
            unCheckedValue: item.dic && item.dic[1].value,
            unCheckedChildren: item.dic && item.dic[1].label
        })
    }

    return { ...inputOptions, ...item.inputOptions }
}
// 监控字段值处理，进行数据转换
function resolveWatchField() {
    props.config.items.forEach((item: FormItem) => {
        // 被解构赋值时
        if (isArray(item.fieldExploded)) {
            watch(() => model.value[item.field], (value: any[] = []) => {
                item.fieldExploded?.forEach((key: string, index: number) => {
                    model.value[key] = value ? value[index] : undefined
                })
            }, {
                immediate: true,
                deep: true
            })
        }
    })
}

const RefForm = ref<any>(null)
const handelSubmit = async () => {
    try {
        await RefForm.value?.validateFields()
        await checkLocalUploadFileChanged()
        state.loading = true

        const data = Object.assign({ ...props.params }, { ...model.value });
        tryFieldExploded(data)
        await uploadLocalFiles(data)
        state.loadingTip = '数据提交保存中...'
        // 数据提交
        if (props.config.onSubmit) {
            await props.config.onSubmit(data)
            if(props.config.onSuccess) await props.config.onSuccess()
            notice.success("提交成功")
            emits('submit-success')
        } else if (props.config.api) {
            const { run } = useRequest(props.config.api, {
                manual: true,
                method: 'post',
            })
            await run(data)
            if(props.config.onSuccess) await props.config.onSuccess()
            notice.success("提交成功")
            emits('submit-success')
        }
        return data
    } catch (e) {
        throw '表单验证未通过'
    } finally {
        state.loading = false
    }
}
defineExpose({
    submit: handelSubmit,
    model: model.value
})

const download = (file: any) => emits('download', file)

/**
 * 运行挂载前函数
 */
async function runOnBeforeMount() {
    if (!props.config.onBeforeMount) return

    state.loadingTip = "数据读取中..."
    state.loading = true
    await props.config.onBeforeMount(props.params)
    state.loading = false
}
/**
 * 设置默认值
 */
function setDefaultValue () {
    props.config.items.forEach((item: FormItem) => {
        if (isRef(item.defaultValue)) {
            watch(() => (item.defaultValue as Ref).value, (value) => {
                model.value[item.field] = value
            }, { immediate: true })
        } else if (isFunction(item.defaultValue)) {
            model.value[item.field] = (item.defaultValue as Function)(model.value)
        } else {
            model.value[item.field] = item.defaultValue
        }
    })
}
/**
 * 绑定表单项配置的onChange事件
 */
function addEventItem() {
    props.config.items.forEach((item: FormItem) => { 
        if (isFunction(item.onChange)) {
            watch(() => model.value[item.field], (value) => {
                (item.onChange as Function)(value, model)
            })
        }
    })
}
/***
 * 校验文件内容是否有变动
 */
async function checkLocalUploadFileChanged () {
    const files: File[] = []
    items.value?.filter((item: FormItem) => item.type === 'file' || item.type === 'picture')?.map((item: FormItem) => item.field)?.map((field: string) => {
        files.push(...model.value[field])
    })
    const localChangeFiles = await diffFiles(files as any[])
    if (localChangeFiles) {
        notice.error(`${localChangeFiles.map(v => v.name).join("、")} 文件异常，请重新选择上传`)
        return Promise.reject('')
    }
    return Promise.resolve()
}
/**
 * 本地文件上传 + 上传数据转换
 */
async function uploadLocalFiles(data: Record) {
    const FileItems = props.config.items.filter((v: FormItem) => v.type === 'file' || v.type === 'picture')
    if (FileItems) {
        for (const item of FileItems) {
            // 当前表单项的本地文件
            for (let i = 0; i < data[item.field].length; i++){
                const citem = data[item.field][i]
                if (citem.size) {
                    state.loadingTip = `文件上传中，请稍后.`
                    await useUpload(citem).then(([res]: any[]) => {
                        data[item.field][i] = res.data.hash
                    })
                } else {
                    data[item.field][i] = citem.hash
                }
            }
            // 数据转换成hash逗号相隔的字符串值
            // data[item.field] = data[item.field].join(',')
        }
    }
}
/***
 * 移除需要解构分解字段的字段
 */
function tryFieldExploded(data: Record) {
    const removeFieldItems = props.config.items.filter((v: FormItem) => v.fieldExploded)
    if (removeFieldItems) {
        removeFieldItems.forEach((item: FormItem) => {
            delete data[item.field]
        })
    }
}
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
    :deep(.split-code){
        opacity: 0.6;
        padding: 0 0.5rem;
    }
}
:deep(.ant-form){
    transition: all 300ms;
    .ant-input-number,
    .dc-darpdown-box,
    .ant-select,
    .ant-picker
    {
        width: 100%;
    }
}
:deep(.ant-spin){
    .ant-spin-text{
        text-shadow: none !important;
        color: @text-label-color;
    }
    
}
</style>