import { nextTick, ref } from 'vue'
import Option from "./option"
import { roles, steps } from "./data"
import type { SOP, SopSteps, SopRoles, SopStepsTable, SOPInfo, SopStepItem } from "@/types";
/**
 * 工单类
 */
class Sop extends Option {
    sop_id;
    loading = ref(false)
    info = ref<SOPInfo>({});
    roles = ref<SopRoles>([]);
    steps = ref<SopSteps>([]);
    currentStep = ref<SopStepItem | undefined>()
    SopStepsTable= ref<SopStepsTable>([])
    constructor(sop_id?: number) { 
        super()
        this.sop_id = sop_id
        this.init()
    }
    private init() {
        this.getSopData()
    }
    private getSopData() {
        this.roles.value = this.getRoles(roles)
        this.steps.value = steps
        this.info.value = {
            sop_id: 1,
            sop_name: "test_sop",
        }
        this.currentStep.value = this.getCurrentStep(this.steps.value)
        this.resetOptions(this.steps.value, this.info.value)

        if (!location.href.includes('sop-new')) {
            this.SopStepsTable.value = this.getSteps(steps, this.roles.value)
            nextTick(() => {
                const steps: SopSteps = []
                this.SopStepsTable.value.forEach(row => {
                    row.forEach(v => {
                        if(v) steps.push(v)
                    })
                })
                this.drawLine(steps)
            })
        }
    }
    refresh() {
        this.getSopData()
    }
}


// 缓存， 方便存取
let catchSop: {[key: number]: any} = {}
export default (sop_id?: number): SOP => {
    if (!sop_id) throw 'sop_id 未传值'
    if (!catchSop[sop_id]) catchSop[sop_id] = new Sop(sop_id)

    return catchSop[sop_id]
}
// 清空缓存
export const destorySop = () => {
    catchSop = {}
}