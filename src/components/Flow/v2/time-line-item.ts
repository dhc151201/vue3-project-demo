import { h } from "vue"
import { ClockCircleFilled } from '@ant-design/icons-vue'
import UserTag from "@/components/UserTag/index.vue"
import Next from "@/components/Flow/next.vue"
import Catch from "@/components/Flow/catch.vue"
import Option from "@/components/Flow/option.vue"
import ResoleQuestion from "@/components/Flow/reslove-question.vue"
import { TimelineItem } from 'ant-design-vue'
import { DateTimeZone } from "@/hooks/useTimezone"
import { isFunction } from "@/utils"
import { $t } from "@/hooks/useLang"
import { compRole } from "@/hooks/useRole"

/***
 * props: 
 *      step: 步骤信息
 *      ischild：是否是子节点
 *      handelRefStep：ref属性绑定函数
 */
export default function render(_props: any, { slots, attrs }: any) {
    const { step, ischild, handelRefStep } = _props
    return h(
        TimelineItem,
        {
            class: {
                current: step.current,
                [step.status]: true,
                'has-child-step': ischild
            },
            ref: (el: any) => {
                if (isFunction(handelRefStep)) {
                    handelRefStep(el, step)
                }
            }
        },
        {
            default: () => [
                ischild ? null : h('strong', { class: 'step-name' }, $t(`sop.steps.${step.step_name}`)),
                step.children?.length > 0 ? null : [
                    step.user_name ? h(UserTag, { class: 'role-name', user_name: step.user_name, role_name: compRole.value(step) }) : null,
                    step.update_time ? h('span', { class: 'update-time' }, [h(ClockCircleFilled), DateTimeZone.value(step.update_time, "YYYY-MM-DD HH:mm:ss")] ) : null,
                    h(Option, { step: step }),
                    step.status === 'done' ? h('div', { class: 'step-decrition' },
                        [
                            h('span', {class: 'has-colon'}, $t('sop.confirm.note')),
                            step.note ? h('span', null, step.note) : h('span', {class: 'empty-content'}, $t('none'))
                        ]) : null,
                    step.status !== 'done' && step.showNext === true ? h(Next, { step: step }) : null,
                    step.status !== 'done' && step.showCatch === true ? h(Catch, { step: step }) : null,
                    step.status !== 'done' && step.showQuestion === true ? h(ResoleQuestion, { step: step }) : null,
                ]
            ],
            dot: () => h('div', {class: { dot: true, small: ischild }}, ischild ? '' : step.step_number)
        }
    )
}