import { isRef, ref, type Ref } from "vue";
import axios from "axios";
import { isString, isObject, isFunction, awaitTime, debounce, cloneDeep, isBlob } from "@/utils/index";
import { notice } from "@/hooks/useNotice"
import { getCookie } from "./useCookie";
import i18n from "@/i18n"
import { loginOut } from "./useUserInfo";
import useErrorModel from "./useErrorModel";
import { timezone } from "./useTimezone";
import type { RequestConfig, RequestResult, RequestApi, Record } from "@/types";
const { t, locale } = i18n.global;

const CancelToken = axios.CancelToken;
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
});

// 错误类型
const error_type: {[key: string]: (data: Record) => unknown} = {
  normal: (data: any) => {
    notice.error(t(data.code || 'Network Error.'))
  },
  params_errors: (data: any) => {
    notice.error(Object.values(data.data ?? {}).join(' '))
  },
  multiple_base: (data: any) => {
    const { openErrorModel } = useErrorModel()
    openErrorModel({
      errors: data.data ?? {},
      isArray: Array.isArray(data.data)
    })
  },
  default: (data) => {
    notice.error(JSON.stringify(data))
  }
}

// 请求类
class REQUEST {
  _cancel: any
  async request(url: string, options: RequestConfig, query: { [key: string]: any }): Promise<any> {
    const config = this.createOptions(url, options, query)
    return await instance.request(config)
  }
  cancel() {
    if (isFunction(this._cancel)) {
      this._cancel()
    }
  }
  createOptions(url: string, options: RequestConfig = {}, query: any = {}) {
    const config: any = {
      url: url,
      method: options.method ?? "get"
    }

    const queryData = {
      ...(isRef(options.defaultParams) ? options.defaultParams.value : isFunction(options.defaultParams) ? (options.defaultParams as Function)() : options.defaultParams),
      ...cloneDeep(query),
    }

    if ([undefined, 'get', 'GET'].includes(options.method)) {
      config.params = queryData
    } else {
      config.data = queryData
    }

    // header 配置
    config.headers = {
      Authorization: decodeURIComponent('Bearer ' + getCookie('token')),
      lang: locale.value,
      timezone: timezone.value,
      ...config.headers || {},
      ...options.headers || {}
    }

    // 响应数据
    if (options.responseType) {
      config.responseType = options.responseType
    }

    config.cancelToken = new CancelToken((c: Function) => {
      this._cancel = c;
    });

    return config

  }
}
// 状态数据管理类
class SATAES extends REQUEST {
  loading = ref<boolean>(false)
  success = ref<boolean>(false)
  error = ref<boolean>(false)
  done = ref<boolean>(false)
  data = ref<any>({})
  response = ref<any>({})
  _looptask = null
  _service: RequestApi = ""
  _options: RequestConfig = {}
  _url: string = ""
  _catch_key: string = ''
  constructor(url: RequestApi, options: RequestConfig) {
    super()
    this._service = url;
    this._options = options;
  }
  /**
   * 
   * @param type start请求开始， end请求结束
   */
  resetState(type: "start" | "end") {
    if (type === "start") {
      this.loading.value = true
      this.done.value = false

      this.success.value = false
      this.error.value = false
    } else if (type === 'end') {
      // 请求成功 && 延迟loading时间
      if (this.success.value === true && this._options.loadingDelay) {
        setTimeout(() => {
          this.loading.value = false
        }, this._options.loadingDelay)
      } else {
        this.loading.value = false
      }
      this.done.value = true
    }
  }
}
// 请求入口类
class HTTP_REQUEST extends SATAES {
  run: (query?: Record) => Promise<unknown>;
  constructor(url: RequestApi, options: RequestConfig = {}) {
    super(url, options)
    this.run = debounce(this._run.bind(this), options.debounceInterval || 0) as any;
    // 自动请求
    if (options.manual !== true) {
      this.run();
    }
  }
  async _run(query: Record = {}) {
    try {
      await this.onBefore()
      // 发出请求
      const response = await this.request(this._url, this._options, query)

      this.response.value = response
      const { data } = response

      if (data && data.status !== 0 && !isBlob(data)) throw { response };
     
      this.onSuccess(data)
      return data
    } catch (e: any) {
      this.onError(e)
    } finally {
      this.onFinally(query)
    }
  }
  async refresh(query: Record = {}) {
    return this.run(query)
  }
  async onBefore() {
    // 地址转换
    if (isString(this._service)) {
      this._url = (this._service as string)
    } else if (isFunction(this._service)) {
      this._url = (this._service as Function)()
    } else if (isRef(this._service)) {
      this._url = this._service.value
    }

    // 权限验证
    if (this._options.auth) {
      //const hasAuth = await checkHasAuthAsync(this._options.auth)
      //if (!hasAuth) throw `no auth request api: ${this._url}`
    }

    if (this._options.onBefore && isFunction(this._options.onBefore)) {
      await this._options.onBefore()
    }

    this.resetState("start")
  }
  onSuccess(data: any = {}) {
    this.success.value = true
    this.data.value = data;

    if (this._options.onSuccess && isFunction(this._options.onSuccess)) {
      this._options.onSuccess(data)
    }
  }
  onError(e: any) {
    if (!e) return;
    const { message, status: httpStatus, data, name } = e?.response || {}

    if(httpStatus === 403 || name === 'CanceledError') return
    if (httpStatus === 401) return loginOut()
  
    this.error.value = true
    // 业务请求失败
    if (isObject(data)) {
      error_type[data.error_type] ? error_type[data.error_type](data) : error_type['default'](data);
    } else if (message) {
      notice.error(message)
    }
    if (this._options.onError && isFunction(this._options.onError)) {
      this._options.onError(e)
    }
    throw e
  }
  async onFinally(query?: Record) {
    this.resetState("end")

    if (this._options.onFinally && isFunction(this._options.onFinally)) {
      this._options.onFinally(this.data.value)
    }

    if (this._options.loopInterval) {
      if (this._looptask) clearTimeout(this._looptask);
      await awaitTime(this._options.loopInterval)
      this.run(query)
    }

  }
}

/**
 * 
 * @param url 请求api，可以是一个地址字符串，可以是一个返回请求地址的函数，也可以是一个响应式的地址
 * @param options 请求配置项
 * @returns {data, loading, run, refresh, cancel, ... }
 */
export default function (url: RequestApi, options: RequestConfig = {}): RequestResult {
  const fn = new HTTP_REQUEST(url, options)
  return {
    ...fn,
    success: fn.success,
    error: fn.error,
    done: fn.done,
    response: fn.response,
    loading: fn.loading,
    data: fn.data,
    run: fn.run.bind(fn),
    cancel: fn.cancel.bind(fn),
    refresh: fn.refresh.bind(fn),
  }
}