/**
 * 滚动相关hooks
 */

/**
 * 锁止滚动
 * @param target  将被锁止滚动的元素， 默认body
 */
export const LockScroll = (target: HTMLElement = window.parent.document.body) => {
    target.style.overflow = "hidden";
}

/**
 * 解锁滚动
 * @param target 被锁止滚动的元素， 默认body
 */
export const unLockScroll = (target: HTMLElement = window.parent.document.body) => {
    target.style.overflow = "unset";
}

/**
 * 元素滚动到窗口顶部
 * @param el 目标元素
 * @param offsetTop 距离顶部的偏移距离
 * @returns void
 */
export const scrollToTop = (el: HTMLElement, offsetTop: number): void => {
    if (!el) return
    el.scrollIntoView(true);

    // 滚动元素
    const baseLayout: HTMLElement | null = document.querySelector('.ant-layout-content')
    if (!baseLayout) return;
    const newTop = Math.max(0, baseLayout.scrollTop - offsetTop)
    baseLayout.scrollTop = newTop
}