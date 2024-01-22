/**
 * 键盘enter按键监听
 * @param callback 回调函数
 * @returns { remove() 取消事件监听函数 }
 */
export const useEnter = (callback: () => void): {remove: () => void} => {
    const fn = (e: any) => {
        const { keyCode } = e
        if (keyCode === 13) {
            callback()
        }
        e = null
    }
    window.addEventListener('keyup', fn)
    return {
        remove: () => {
            window.removeEventListener('keyup', fn)
        }
    }
}