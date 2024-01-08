import type { Record } from "@/types"
import { GET, POST } from "./base"
type Query = undefined | Record
type Config = {
    cancelToken?: string
}

// 接口配置
const config: {[key: string]: [string, 'get'|'post']} = {
    Login: ['http://api2-test.minems.com:8080/api/admin/login', 'post']
}

const apis: {
    [key: string]: (query?: Query, config?: Config) => Promise<any>
} = {}
Object.keys(config).forEach((apiName: string) => {
    const [url, method] = config[apiName]
    const Server = method === 'get' ? GET : POST;
    apis[apiName] = (query?: Query, config?: Config) => Server(url, { data: query, ...(config || {}) })
})

export default apis