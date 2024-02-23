import type { Ref } from "vue";

export type Record = {
    [key: string]: any
}

type Method = "get" | "GET" | "delete" | "DELETE" | "head" | "HEAD" | "options" | "OPTIONS" | "post" | "POST" | "put" | "PUT" | "patch" | "PATCH" | "purge" | "PURGE" | "link" | "LINK" | "unlink" | "UNLINK";
export type RequestApi = string | (() => string) | Ref<string>;
export type RequestServer = (query: any, config:{cancelToken: any}) => Promise<unknown>;
export type RequestConfig = {
    method?: Method; // 请求方式
    onBefore?: () => Promise<unknown>; // 请求前回调, 回调参数为请求配置（深拷贝），若要修改，必须修改后 return 出新的配置
    onSuccess?: (data: Record) => void; // 成功回调
    onError?: (err: any) => void; // 错误回调
    onFinally?: (data: Record) => void; // 请求完成回调
    loadingDelay?: number; // 延迟loading
    defaultParams?: Record | (() => Record) | Ref<Record>; // 默认参数
    refreshDeps?: string[]; // 监听哪些字段的变化，而自动发起请求
    loopInterval?: number; // 轮训时间，不设置则不会进行轮训
    debounceInterval?: number; // 防抖时间
    throttleInterval?: number; // 节流时间
    manual?: boolean; // 是否手动请求, 为true时，请手动调用返回的run函数发起请求。
    headers?: Record | Function; // header配置
    responseType?: "json" | "blob";
    auth?: string | string[] // 权限校验
    // 是否缓存接口数据
    catch?: boolean; // todo
}
export type RequestResult = {
    data: Ref<any>; // 响应数据
    success: Ref<boolean>; // 请求成功状态
    error: Ref<boolean>; // 请求错误状态
    done: Ref<boolean>; // 请求完成状态
    loading: Ref<boolean>; // loading状态
    run: (query?: Record) => Promise<unknown>; // 手动触发useRequest执行，参数会传递给service
    refresh: (query?: Record) => Promise<unknown>; // 刷新接口，参数会传递给service
    cancel: () => void; // 取消接口
    response: Ref<any>; // 响应全部内容
}

export type TableColumnItem = {
    title: string | (() => string),
    dataIndex?: string,
    width?: number,
    align?: 'center' | 'right' | 'left',
    awaitChose?: true, // 表头筛选
    slot?: string, //自定义插槽
    key?: 'extend', // 列标识
    date?: true, // 日期渲染
    dateFormat?: 'YYYY-MM-DD HH:mm:ss' | 'YYYY-MM-DD', // 日期格式
    dic?: any[] | Record, // 枚举渲染
    picture?: true, // 图片渲染
    extend?: true, // 是否启用扩展表格
    tooltip?: true | string | ((text: any, record: Record, columns: TableColumnItem) => string),
    customRender?: (text: any, record: Record, columns: TableColumnItem) => any,
}
export type TableColumns = TableColumnItem[]


export type FormOptions = {
    title?: string | Ref<string>,
    loading?: boolean,
    // 数据模型，优先级高于defaultValue
    model?: { [key: string]: any } | Ref<{ [key: string]: any }>,
    // 是否只读
    readonly?: boolean,
    // 表单挂载前
    onBeforeMount?: ((params?: Record) => Boolean) | ((params?: Record) => Promise<Boolean>),
    // 表单提交
    onSubmit?: ((data: any) => Boolean) | ((data: any) => Promise<unknown>),
    // 表单模型变化时
    onChange?: (data: any) => void,
    // 数据提交成功回调
    onSuccess?: () => void,
    // 内建的api直接提交，优先级低于onSubmit
    api?: string | Ref<string>,
    // 表单项
    items: FormItem[],
    // 将会直接绑定传递给【表单组件】
    options?: { 
        [key: string]: any
    }
}
export type WatchField = string | (string | string[])[];
export type FormItem = {
    label?: string | Ref<string>,
    field: string,
    fieldExploded?: [string, string], // 配置此项，可以将value值进行解构分别赋值，field字段在表单提交时将被过滤， 例如日期范围
    required?: boolean,
    type?: 'text' | 'number' | 'radio' | 'select' | 'select-multiple' | 'date' | 'date-range' | 'textarea' | 'checkbox' | 'password' | 'picture' | 'file' | 'htmlTextarea' | 'switch', // 表单类型
    onChange?: (value: any, model:Ref<Record>) => void, // 输入值变化
    dic?: { label: string | Ref<string>, value: string | number | boolean | Ref<number> | Ref<string> | Ref<boolean> }[],
    slot?: string, // 插槽名称
    defaultValue?: boolean | Ref<boolean> | string | any[] | Ref<string> | number | Ref<number> | ((model: Record) => any), // 默认值
    used?: boolean | Ref<boolean> | ((model: { [key: string]: any }) => boolean), // 是否使用
    hide?: boolean | Ref<boolean> | ((model: { [key: string]: any }) => boolean), // 是否隐藏
    isEmail?: boolean, // 是否是邮箱
    isInt?: boolean, // 是否是正整数
    isNoChinese?: boolean, // 是否不含中文字符
    isNoSpecial?: boolean, // 是否不含特殊字符
    minValue?: number, // 最小值
    maxValue?: number, // 最大值
    length?: number, // 指定长度
    maxLength?: number, // 最大长度，type为picture、file时，限制的是媒体个数
    // 联动配置，若配置字段值变化时，将自动发起远程api获取数据，或回调处理
    watchField?: WatchField,
    watchFieldImmediate?: boolean, // 是否立即启动字段联动
    watchFieldApi?: string | Ref<string>, // 联动请求地址
    watchFieldData?: Record | ((values: any, watchField: string | (string | string[])[], model: Record) => Record), // 联动额外的api请求数据
    watchFieldCallback?: (values: any, inputOptions: Record, model: Ref<Record>) => void, // 联动处理函数，返回值将作为输入项的
    watchFieldCustomResponse?: (data: Record, inputOptions: Record, model: Ref<Record>) => void // 自定义处理联动api请求结果
    // 将会直接绑定传递给【表单项组件】
    options?: {
        [key: string]: any
    },
    // 将会直接绑定传递给表单【输入组件】
    inputOptions?: {
        [key: string]: any
    },
} & Record;
export type ModelFormOptions = FormOptions & {
    width?: number,
}


export type DicResult = {
    dic: Ref<{ label: string, value: number }[]>,
} & RequestResult;