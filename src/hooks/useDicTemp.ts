
import { computed, ref } from "vue"
import type { DicResult, RequestConfig, RequestResult, RequestApi } from "@/types"
import useRequest from "./useRequest"

/***
 * 全局缓存的下拉数据
 */
export const getStaticDic = CreateStaticDic()

/**
 * 动态下拉数据
 * @param api 
 * @param option 
 * @returns 
 */
export const getDynamicDic = (api: RequestApi, option?: RequestConfig): DicResult => {
    const dic = ref([])
    const request: RequestResult = useRequest(api, {
        onSuccess: (res: any) => {
            // 下拉数据
            dic.value = res.data
        },
        onError: () => {
            dic.value = []
        },
        ...option || {}
    })
    return {
        ...request,
        dic
    }
}


function CreateStaticDic(): (key: string, option?: RequestConfig) => DicResult {

    const StaticData = ref()
    const loading = ref(false)

    return function (key: string, option?: RequestConfig): DicResult {

        const request: RequestResult = useRequest('/sdasd', {
            ...option || {},
            manual: true,
            onBefore: async () => loading.value = true,
            onSuccess: (res: any) => {
                // 下拉数据
                StaticData.value = res.data
            }
        })

        if (!StaticData.value && !loading.value) request.run()

        return {
            ...request,
            dic: computed(() => {
                return (StaticData.value && StaticData.value[key]) ?? []
            })
        }
    }
}