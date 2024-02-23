/**
 * 权限控制模块
 */
import { ref, computed } from "vue"
import useRequest from "./useRequest";
type authKey = string | string[] | undefined // 单个权限、或者多个权限组合中的任意一个权限

const authData = ref<string[] | undefined>();
const checkAuth = (key: authKey, auth?: string[]): Boolean => {
    if (!key) return true;
    if (Array.isArray(key)) {
        for (const k of key) {
            if (auth?.includes(k)) return true
        }
        return false
    }
    return auth?.includes(key) || false
}

/**
 * 异步检测是否具备权限
 * @param key 权限标识
 * @returns Promis(boolern)
 */
export const checkHasAuthAsync = async (key: authKey): Promise<Boolean | undefined> => {
    if (!authData.value) {
        await getAuthList()
    }
    return checkAuth(key, authData.value)
}

/**
 * 计算属性，检测是否具备权限
 * @param key 权限标识
 * @returns Ref(boolern)
 */
export const checkHasAuth = computed(() => (key: authKey) => {
    return checkAuth(key, authData.value)
})

/**
 * 清除权限数据
 */
export const clearAuthData = () => {
    authData.value = undefined
}
/**
 * 重新获取，刷新权限数据
 * @returns 
 */
export const refreshAuthList = () => {
    return getAuthData()
}

const { run: getAuthData, loading } = useRequest("/user/permissions", {
    manual: true,
    onSuccess: ((res: any) => {
        authData.value = res.data.views;
    })
})
const getAuthList = async () => {
    return new Promise((reslove: Function) => {
        if (authData.value) return
        if (loading.value == true) {
            let interval: any = setInterval(() => {
                if (authData.value) {
                    clearInterval(interval)
                    interval = null;
                    reslove()
                }
            }, 100)
        } else {
            getAuthData().then(() => {
                reslove()
            })
        }
    })
}