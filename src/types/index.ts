import type { Ref } from "vue";

export type Record = {
    [key: string]: any
}

type Method = "get"|"GET"|"delete"|"DELETE"|"head"|"HEAD"|"options"|"OPTIONS"|"post"|"POST"|"put"|"PUT"|"patch"|"PATCH"|"purge"|"PURGE"|"link"|"LINK"|"unlink"|"UNLINK";
export type RequestServer = (query: any, config:{cancelToken: any}) => Promise<unknown>;
export type RequestConfig = {
    // 请求方式
    method?: Method;
    // 是否手动请求
    manual?: boolean;
    // 默认参数
    defaultParams?: Record | (() => Record) | Ref<Record>;
    // 监听哪些字段的变化，而自动发起请求
    refreshDeps?: string[];
    // 防抖时间
    debounceInterval?: number; // todo
    // 节流时间
    throttleInterval?: number; // todo
    // header配置
    headers?: Record | (() => Record); // todo
    // 响应数据格式
    responseType?: "json" | "blob"; // todo
    // loading延迟取消时间
    loadingDelay?: number;
    // 是否缓存接口数据
    catch?: boolean; // todo
    // 权限校验
    auth?: string | string[] | (() => string | string[]); // todo
}
export type RequestResult = {
    loading: Ref<boolean>;
    data: Ref<any>;
    response: Ref<any>;
    // 请求成功状态
    success: Ref<boolean>;
    // 请求错误状态
    error: Ref<boolean>;
    // 请求完成状态
    done: Ref<boolean>;
    // 接口请求
    run: (query?: Record) => Promise<any>;
    // 取消接口
    cancel: () => void;
    // 刷新接口
    refresh: (query?: Record) => Promise<any>;
}

export type TableColumns = {
    title: string,
    dataIndex?: string,
    width?: number,
    align?: 'center' | 'right'
    slot?: string, //自定义插槽
    date?: true, // 日期渲染
    dateFormat?: string, // 日期格式
    dic?: any[] | Record, // 枚举渲染
    picture?: true, // 图片渲染
}[]


export type FormOptions = {
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
    items: FormItem[],
    // 将会直接绑定传递给【表单组件】
    options?: { 
        [key: string]: any
    }
}
export type FormItem = {
    label: string | Ref<string> | (() => string),
    field: string,
    required?: boolean,
    type?: 'text' | 'number' | 'radio' | 'select' | 'date' | 'date-range' | 'textarea' | 'checkbox' | 'password' | 'picture' | 'file' | 'htmlTextarea', // 表单类型
    dic?: { label: string | Ref<string>, value: string | number | Ref<number> | Ref<string> }[],
    slot?: string, // 插槽名称
    defaultValue?: string | Ref<string> | (() => string), // 默认值
    used?: boolean | Ref<boolean> | ((model: { [key: string]: any }) => boolean), // 是否使用
    isEmail?: boolean, // 是否是邮箱
    isInt?: boolean, // 是否是正整数
    isNoChinese?: boolean, // 是否不含中文字符
    isNoSpecial?: boolean, // 是否不含特殊字符
    minValue?: number, // 最小值
    maxValue?: number, // 最大值
    maxLength?: number, // 最大长度，type为picture、file时，限制的是媒体个数
    // 将会直接绑定传递给【表单项组件】
    options?: { 
        [key: string]: any
    },
    // 将会直接绑定传递给表单【输入组件】
    inputOptions?: { 
        [key: string]: any
    }
}
export type ModelFormOptions = FormOptions & {
    width: number,
}