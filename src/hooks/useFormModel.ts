/***
 * 表单模型
 */
import { isEmailStr, isFunction, isObject } from "@/utils"
import {isRef, ref, watch, computed} from "vue"
import type { Ref } from "vue"
import type { ModelFormOptions,FormItem, FormOptions, Record } from "@/types"

/**
 * 默认值处理
 * @param item useFormModel表单配置项
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
        const model: any = isRef(FormOptions.model) ? FormOptions.model.value : FormOptions.model ?? {};

        if (model[item.field]) {
            FormModel.value[item.field] = model[item.field]
        }
        else if (isFunction(item.defaultValue)) {
            FormModel.value[item.field] = (item.defaultValue as Function)()
        }
        else if (isRef(item.defaultValue)) {
            FormModel.value[item.field] = (item.defaultValue as Ref).value
        }
        else {
            FormModel.value[item.field] = item.defaultValue || ''
        }

        // 图片 or 文件
        if (item.type === 'picture' || item.type === 'file') {
            FormModel.value[item.field] = createPictureFileObj(FormModel.value[item.field])
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
    item.options = Object.assign(item.options || {}, {
        label: item.label,
        name: item.field,
        required: FormOptions.hiddenRequireIcon || item.required,
    })
}

/**
 * 输入组件，传递的props转换
 * @param item useFormModel表单配置项
 * @param FormOptions FormOptions配置
 */
const handelFormInputProps = (item: FormItem, FormOptions: FormOptions) => {
    item.inputOptions = {
        placeholder: "请输入"
    }

    if (item.type === 'picture' || item.type === 'file') {
        Object.assign(item.inputOptions, {
            action: '',
            name: item.field,
            accept: item.type === 'picture' ? 'image/*' : '',
            beforeUpload: (file, fileList) => {
                return false
            }
        }, item.inputOptions)
    }
}

// 表单
export const useForm = (FormOptions: FormOptions, FormItems: FormItem[]) => {

    const FormState = ref<{ [key: string]: any }>({})
    const FormProps = ref<any>([])

    FormProps.value = FormOptions.options

    FormItems?.forEach((item: FormItem) => {
        handelDefaultValue(item, FormOptions, FormState)
        handeFormItemProps(item, FormOptions)
        handelValidator(item)
        handelFormInputProps(item, FormOptions)
    })

    const showForm = ref<boolean>(false)
    const tiggleForm = (visable: boolean) => showForm.value = visable

    return {
        showForm,
        FormProps,
        FormItems: computed(() => FormItems?.filter((item: FormItem) => {
            if (isRef(item.used)) return (item.used as Ref).value;
            if (isFunction(item.used)) return (item.used as Function)(FormState.value)
            if (typeof item.used === 'boolean') return item.used
            return true;
        })) || [],
        FormState,
        tiggleForm
    }
}

// 弹窗表单
export const useFormModel = (FormOptions: ModelFormOptions, FormItems: FormItem[]) => { 
    return useForm(FormOptions, FormItems)
}