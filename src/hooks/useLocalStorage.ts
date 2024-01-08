
export const setLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify({
        value: value
    }))
}

export const getLocalStorage = (key: string, callback?: (value: any) => void): any => {
    const VALUE = localStorage.getItem(key)
    if (!VALUE) return;
    try {
        const { value } = JSON.parse(VALUE);
        typeof callback === 'function' && callback(value);
        return value
    } catch (e) { console.error(e) }
}

export const removeLocalStorage = (key: string) => {
    if (!key) return;
    localStorage.removeItem(key)
}

export const clearLocalStorage = () => {
    localStorage.clear()
}