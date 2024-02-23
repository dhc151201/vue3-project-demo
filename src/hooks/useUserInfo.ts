import { ref } from "vue"
import { clearCookie } from "./useCookie";
import Router from "@/router/index"
import { clearAuthData, refreshAuthList } from "./useAuth";
import useRequest from "./useRequest";

// 用户信息
export const USER = ref<{
    loading: boolean,
    user_info: {
        menus?: any[],
        user_id?: number,
        user_name?: string,
        role_name?: string,
        role_id?: number
    }
}>({
    loading: false,
    user_info: {}
})

export const getUserInfo = async () => {
    try {
        USER.value.loading = true
        const { run: getUserInfo } = useRequest('/user/info', {
            manual: true, 
        })
        if (!USER.value.user_info?.user_name) {
            const res: any = await getUserInfo()
            USER.value.user_info = res.data
        }
        // 强制更新、拉取权限数据
        // await refreshAuthList()
        return USER.value.user_info
    } catch (e) { } finally {
        USER.value.loading = false
    }
}

// 登录
export const loginIn = async () => {
    await getUserInfo()
    return USER.value.user_info;
}

// 移除用户缓存数据
export const removeUserCatchInfo = () => {
    clearCookie();
    localStorage.clear();
    sessionStorage.clear();
    clearAuthData();
}
// 登出
export const loginOut = () => {
    removeUserCatchInfo()

    const obj = {
        path: `/login`,
        query: {}
    }

    // 设置此数据，将在login页自动reload一次，防止页面缓存数据
    // (建议设置，主要是清除vue实例、模块内ref等数据对象的脏数据清空)
    sessionStorage.setItem('need-reload-login', '1')

    Router.replace(obj)
}