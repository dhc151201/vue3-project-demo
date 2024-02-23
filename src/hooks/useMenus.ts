import { isArray } from "@/utils";
import { computed } from 'vue';
import { USER } from "@/hooks/useUserInfo"
import { $t } from "./useLang";

/**
 * 获取菜单key，父级菜单key
 * @param path 
 * @param list 
 * @returns 
 */
export const getPath = (path: string, list: any[]): {
    path?: string,
    parent?: string
} => {
    for (const item of list) {
        if (item.type === 'group') continue;
        if (item.key === path) {
            return { path: path }
        }
        if (item.children) {
            const result: any = getPath(path, item.children)
            if (result.path) {
                return Object.assign(result, {
                    parent: item.key
                })
            }
        }
    }

    // 二級、三級頁面
    if (/^\/[^/]*\//.test(path)) {
        const arr = path.split('/')
        arr.splice(-1, 1)
        return getPath(arr.join('/'), list)
    }

    return {}
}


/**
 * 组建菜单数据
 * @param obj 
 * @returns 
 */
const getItems = (obj: any): any[] => {
    const data = []
    if (!isArray(obj)) {
        const item: any = {
            title: $t('menus.' + obj.name),
            label: $t('menus.' + obj.name),
            key: obj.url || obj.name,
            type: obj.title === true ? 'group' : undefined,
        }
        if (obj.children) {
            item.children = getItems(obj.children)
        }
        return item
    } else {
        for (const item of obj) {
            data.push(getItems(item))
        }
    }
    return data
}
/**
 * 菜单数据
 */
export const menus = computed(() => {
    const data = getItems(USER.value.user_info?.menus);
    // console.log(data)
    return data
})