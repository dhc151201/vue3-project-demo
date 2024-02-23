/**
 * 角色类
 */
import Line from './line'
import type { SopRoles } from "@/types";

export default class extends Line {
    constructor() {
        super()
    }
    protected getRoles(roles: SopRoles): SopRoles{
        return roles
    }
}