export const getCookie = (name: string) => {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return (arr[2]);
    else
        return null;
}

export const setCookie = (c_name: any, value: any, expiredays: any = 30) => {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toUTCString());
}

export const delCookie = (name: any) => {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toUTCString();
}

export const clearCookie = () => {
    // 获取所有的cookie
    var cookies = document.cookie.split(";");
    // 遍历所有cookie，逐个删除
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        // 获取cookie名称
        var name = cookie.slice(0, cookie.indexOf("=")).trim();
        // 删除cookie
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
}
