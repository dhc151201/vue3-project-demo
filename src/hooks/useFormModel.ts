/***
 * 表单模型
 */
import { debounce, isArray, isEmailStr, isFunction, isObject, isString } from "@/utils"
import {isRef, ref, watch, computed} from "vue"
import type { Ref } from "vue"
import type { ModelFormOptions,FormItem, FormOptions, Record, WatchField } from "@/types"
import dayjs from "dayjs"
import useRequest from "./useRequest"

/**
 * 默认值处理
 * @param item useFormModel表单配置项
 * @param FormOptions FormOptions配置
 * @param FormModel 表单数据
 */
const handelDefaultValue = (item: FormItem, FormOptions: FormOptions, FormModel: Ref<Record>) => {

    const createPictureFileObj = (data: string | string[] | Record | Record[]): any[] => {
        const result = []
        if (Array.isArray(data)) {
            for (let i = 0; i < data.length; i++){
                result.push(...createPictureFileObj(data[i]))
            }
        } else if(data) {
            if (typeof data === 'string') {
                result.push({
                    url: data
                })
            } else if (isObject(data)) {
                if (!data.url) {
                    throw item.field + ' 图片或文件，默认值缺少url字段'
                }
                result.push(item)
            }
        }
        return result
    }

    const setDefaultValue = () => {
        // used 为false，不赋予初始值
        if (
            item.used === false ||
            (isRef(item.used) && item.used?.value === false) ||
            (isFunction(item.used) && (item.used as Function)(FormModel.value) === false)
        ) {
            FormModel.value[item.field] = undefined
            return;
        }

        const model: any = (isRef(FormOptions.model) ? FormOptions.model.value : FormOptions.model) ?? {};
        // 配置的默认值
        let defaultValue = undefined;
        if (isRef(item.defaultValue)) {
            defaultValue = item.defaultValue.value
        } else if (isFunction(item.defaultValue)) {
            defaultValue = (item.defaultValue as Function)(FormModel.value)
        } else {
            defaultValue = item.defaultValue
        }

        const VALUE = model[item.field] ?? defaultValue;

        if (item.type === 'picture' || item.type === 'file') {
            FormModel.value[item.field] = createPictureFileObj(VALUE)
        }
        else if (item.type === 'date') {
            FormModel.value[item.field] = dayjs(VALUE)
        }
        else if (item.type === 'date-range') {
            if (Array.isArray(VALUE)) {
                FormModel.value[item.field] = [
                    VALUE[0] ? dayjs(VALUE[0]) : undefined,
                    VALUE[1] ? dayjs(VALUE[1]) : undefined
                ]
            } else {
                FormModel.value[item.field] = []
            }
        }
        else if (!['select', 'radio'].includes(item.type as string)) {
            FormModel.value[item.field] = VALUE ?? ''
        }
        else {
            FormModel.value[item.field] = VALUE
        }
    }

    // 默认表单模型变化，used变化
    watch(() => {
        const model = FormOptions.model || {}
        return {
            modelValue: isRef(model) ? (model as Ref).value[item.field] : model[item.field],
            used: isRef(item.used) ? item.used.value : (isFunction(item.used) ? (item.used as Function)(FormModel.value) : null)
        }
    }, () => {
        setDefaultValue()
    }, {
        deep: true,
        immediate: true
    })
}

/**
 * 验证规则
 * @param item useFormModel表单配置项
 */
const handelValidator = (item: FormItem) => {
    if (!item.options) item.options = {}
    
    item.options.rules = {
        required: item.required,
        validator: (rule: any, value: any, callback: any) => {
            if (item.required && ['', undefined, null].includes(value)) {
                if (['select', 'radio', 'checkbox', 'date', 'date-range', 'picture', 'file'].includes(item.type as string)) {
                    return Promise.reject('请选择' + (item.label || {picture: "图片", file: "文件"}[item.type as string]))
                }
                return Promise.reject('请输入' + item.label)
            }
            if (value) {
                if (item.isEmail && !isEmailStr(value)) {
                    return Promise.reject('邮箱格式不正确')
                }
                if (item.isInt && value != Math.floor(value)) {
                    return Promise.reject('只能输入整数')
                }
                if (item.isNoChinese && /.*[\u4e00-\u9fa5]+.*$/.test(value)) {
                    return Promise.reject('不能输入中文')
                }
                if (item.isNoSpecial && /(,|\?)/.test(value)) {
                    return Promise.reject('不能输入特殊字符')
                }
                if (item.minValue !== undefined && value < item.minValue) {
                    return Promise.reject('最小值不能小于' + item.minValue)
                }
                if (item.maxValue !== undefined && value > item.maxValue) {
                    return Promise.reject('最大值不能大于' + item.maxValue)
                }
            }
            return Promise.resolve()
        }
    }
}

/**
 * 表单项组件，传递的props转换
 * @param item useFormModel表单配置项
 * @param FormOptions FormOptions配置
 */
const handeFormItemProps = (item: FormItem, FormOptions: FormOptions) => {
    item.options = ref(Object.assign({
        label: item.label,
        name: item.field,
        required: FormOptions.readonly ? false : item.required,
    }, item.options || {}))
}

/**
 * 输入组件，传递的props转换
 * @param item useFormModel表单配置项
 * @param FormOptions FormOptions配置
 */
const handelFormInputProps = (item: FormItem, FormOptions: FormOptions, FormModel: Ref<Record>) => {
    const inputOptions = {
        placeholder: FormOptions.readonly ? '' : "请输入",
        readonly: FormOptions.readonly,
        name: item.field,
    }
    if (item.type === 'select' || item.type === 'checkbox' || item.type === 'radio') {
        Object.assign(inputOptions, {
            options: item.dic || [],
            placeholder: FormOptions.readonly ? '' : "请选择",
            showArrow: !FormOptions.readonly,
            allowClear: !FormOptions.readonly,
        })
    }
    if (item.type === 'picture' || item.type === 'file') {
        Object.assign(inputOptions, {
            action: '',
            accept: item.type === 'picture' ? 'image/*' : '',
            beforeUpload: () => {
                return Promise.reject('')
            }
        })
        /*
        watch(() => FormModel.value[item.field], () => {
            if (!item.inputOptions) return;
            if (FormModel.value[item.field] && item.maxLength && FormModel.value[item.field].length >= item.maxLength) {
                item.inputOptions.disabled = true
            } else {
                item.inputOptions.disabled = false
            }
        }, {
            immediate: true,
            deep: true
        })
        */
    }
    if (item.type === 'date' || item.type === 'date-range') {
        Object.assign(inputOptions, {
            placeholder: FormOptions.readonly ? '' : (item.type === 'date' ? "请选择" : ['开始日期', '结束日期']),
            inputReadOnly: true,
            format: 'YYYY-MM-DD',
            valueFormat: 'YYYY-MM-DD',
            showToday: false,
        })
    }

    item.inputOptions = ref(Object.assign(inputOptions, item.inputOptions || {}))
}

/**
 * 表单项，处理联动
 * @param item useFormModel表单配置项
 * @param FormOptions FormOptions配置
 * @param FormModel 表单数据
 */
const handelFormWatchField = (item: FormItem, FormOptions: FormOptions, FormModel: Ref<Record>) => {
    if (!item.watchField) return;

    const { run: getRemoteData, cancel: cancelGetRemoteData } = useRequest(item.watchFieldApi ?? '', {
        manual: true,
        onFinally: () => {
            if (item.inputOptions) {
                item.inputOptions.loading = false
                item.inputOptions.disabled = false
            }
        },
    })

    const handelWatchField = debounce((values: Record) => {
        if (item.type && ['select', 'radio', 'checkbox'].includes(item.type)) {
            // 远程数据
            if (item.watchFieldApi && item.inputOptions) {
                // todo实现远程数据拉取, 合并预设请求数据watchFieldData
                let Params: Record = {}
                if (isFunction(item.watchFieldData)) {
                    Params = (item.watchFieldData as Function)(values, item.watchField, FormModel.value)
                } else if (isObject(item.watchFieldData)) {
                    Params = item.watchFieldData ?? {}
                }
                cancelGetRemoteData()
                const res = getRemoteData({ ...Params, ...values })
                // 数据自定义组装
                if (isFunction(item.watchFieldCustomResponse)) {
                    (item.watchFieldCustomResponse as Function)(res, item.inputOptions, FormModel)
                } else {
                    // 公共处理 todo
                }
            }
        }

        if(isFunction(item.watchFieldCallback)) {
            (item.watchFieldCallback as Function)(values, item.inputOptions, FormModel)
        }
    }, 300)

    watch(() => {
        const getResult = (watchField: WatchField) => {
            const result: Record = {}
            try {
                if (isString(watchField)) result[watchField as string] = FormModel.value[watchField as string]
                else if (isArray(watchField)) {
                    for (const key of watchField) {
                        if (isArray(key)) {
                            let _result = FormModel.value;
                            const InnerKey: string = key[-1]
                            for (const _Key of key) { 
                                _result = _result[_Key]
                            }
                            result[InnerKey] = _result
                        } else if (isString(key)) {
                            result[key as string] = FormModel.value[key as string]
                        }
                    }
                }
            } catch (e) { 
                console.warn(e)
            }
            return result
        }
        return getResult(item.watchField as WatchField)
    }, (values: Record) => { 
        handelWatchField(values)
        if (item.inputOptions) {
            item.inputOptions.loading = true
            item.inputOptions.disabled = true
            item.inputOptions.options = []
        }
    }, {
        immediate: item.watchFieldImmediate,
        deep: true
    })
}

// 表单
export const useForm = (FormOptions: FormOptions, FormItems: FormItem[]) => {

    const FormState = ref<{ [key: string]: any }>({})
    const FormProps = computed(() => {
        return Object.assign(
            (isRef(FormOptions.options) ? FormOptions.options.value : FormOptions.options) ?? {},
            { readonly: FormOptions.readonly }
        )
    })

    FormItems?.forEach((item: FormItem) => {
        handelDefaultValue(item, FormOptions, FormState)
        handeFormItemProps(item, FormOptions)
        handelValidator(item)
        handelFormInputProps(item, FormOptions, FormState)
        handelFormWatchField(item, FormOptions, FormState)
    })

    return {
        FormProps,
        FormItems: computed(() => FormItems?.filter((item: FormItem) => {
            // 不使用
            if (isRef(item.used)) return (item.used as Ref).value;
            if (isFunction(item.used)) return (item.used as Function)(FormState.value)
            if (typeof item.used === 'boolean') return item.used
            // 隐藏
            if (isRef(item.hide)) return !(item.hide as Ref).value;
            if (isFunction(item.hide)) return !(item.hide as Function)(FormState.value)
            if (typeof item.hide === 'boolean') return !item.hide
            return true;
        })) || [],
        FormState,
    }
}

// 弹窗表单
export const useFormModel = (FormOptions: ModelFormOptions, FormItems: FormItem[]) => { 
    return useForm(FormOptions, FormItems)
}