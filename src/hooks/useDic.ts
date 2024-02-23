import type { DicResult, RequestConfig } from "@/types"
import { getDynamicDic, getStaticDic } from "@/hooks/useDicTemp"
import { ROLES_API } from "./useApi"

export const useCoins = (option?: RequestConfig): DicResult => {
    return getStaticDic('coin', option)
}

export const useFarms = (option?: RequestConfig): DicResult => {
    return getStaticDic('farm', option)
}

export const useTest = (option?: RequestConfig): DicResult => {
    return getDynamicDic('/asdadadad/api', option)
}

/**
 * 角色下拉
 * @returns 
 */
export const useRoles = (): DicResult => {
    const result = getDynamicDic(ROLES_API.list_url, {
        defaultParams: {limit: 1000},
        onSuccess: (res) => {
            result.dic.value = res.data.items.map((v: any) => {
                return {
                    label: v.name,
                    value: v.role_id
                }
            }) ?? []
        }
    })
    return result
}