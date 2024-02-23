import type { ModelFormOptions, Record } from "@/types"
import { ref, computed, type ComputedRef } from "vue"
import SOP from "@/components/Flow/core/index"
import useRequest from "@/hooks/useRequest"
import { $t } from "@/hooks/useLang"
import router from "@/router/index"

export function FORM_EDIT (option: ModelFormOptions): ComputedRef<ModelFormOptions> {
    return BASE(option)
}

export function FORM_VIEW (option: ModelFormOptions): ComputedRef<ModelFormOptions> {
    return BASE({
        readonly: true,
        ...option
    })
}

export function BASE (option: ModelFormOptions): ComputedRef<ModelFormOptions> {
    const model = ref<any>({})
    const { run: getData } = useRequest('/sop/view-content', { manual: true })
    const { run: setData, loading } = useRequest('/sop/fill-content', { manual: true, method: 'post' })
    return computed(() => ({
        loading: loading.value,
        model: model.value,
        title: [
            option.readonly ? $t('btn.view') : $t('btn.edit'),
            option.title ?? ''
        ].join(' '),
        width: 1000,
        onBeforeMount: async (params) => {
            const query = getSopQuery(params)
            const res: { data: any } = await getData(query) as any
            model.value = res.data ?? { }
            return true
        },
        onSubmit: async (data: Record) => {
            const query = getSopQuery(data)
            await setData({
                ...query,
                content: JSON.stringify({
                    ...data,
                    key: undefined
                })
            })
        },
        ...option
    }))
}

export const getSopQuery = (params?:Record) => {
    const sop_id = Number(router.currentRoute.value.params.id)
    const { currentStep } = SOP(sop_id)
    return {
        sop_id: sop_id,
        node_id: currentStep.value?.node_id ?? currentStep.value?.id,
        key: params?.key,
    }
}