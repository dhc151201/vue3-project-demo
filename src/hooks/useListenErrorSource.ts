/***
 * 监控资源404情况，自动刷新获取最新资源
 */

(function () {
    // 监控404开关
    const openScriptError404: boolean = true;
    if (!openScriptError404) return;

    const _autoReloadContKey: string = 'auto-reload-cont';
    const _reloadMaxCont: number = 5

    // 资源404时自动强刷页面
    window.addEventListener('error', (event) => {
        console.info("error", event, event.target)

        const tag: any = event.target;
        const cont: number = Number(sessionStorage.getItem(_autoReloadContKey) || 0);
        if (cont >= _reloadMaxCont) return;

        // 标记reload次数小于5次
        if (tag.tagName === 'LINK' || (tag.tagName === 'SCRIPT' && !(event instanceof ErrorEvent)) || event?.message?.includes('Failed to load resource')) {
            sessionStorage.setItem(_autoReloadContKey, String(cont + 1))
            location.reload()
        }
    }, true)

    // 动态模块导入错误重载
    window.addEventListener('unhandledrejection', (e) => {
        console.info("error", e, e.reason)

        const message = e.reason.message;
        const cont: number = Number(sessionStorage.getItem(_autoReloadContKey) || 0);
        if (cont >= _reloadMaxCont) return;

        if (/(Failed to fetch dynamically imported module:|Failed to load resource)/.test(message)) {
            sessionStorage.setItem(_autoReloadContKey, String(cont + 1))
            location.reload()
        }
    }, true)

    // 3秒后，没有触发，则移除标记
    setTimeout(() => {
        sessionStorage.removeItem(_autoReloadContKey)
    }, 3000)
})()