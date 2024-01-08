/**
 * 设置localstorage
 * @param key 
 * @param value 
 */
export const setLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify({
        value: value
    }))
}

/**
 * 读取localstorage
 * @param key 
 * @param callback 
 * @returns 
 */
export const getLocalStorage = (key: string, callback?: (value: any) => void): any => {
    const VALUE = localStorage.getItem(key)
    if (!VALUE) return;
    try {
        const { value } = JSON.parse(VALUE);
        typeof callback === 'function' && callback(value);
        return value
    } catch (e) { console.error(e) }
}

/**
 * 移除指定的localstorage
 * @param key 
 * @returns 
 */
export const removeLocalStorage = (key: string) => {
    if (!key) return;
    localStorage.removeItem(key)
}

/**
 * 清空localstorage
 */
export const clearLocalStorage = () => {
    localStorage.clear()
}