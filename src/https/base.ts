import axios from 'axios'
const { isCancel } = axios;
const instance = axios.create({
    baseURL: 'https://some-domain.com/api/',
    timeout: 60000,
});

export const GET = async (
    url: string,
    config?: {
        data?: { [key: string]: any },
        headers?: any,
        cancelToken?: any
    }
) => {
    return instance.get(url, { params: config?.data, ...config })
}

export const POST = async (
    url: string,
    config?: {
        data?: { [key: string]: any },
        headers?: any,
        cancelToken?: any
    }
) => {
    return instance.post(url, { data: config?.data }, {
        cancelToken: config?.cancelToken
    })
}

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});


// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
}, function (error) {
    if (isCancel(error)) {
        console.log('Request canceled: ', error.message);
    } else {
        // 处理其他异常
    }
    // 对响应错误做点什么
    return Promise.reject(error);
});