/**
 * 步骤类
 */
import Roles from "./roles"
import type { SopRoles, SopRolesItem, SopStepItem, SopSteps, SopStepsTable } from "@/types";

export default class extends Roles {
    constructor() {
        super()
    }
    getCurrentStep(steps: SopSteps): SopStepItem | undefined {
        return steps.find(item => item.current === true)
    }
    // 以下方法均在老版本工单流程中才使用
    protected getSteps(steps: SopSteps, roles: SopRoles): SopStepsTable {
        this.sort(steps)
        const tableData = this.getRowColumn(steps, roles)
        // tableData.push(this.createEndRowStep(tableData))
        return tableData
    }
    private sort(steps: SopSteps, sortKey: 'id' = 'id'): SopSteps {
        return steps.sort((a: SopStepItem, b: SopStepItem) => {
            return a[sortKey] - b[sortKey]
        })
    }
    private getRowColumn(steps: SopSteps, roles: SopRoles): SopStepsTable {
        const tree: SopStepItem[][] = []
        
        steps.forEach((step: SopStepItem) => {
            if (!step.step_id) return
            
            if (!tree[step.step_id]) {
                tree[step.step_id] = []
            }
            tree[step.step_id].push(step)
        })

        const data: SopStepsTable = []
        tree.filter(v => v).forEach((item: SopStepItem[]) => {
            const row: SopStepItem[] = new Array(roles.length).fill(undefined);
            item.forEach((step: SopStepItem) => {
                const index = roles.findIndex((role: SopRolesItem) => role.role_id === step.role_id)
                row[index] = step;
            })
            data.push(row)
        })
        return data
    }
    private createEndStep(stepsTable: SopStepsTable): SopStepItem {
        const step:SopStepItem = {
            id: -2,
            node_id: -2, // 结束标识
            step_id: 0, 
            step_name: '结束',
            status: 'peading',
            role_id: -1,
            current: false,
            showNext: false,
            showCatch: false,
            showQuestion: false
        }
        const lastRow = stepsTable[stepsTable.length - 1]
        let firstIndex: number = -1
        let lastIndx: number = -1
        lastRow.forEach((_, index) => {
            if (!_) return;
            if (firstIndex === -1) {
                firstIndex = index
                step.role_id = _.role_id
            }
            lastIndx = index
        })
        step.colspan = lastIndx - firstIndex + 1
        step.pid = lastRow.filter(v => v?.node_id).map(v => v?.node_id).filter(v => v) || []
        return step
    }
    private createEndRowStep(stepsTable: SopStepsTable) {
        const step = this.createEndStep(stepsTable)
        const lastRow = stepsTable[stepsTable.length - 1]
        const row: (SopStepItem|undefined)[] = []
        for (const item of lastRow) {
            if (item) {
                row.push(step)
                break;
            }
            row.push(undefined)
        }
        
        return row;
    }
}