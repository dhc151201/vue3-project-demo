import useRequest from "./useRequest";

// 用户
export const USER_API = {
    list: '/user/list',
    create: useRequest('/user/create', { manual: true, method: 'post' }),
    update: useRequest('/user/update', { manual: true, method: 'post' }),
}

// 角色
export const ROLES_API = {
    list_url: '/role/list',
    list: useRequest('/role/list', { manual: true }),
    create: useRequest('/role/create', { manual: true, method: 'post' }),
    update: useRequest('/role/update', { manual: true, method: 'post' }),
    delete: '/role/delete',
}