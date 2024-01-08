import { ref, isRef, watch } from "vue"
import type { RequestConfig, RequestServer, RequestResult, Record } from "@/types"
import axios from "axios"
import { debounce } from "@/utils";
const { CancelToken } = axios;

/**
 * 请求hooks
 * @param server 请求的promise对象
 * @param config 配置
 * @returns 
 */
export default function (server: RequestServer, config?: RequestConfig): RequestResult {
    const loading = ref<boolean>(false)
    const done = ref<boolean>(false)
    const success = ref<boolean>(false)
    const error = ref<boolean>(false)
    const data = ref<undefined | Record>() // 接口响应数据
    const response = ref<undefined | Record>() // 接口响应体数据（包含接口响应数据）

    const State = ref<Record>({})
    let AxiosSource: any = null
    const Request = () => {
        loading.value = true
        done.value = false
        success.value = false
        error.value = false

        // 合并默认参数，query参数可以覆盖默认参数
        let defaultParams: any = {}
        if (isRef(config?.defaultParams)) defaultParams = config.defaultParams.value;
        else if (typeof config?.defaultParams === 'function') defaultParams = config.defaultParams();
        else defaultParams = config?.defaultParams || {}
        State.value = Object.assign({}, defaultParams, State.value)

        AxiosSource = CancelToken.source();
        return server(State.value, {
            cancelToken: AxiosSource.token
        }).then((res: any) => {
            success.value = true
            response.value = res
            data.value = res.data
            return Promise.resolve(res)
        }).catch((err: any) => {
            error.value = true
            response.value = err;
            return Promise.reject(err)
        }).finally(() => {
            done.value = true
            if (config?.loadingDelay) {
                setTimeout(() => {
                    loading.value = false
                }, config?.loadingDelay)
            } else {
                loading.value = false
            }
        })
    }

    // 发起请求（除默认参数，其他参数将重置传入）
    const run = debounce((query?: Record) => {
        State.value = query || {}
        return Request()
    }, config?.debounceInterval) as any;

    const cancel = () => {
        if (AxiosSource?.cancel) {
            AxiosSource?.cancel('user cancel request.')
        }
    }

    // 刷新请求（保留run函数传入的参数，将刷新参数合并覆盖传入）
    const refresh = debounce((query?: Record) => {
        State.value = Object.assign({}, State.value || {}, query || {})
        return Request()
    }, config?.debounceInterval) as any;

    if (config?.manual !== true) {
        run()
    }
    if (config?.refreshDeps) {
        watch(() => {
            const obj: Record = {}
            if (Array.isArray(config.refreshDeps)) {
                config.refreshDeps.forEach((key: string) => {
                    obj[key] = State.value[key]
                })
            } else if (typeof config.refreshDeps === 'string') {
                obj[config.refreshDeps] = State.value[config.refreshDeps]
            }
            return obj
        }, (query: Record) => {
            refresh(query)
        }, {
            deep: true
        })
    }

    return {
        loading,
        data,
        response,
        done,
        success,
        error,
        run,
        cancel,
        refresh
    }
}