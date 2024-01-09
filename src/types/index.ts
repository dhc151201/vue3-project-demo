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


export type FlowStepInfomation = {
    complete: boolean,
    review: boolean,
    type: string,
    cando: string[],
    url: string,
    value: string
} & Record;

export type FlowStep = {
    sop_step_id: string, // 步骤id, 开始和结束步骤为-1
    next_sop_step_id: string[], // 下一步骤的id集合
    title: string, // 步骤名称
    role: number, // 所属角色id
    status: boolean, // 是否已完成
    options: FlowStepInfomation[],
} & Record;

export type FlowRoles = {
    role_id: number // 角色id
    title: string, // 角色名称
} & Record;

export type FlowInfo = {
    can_delete: boolean,
    current_sop_step_id: string,
    extra: Record,
    farm_id: number,
    logs: Record[],
    is_commit_question: boolean,
    is_next_show: 'pending' | 'hidden',
    is_archiving: 'hidden'
    template: {
        easy_name: string
    }
} & Record;

export type Flow = {
    id: number | string,
    loading: boolean,
    info: FlowInfo,
    steps: FlowStep[],
    roles: FlowRoles[],
}