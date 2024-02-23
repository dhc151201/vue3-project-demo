/***
 * 复用的表单项
 */
import type { FormItem, RequestConfig } from "@/types";
import { $t } from "./useLang";
import { useCoins } from "./useDic";

// 币种
export const useCoinItem = (item?: FormItem, option?: RequestConfig): FormItem => {
    const { dic, loading } = useCoins(option)
    return {
        field: 'coin',
        type: 'select',
        dic: dic.value,
        inputOptions: {
            placeholder: $t('coin'),
            loading: loading.value
        },
        ...item
    }
}
// 矿场
export const useFarmItem = (item?: FormItem, option?: RequestConfig): FormItem => {
    const { dic, loading } = useCoins(option)

    return {
        field: 'farm_id',
        type: 'select',
        dic: dic.value,
        inputOptions: {
            placeholder: $t('sop.confirm.site_name'),
            loading: loading.value
        },
        ...item
    }
}
// 矿池
export function usePoolItem(item?: any, option?: RequestConfig): FormItem {
    const { dic, loading } = useCoins(option)
    return {
        field: 'pool',
        type: 'select',
        dic: dic.value,
        inputOptions: {
            placeholder: $t('pool'),
            loading: loading.value
        },
        ...item
    }
}
// 日期范围
export const useDateRangeItem = (item?: FormItem):FormItem => {
    return {
        field: 'time',
        type: 'date-range',
        inputOptions: {
            separator: $t('to')
        },
        ...item
    }
}