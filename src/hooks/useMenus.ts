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