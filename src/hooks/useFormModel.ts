/***
 * 表单模型
 */
import { isEmailStr, isFunction } from "@/utils"
import {isRef, ref, watch} from "vue"
import type { Ref } from "vue"

/**
 * 默认值处理
 * @param item useFormModel表单配置项
 * @param FormModel 表单数据
 */
const handelDefaultValue = (item: FormItem, FormOptions: FormOptions, FormModel: Ref<{ [key: string]: any }>) => {

    const setDefaultValue = () => {
        const model = FormOptions.model || {}
        if (isRef(model) && (model as Ref).value[item.field]) {
            FormModel.value[item.field] = FormOptions.model?.value[item.field]
        } else if (model) { 
            FormModel.value[item.field] = (model as { [key: string]: any })[item.field]
        } else if (isFunction(item.defaultValue)) {
            FormModel.value[item.field] = (item.defaultValue as Function)()
        } else if (isRef(item.defaultValue)) {
            FormModel.value[item.field] = (item.defaultValue as Ref).value
        } else {
            FormModel.value[item.field] = item.defaultValue || ''
        }
    }

    // 表单模型变化
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
 * 组件传递的props转换
 * @param item useFormModel表单配置项
 */
const handeFormItemProps = (item: FormItem, FormOptions: FormOptions) => {
    item.options = Object.assign(item.options || {}, {
        label: item.label,
        name: item.field,
        required: FormOptions.hiddenRequireIcon || item.required,
    })
}

// 表单
export const useForm = (FormOptions: FormOptions, FormItems: FormItem[]) => {

    const FormState = ref<{ [key: string]: any }>({})
    const FormProps = ref<any>([])

    FormProps.value = FormOptions.options

    FormItems.forEach((item: FormItem) => {
        handelDefaultValue(item, FormOptions, FormState)
        handeFormItemProps(item, FormOptions)
        handelValidator(item)
    })

    const showForm = ref<boolean>(false)
    const tiggleForm = (visable: boolean) => showForm.value = visable

    return {
        showForm,
        FormProps,
        FormItems,
        FormState,
        tiggleForm
    }
}

// 弹窗表单
export const useFormModel = (FormOptions: FormOptions & {
    width: number,
}, FormItems: FormItem[]) => { 
    return useForm(FormOptions, FormItems)
}

type FormOptions = {
    title?: string | Ref<string> | (() => string),
    loading?: Ref<boolean>,
    // 数据模型，优先级高于defaultValue
    model?: {[key: string]: any} | Ref<{[key: string]: any}>,
    // 是否隐藏必填图标
    hiddenRequireIcon?: boolean,
    // 表单挂载前
    onBeforeMount?: (() => Boolean) | (() => Promise<Boolean>),
    // 表单提交
    onSubmit?: (() => Boolean) | (() => Promise<Boolean>),
    // 将会直接绑定传递给表单组件
    options?: { 
        [key: string]: any
    }
}

type FormItem = {
    label: string | Ref<string> | (() => string),
    field: string,
    required?: boolean,
    type?: 'text' | 'number' | 'radio' | 'select' | 'date' | 'date-range' | 'textarea' | 'checkbox' | 'password', // 表单类型
    dic?: {label: string | Ref<string>, value: string|number|Ref<number>|Ref<string>}[],
    defaultValue?: string | Ref<string> | (() => string), // 默认值
    used?: Ref<boolean> | ((model: { [key: string]: any }) => boolean), // 是否使用
    isEmail?: boolean, // 是否是邮箱
    isInt?: boolean, // 是否是正整数
    isNoChinese?: boolean, // 是否不含中文字符
    isNoSpecial?: boolean, // 是否不含特殊字符
    minValue?: number, // 最小值
    maxValue?: number, // 最大值
    // 将会直接绑定传递给表单组件
    options?: { 
        [key: string]: any
    }
}