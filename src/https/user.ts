import { GET, POST } from "./base"

export const apiLogin = (query?: any) => GET('/login', { data: query })