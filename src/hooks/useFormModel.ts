/***
 * 表单模型
 */
import { debounce, isArray, isEmailStr, isFunction, isObject, isString, tryRemoveItemArray } from "@/utils"
import { isRef, ref, watch, computed } from "vue"
import type { Ref, ComputedRef } from "vue"
import type { ModelFormOptions,FormItem, FormOptions, Record, WatchField } from "@/types"
import dayjs from "dayjs"
import useRequest from "./useRequest"
import i18n from "@/i18n"
const { t } = i18n.global;

/**
 * 默认值处理
 * @param item useFormModel表单配置项
 * @param FormOptions FormOptions配置
 * @param FormModel 表单数据
 */
const handelDefaultValue = (item: FormItem, FormOptions: Ref<FormOptions>, FormModel: Ref<Record>) => {
    // 默认表单模型变化，used变化
    watch(() => {
        const model = FormOptions.value.model || {}
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
    // 生成文件信息
    function createPictureFileObj (data: string | string[] | Record | Record[]): any[] {
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
    // 设置默认值函数
    function setDefaultValue() {
        // used 为false，不赋予初始值，如果需要赋予初始值，不显示在表单中，请配置hide: true
        if (
            item.used === false ||
            (isRef(item.used) && item.used?.value === false) ||
            (isFunction(item.used) && (item.used as Function)(FormModel.value) === false)
        ) {
            FormModel.value[item.field] = undefined
            return;
        }

        const model: any = (isRef(FormOptions.value.model) ? FormOptions.value.model.value : FormOptions.value.model) ?? FormModel.value ?? {};
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

        // 被解构的字段
        if (isArray(item.fieldExploded)) { 
            FormModel.value[item.field] = item.fieldExploded?.map((key: string) => {
                return model[key] ?? undefined
            }) || []
            if (FormModel.value[item.field].filter((v: any) => v).length == 0) {
                FormModel.value[item.field] = VALUE ?? undefined
            }
        }
        else if (item.type === 'picture' || item.type === 'file') {
            FormModel.value[item.field] = createPictureFileObj(VALUE) ?? []
        }
        else if (item.type === 'date') {
            FormModel.value[item.field] = VALUE ? VALUE : ''
        }
        else if (item.type === 'date-range') {
            if (Array.isArray(VALUE)) {
                FormModel.value[item.field] = [
                    VALUE[0] ? VALUE[0] : undefined,
                    VALUE[1] ? VALUE[1] : undefined
                ]
            } else {
                FormModel.value[item.field] = []
            }
        }
        else if (['select-multiple', 'checkbox'].includes(item.type as string)) {
            FormModel.value[item.field] = VALUE ?? []
        }
        else if (!['select', 'radio', 'switch'].includes(item.type as string)) {
            FormModel.value[item.field] = VALUE ?? ''
        }
        else {
            FormModel.value[item.field] = VALUE
        }
    }
}

/**
 * 表单项组件，传递的props转换
 * @param item useFormModel表单配置项
 * @param FormOptions FormOptions配置
 */
const handeFormItemProps = (item: FormItem, FormOptions: Ref<FormOptions>) => {
    item.options = Object.assign({
        label: item.label,
        name: item.field,
        required: FormOptions.value.readonly ? false : item.required,
        rules: getValidator()
    }, item.options ?? {})

    if (item.type === 'date' || item.type === 'date-range') {
        item.options.label = `${item.label || ''}（UTC+0）`
    }

    // 验证规则
    function getValidator() {
        return {
            required: item.required,
            validator: (rule: any, value: any) => {
                const TYPE: string = item.type as string;
                const isEmpty: boolean = ['', undefined, null].includes(value);
                if (item.required) {
                    const label = item.label ?? ''
                    // 数组格式
                    if (['select-multiple', 'checkbox', 'date-range', 'picture', 'file'].includes(TYPE)) {
                        if (isEmpty || value?.filter((v: any) => !['', undefined, null].includes(v))?.length == 0) {
                            return Promise.reject(t('select.placeholder') + label)
                        }
                    }
                    // 选择动作
                    else if (['select', 'radio', 'date'].includes(TYPE)) {
                        if (isEmpty) {
                            return Promise.reject(t('select.placeholder') + label)
                        }
                    }
                    // 输入动作
                    else if (isEmpty) {
                        return Promise.reject(t('please_input') + label)
                    }
                }
                
                if (value) {
                    if (item.isEmail && !isEmailStr(value)) {
                        return Promise.reject(t('contract_email_format_error'))
                    }
                    if (item.isInt && value != Math.floor(value)) {
                        return Promise.reject(t('int_value'))
                    }
                    if (item.isNoChinese && /.*[\u4e00-\u9fa5]+.*$/.test(value)) {
                        return Promise.reject(t('name_chinese_not_allowed'))
                    }
                    if (item.isNoSpecial && /(,|\?)/.test(value)) {
                        return Promise.reject(t('no_has_specialchar'))
                    }
                    if (item.minValue !== undefined && value < item.minValue) {
                        return Promise.reject(t('min_value') + item.minValue)
                    }
                    if (item.maxValue !== undefined && value > item.maxValue) {
                        return Promise.reject(t('max_value') + item.maxValue)
                    }
                }
                return Promise.resolve()
            }
        }
    }
}

/**
 * 输入组件，传递的props转换
 * @param item useFormModel表单配置项
 * @param FormOptions FormOptions配置
 */
const handelFormInputProps = (item: FormItem, FormOptions: Ref<FormOptions>, FormModel: Ref<Record>) => {
    const inputOptions = {
        placeholder: FormOptions.value.readonly ? '' : t('please_input'),
        readonly: FormOptions.value.readonly,
        name: item.field,
        maxLength: item.maxLength,
    }
    if (item.type === 'select' || item.type === 'checkbox' || item.type === 'radio') {
        Object.assign(inputOptions, {
            options: item.dic || [],
            placeholder: FormOptions.value.readonly ? '' : t('select.placeholder'),
            showArrow: !FormOptions.value.readonly,
            allowClear: !FormOptions.value.readonly,
        })
    }
    if (item.type === 'picture' || item.type === 'file') {
        Object.assign(inputOptions, {
            action: '',
            accept: item.type === 'picture' ? 'image/*' : '',
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
            placeholder: FormOptions.value.readonly ? '' : (item.type === 'date' ? t('select.placeholder') : ['开始日期', '结束日期']),
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
            unCheckedValue:  item.dic && item.dic[1].value,
            unCheckedChildren:  item.dic && item.dic[1].label
        })
    }

    // 被解构赋值时
    if (isArray(item.fieldExploded)) {
        watch(() => FormModel.value[item.field], (value: any[] = []) => {
            item.fieldExploded?.forEach((key: string, index: number) => {
                FormModel.value[key] = value[index] ?? undefined
            })
        }, {
            immediate: true,
            deep: true
        })
    }

    item.inputOptions = Object.assign(inputOptions, item.inputOptions || {})
}

/**
 * 表单项，处理联动
 * @param item useFormModel表单配置项
 * @param FormOptions FormOptions配置
 * @param FormModel 表单数据
 */
const handelFormWatchField = (item: FormItem, FormOptions: Ref<FormOptions>, FormModel: Ref<Record>) => {
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
export const useForm = (FormOptions: Ref<FormOptions>, propState?: Ref<Record>) => {

    const FormState = ref<{ [key: string]: any }>({})
    if (propState) {
        watch(propState, () => {
            FormState.value = propState.value
        }, {
            immediate: true,
            deep: true
        })
    }
    
    const FormProps = computed(() => {
        return Object.assign(
            (isRef(FormOptions.value.options) ? FormOptions.value.options.value : FormOptions.value.options) ?? {},
            {
                readonly: FormOptions.value.readonly,
                scrollToFirstError: true,
                hideRequiredMark: FormOptions.value.readonly
            }
        )
    })

    const items = computed(() => (FormOptions.value.items?.filter((item: FormItem) => {
        // 不使用
        if (isRef(item.used)) return (item.used as Ref).value;
        if (isFunction(item.used)) return (item.used as Function)(FormState.value)
        if (typeof item.used === 'boolean') return item.used
        // 隐藏
        if (isRef(item.hide)) return !(item.hide as Ref).value;
        if (isFunction(item.hide)) return !(item.hide as Function)(FormState.value)
        if (typeof item.hide === 'boolean') return !item.hide
        return true;
    }) || []).map((item: FormItem) => {
        handelDefaultValue(item, FormOptions, FormState)
        handeFormItemProps(item, FormOptions)
        handelFormInputProps(item, FormOptions, FormState)
        handelFormWatchField(item, FormOptions, FormState)
        return item
    }))

    return {
        FormProps,
        FormItems: items,
        FormState,
    }
}

// 弹窗表单
export const useFormModel = (FormOptions: Ref<ModelFormOptions>) => { 
    return useForm(FormOptions)
}