/**
 * 静态下拉
 */
import { computed, ref, type Ref } from "vue";
import useRequest from "./useRequest";
import type { Record } from "@/types";

type SelectResult = {
    loading: Ref<boolean>,
    disabled: Ref<boolean>,
    dic: Ref<Record[]>,
}

const StaticSelect = ref({})

export const useFarms = ():SelectResult  => {
    return getStaticSelectByKey('farm', StaticSelect.value)
}


const { loading: getStaticSelectDataLoading } = useRequest('', {
    onSuccess: (res: any) => {
        StaticSelect.value = res;
    }
})
/**
 * 
 * @param key key值
 * @param data 下拉静态数据
 * @param parentValue 父级value
 * @returns array
 */
function getStaticSelectByKey(key: string, data: Record, parentValue?: number | string): SelectResult {
    return {
        loading: getStaticSelectDataLoading,
        disabled: getStaticSelectDataLoading,
        dic: computed(() => {
            if (!data[key]) return []
            if (parentValue !== undefined) return data[key][(parentValue as any)] || []
            // 全部下拉内容 todo

            return []
        })
    }
}