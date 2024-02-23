/**
 * 工单步骤功能类
 */
import type { SOPInfo, SopStepItem, SopStepItemOption, SopSteps } from '@/types'
import Steps from './steps'
export default class extends Steps {
    constructor() {
        super()
    }
    resetOptions(steps: SopSteps, info: SOPInfo) {
        steps?.forEach((step: SopStepItem) => {
            step.options?.forEach((option: SopStepItemOption) => {
                option.data = {
                    option: option, // option信息
                    step: step, // 节点信息
                    sop: info, // 工单信息
                }
            })
        })
    }
}