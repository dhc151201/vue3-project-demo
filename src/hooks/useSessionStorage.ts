/**
 * 设置sessionStorage
 * @param key 
 * @param value 
 */
export const setSessionStorage = (key: string, value: any) => {
    sessionStorage.setItem(key, JSON.stringify({
        value: value
    }))
}

/**
 * 读取sessionStorage
 * @param key 
 * @param callback 
 * @returns 
 */
export const getSessionStorage = (key: string, callback?: (value: any) => void): any => {
    const VALUE = sessionStorage.getItem(key)
    if (!VALUE) return;
    try {
        const { value } = JSON.parse(VALUE);
        typeof callback === 'function' && callback(value);
        return value
    } catch (e) { console.error(e) }
}

/**
 * 移除指定的sessionStorage
 * @param key 
 * @returns 
 */
export const removeSessionStorage = (key: string) => {
    if (!key) return;
    sessionStorage.removeItem(key)
}

/**
 * 清空sessionStorage
 */
export const clearSessionStorage = () => {
    sessionStorage.clear()
}