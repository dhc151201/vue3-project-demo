import { $t } from "@/hooks/useLang";
import type { FormItem } from "@/types";
import { isEmailStr } from "@/utils";

// 验证规则
export function getValidator(item: FormItem) {
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
                        return Promise.reject($t('select.placeholder') + label)
                    }
                }
                // 选择动作
                else if (['select', 'radio', 'date'].includes(TYPE)) {
                    if (isEmpty) {
                        return Promise.reject($t('select.placeholder') + label)
                    }
                }
                // 输入动作
                else if (isEmpty) {
                    return Promise.reject($t('please_input') + label)
                }
            }
        
            if (value) {
                if (item.isEmail && !isEmailStr(value)) {
                    return Promise.reject($t('contract_email_format_error'))
                }
                if (item.isInt && value != Math.floor(value)) {
                    return Promise.reject($t('int_value'))
                }
                if (item.isNoChinese && /.*[\u4e00-\u9fa5]+.*$/.test(value)) {
                    return Promise.reject($t('name_chinese_not_allowed'))
                }
                if (item.isNoSpecial && /(,|\?)/.test(value)) {
                    return Promise.reject($t('no_has_specialchar'))
                }
                if (item.minValue !== undefined && value < item.minValue) {
                    return Promise.reject($t('min_value') + item.minValue)
                }
                if (item.maxValue !== undefined && value > item.maxValue) {
                    return Promise.reject($t('max_value') + item.maxValue)
                }
                if (item.length !== undefined && value.length !== item.length) {
                    return Promise.reject($t('must_length').replace('[]', String(item.length)))
                }
            }
            return Promise.resolve()
        }
    }
}