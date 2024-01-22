import { isRef, ref, type Ref } from "vue";
import axios from "axios";
import {
  isString,
  isObject,
  isFunction,
  awaitTime,
  throttle,
  debounce,
  cloneDeep,
} from "@/utils/index";
import { notice } from "@/hooks/useNotice"

const CancelToken = axios.CancelToken;
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
});

type Record = { [key: string]: any };
type service = string | (() => string) | Ref<string>;
type Method =
  | "get"
  | "GET"
  | "delete"
  | "DELETE"
  | "head"
  | "HEAD"
  | "options"
  | "OPTIONS"
  | "post"
  | "POST"
  | "put"
  | "PUT"
  | "patch"
  | "PATCH"
  | "purge"
  | "PURGE"
  | "link"
  | "LINK"
  | "unlink"
  | "UNLINK";
type serviceConfig = {
  method?: Method; // 请求方式
  onBefore?: Function; // 请求前回调, 回调参数为请求配置（深拷贝），若要修改，必须修改后 return 出新的配置
  onSuccess?: Function; // 成功回调
  onError?: Function; // 错误回调
  onFinally?: Function; // 请求完成回调
  loadingDelay?: number; // 延迟loading
  defaultParams?: Record | (() => Record) | Ref<Record>; // 默认参数
  refreshDeps?: string[]; // 监听哪些字段的变化，而自动发起请求
  loopInterval?: number; // 轮训时间，不设置则不会进行轮训
  debounceInterval?: number; // 防抖时间
  throttleInterval?: number; // 节流时间
  manual?: boolean; // 是否手动请求, 为true时，请手动调用返回的run函数发起请求。
  headers?: Record | Function; // header配置
  responseType?: "json" | "blob";
  auth?: string // 权限校验
};
type response = {
  data: Ref<any>; // 响应数据
  success: Ref<boolean>; // 请求成功状态
  error: Ref<boolean>; // 请求错误状态
  done: Ref<boolean>; // 请求完成状态
  loading: Ref<boolean>; // loading状态
  run: Function; // 手动触发useRequest执行，参数会传递给service
  cancel: Function; // 取消接口
  refresh: Function; // 刷新接口，参数会传递给service
  response: Ref<any>; // 响应全部内容
};

// 请求类
class REQUEST {
  _cancel: any
  async request(url: string, options: serviceConfig, query: { [key: string]: any }): Promise<any> {
    return await instance.request(this.createOptions(url, options, query))
  }
  cancel() {
    if (isFunction(this._cancel)) {
      this._cancel()
    }
  }
  createOptions(url: string, options: serviceConfig = {}, query: any = {}) {
    const config: any = {
      url: url,
      method: options.method ?? "get"
    }

    const queryData = {
      // timezone: useTimezone().getTimezone().value,
      ...(isRef(options.defaultParams) ? options.defaultParams.value : isFunction(options.defaultParams) ? (options.defaultParams as Function)() : options.defaultParams),
      ...cloneDeep(query),
    }

    if ([undefined, 'get', 'GET'].includes(options.method)) {
      config.params = queryData
    } else {
      config.data = queryData
    }

    // header 配置
    const TOKEN = "";
    config.headers = {
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
  loading = ref(false)
  success = ref(false)
  error = ref(false)
  done = ref(false)
  data = ref({})
  response = ref({})
  _looptask = null
  _service: service = ""
  _options: serviceConfig = {}
  _url: string = ""
  constructor(url: service, options: serviceConfig) {
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
  run: Function;
  constructor(url: service, options: serviceConfig = {}) {
    super(url, options)
    this.run = throttle(this._run.bind(this), options.throttleInterval);
    // 自动请求
    if (options.manual !== true) {
      this.run();
    }
  }
  async _run(query: Record = {}) {
    try {
      await this.onBefore()
      // 发出请求
      const response = await this.request(this._url, this._options, query).catch(response => {
        this.response.value = response
        throw response.response?.data || response.response || response;
      })
      this.response.value = response
      // 异常拦截
      if (![200, 201, 204].includes(response.status)) {
        this.error.value = true
        throw response;
      }
      if (response?.data?.ret && response.data.ret > 0) {
        this.error.value = true
        throw response.data;
      }
      // 请求成功
      this.onSuccess(response)
      return response.data
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
  onSuccess(res: any) {
    this.success.value = true
    this.data.value = res.data ?? {};

    if (this._options.onSuccess && isFunction(this._options.onSuccess)) {
      this._options.onSuccess(this.data.value)
    }
  }
  onError(e: any) {
    // 权限拦截
    if (isString(e) && e.includes('no auth request')) return;
    // 手动取消
    if (e.name === 'CanceledError') return;
    // 401 未登录 或 登录token失效
    if (e.status_code === 401) {
      // loginOut()
      return;
    }
    // 请求失败
    console.error(e);
    // status_code 403： 没有权限调用接口
    // ret 1002： 文件上传格式的相关的错误信息
    if (isObject(e) && e?.ret !== 1002 && e.status_code != 403) {
      const msg = e?.message || e?.msg;
      notice.warning(msg || "request error")
    }
    if (this._options.onError && isFunction(this._options.onError)) {
      this._options.onError(e)
    }
    throw e
  }
  async onFinally(query?: any) {
    this.resetState("end")

    if (this._options.onFinally && isFunction(this._options.onFinally)) {
      this._options.onFinally(this.data)
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
export default function (url: service, options: serviceConfig = {}): response {
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