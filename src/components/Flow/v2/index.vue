<template>
    <div class="panel-drak">
        <div class="sop-top-bar">
            <div class="action" @click="showAllStep = !showAllStep">
                <DoubleRightOutlined :class="{open: showAllStep}" />
            </div>
            <div class="action position" @click="handelIntoViewCurrent()">
                <AimOutlined />
            </div>
            <!-- 当前节点 -->
            <span class="current-step">{{t('sop.filter.current_node')}}：{{currentStep?.step_name}}</span>
            <div class="extra-right">
                <a-button ghost size="small" @click="goRecord()">{{t('question_record')}}</a-button>
                <ModelFormBtn :config="questionMdealFormOption" ghost size="small" type="warning">{{t('sop.question_apply.title')}}</ModelFormBtn>
            </div>
        </div>
        <a-timeline>
            <div ref="refBefore" class="hidden" :class="{open: showAllStep}"></div>
            <template v-for="(step, index) of data" :key="step.id + step.status">
                <Teleport v-if="refBefore" :to="refBefore" :disabled="!getIsHidden(index)">
                    <TimeLineItem :step="step" :handelRefStep="handelRefStep"></TimeLineItem>
                    <template v-if="step.children">
                        <template v-for="child of step.children" :key="child.id + child.status">
                            <TimeLineItem :step="child" :ischild="true"></TimeLineItem>
                        </template>
                    </template>
                </Teleport>
            </template>
        </a-timeline>
    </div>
    <ScrollTop></ScrollTop>
</template>
<script lang="ts" setup>
import { ref, computed, onBeforeUnmount } from "vue"
import { DoubleRightOutlined, AimOutlined } from '@ant-design/icons-vue'
import ScrollTop from "@/components/ScrollTop/index.vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import TimeLineItem from "./time-line-item"
import type { SopStepItem, SOP, ModelFormOptions } from "@/types"
import Sop from "@/components/Flow/core"
import { destorySop } from "@/components/Flow/core"
import { useRouteParams } from '@vueuse/router'
const id = useRouteParams('id')
const { t } = useI18n();
const refBefore = ref(null)

const { loading, steps: data }: SOP = Sop(Number(id.value))
onBeforeUnmount(() => {
    destorySop()
})

// 展开全部节点
const showAllStep = ref(false)
const getIsHidden = (index: number): boolean => {
    const currentIndex = data.value.findIndex(v => v.current)
    if (index >= currentIndex - 1) return false
    return true
}
// 定位当前节点
const currentStep = computed(() => data?.value?.find((v: SopStepItem) => v.current))
const currentRef = ref<HTMLElement | null>(null)
const handelRefStep = (el: any, step: SopStepItem) => {
    if(step.current === true) currentRef.value = el?.$el
}
const handelIntoViewCurrent = () => {
    currentRef.value?.scrollIntoView({ behavior: 'smooth' })
}

const router = useRouter()
const goRecord = () => {
    router.replace(`/sop-new/question-record/${id.value}`)
}

// 申请问题工单
const questionMdealFormOption = computed((): ModelFormOptions => (
    {
        title: t('sop.question_apply.title'),
        onSubmit: async () => {

        },
        items: [
            {
                field: '',
                options: {
                    extra: t('sop.question_apply.tip1'),
                    class: 'hidden-input'
                }
            },
            {
                field: '',
                options: {
                    extra: t('sop.question_apply.tip2'),
                    class: 'hidden-input'
                }
            },
            {
                field: 'note',
                type: "textarea",
                required: true,
                options: {
                    extra: t('inputMaxLength').replace("[]", '500')
                },
                inputOptions: {
                    placeholder: t('sop.question_apply.placeholder'),
                    maxLength: 500,
                }
            }
        ]
    }
))
</script>
<style lang="less" scoped>
@import url('./v2.less');
</style>