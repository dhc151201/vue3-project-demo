<template>
    <div class="panel-drak">
        <div class="sop-top-bar">
            <div class="action" @click="handelBack()">
                <LeftOutlined />
            </div>
            <span class="question-total"><span class="has-colon">{{t('question_submit_count')}}</span><b>2</b></span>
        </div>
        <div v-for="(item, index) of data" :key="index" class="question-list">
            <!-- 提出问题工单 -->
            <template v-if="1">
                <div>
                    <UserTag user_name="wlfzr" role_name="Logistic Manager"></UserTag>
                    {{ t('sop.log.action.commit_question') }}
                    <span class="update-time"><ClockCircleFilled />{{DateTimeZone(item.update_time, "YYYY-MM-DD HH:mm:ss")}}</span>
                </div>
                <div class="repply-resion">{{ t('sop.log.confirm_resion') }}：dsfsdfdsf</div>
            </template>
            <!-- 解决问题工单 -->
            <template v-if="1">
                <div>
                    <UserTag user_name="wlfzr" role_name="Logistic Manager"></UserTag>
                    {{ t('sop.log.action.solve_question') }}
                    <span class="update-time"><ClockCircleFilled />{{DateTimeZone(item.update_time, "YYYY-MM-DD HH:mm:ss")}}</span>
                </div>
                <div class="reslove-result">{{ t('sop.log.summary') }}：dsfsdfdsf</div>
            </template>
            <!-- 展开状态 -->
            <span class="action" :class="{open: item.open}" @click="handelTiggleOpen(index)">
                <DoubleRightOutlined />
                {{item.open ? t('yzk') : t('ysq')}}
            </span>
            <span class="action-desc">{{t('question_picture')}}</span>
            <div class="hidden" :class="{open: item.open}">
                <a-timeline>
                    <template v-for="(step) of item.steps" :key="step.key + step.status">
                        <TimeLineItem :step="step"></TimeLineItem>
                        <template v-if="step.children">
                            <template v-for="child of step.children" :key="child.key">
                                <TimeLineItem :step="child" :ischild="true"></TimeLineItem>
                            </template>
                        </template>
                    </template>
                </a-timeline>
            </div>
        </div>
    </div>
    <ScrollTop></ScrollTop>
</template>
<script lang="ts" setup>
import { ref, computed } from "vue"
import { LeftOutlined, DoubleRightOutlined, ClockCircleFilled } from '@ant-design/icons-vue';
import ScrollTop from "@/components/ScrollTop/index.vue"
import { useI18n } from "vue-i18n";
import TimeLineItem from "./time-line-item"
import UserTag from "@/components/UserTag/index.vue"
import type { SOP, SopSteps } from "@/types"
import Sop from "@/components/Flow/core";
import { useRoute, useRouter } from "vue-router"
import { DateTimeZone } from "@/hooks/useTimezone";
import { useRouteParams } from '@vueuse/router'
const id = useRouteParams('id')
const { t } = useI18n();

const { loading, steps }: SOP = Sop(Number(id.value))

const handelTiggleOpen = (index: number) => {
    data.value[index].open = !data.value[index].open
}

const data = ref<{
    open?: boolean
    update_time: string
    steps: SopSteps
}[]>([
    { steps: steps.value, update_time: "2023-11-12 12:23:23" },
    { steps: steps.value, update_time: "2023-11-12 12:23:23" }
])

const router = useRouter()
const handelBack = () => {
    router.replace(`/sop-new/${id.value}`)
}
</script>
<style lang="less" scoped>
@import url('./v2.less');
</style>