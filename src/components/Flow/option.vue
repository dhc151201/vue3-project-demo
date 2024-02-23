<template>
    <div class="options-panel no-warp" v-if="step.options?.length > 0">
        <div class="list" v-for="(item, index) of step.options" :key="index">
            <div class="list-top">
                <div>{{t(`sop.steps.${item.option_name}`)}}</div>
                <section>
                    <a-button class="btn-xs" @click="handelOptionsBtn(action, item)" v-for="action of item.do" :key="action" type="warning" ghost size="small">
                        {{ t(`btn.${action}`) }}
                    </a-button>
                </section>
            </div>
            
            <span v-if="item.status === true" class="status done">{{t('status.label')}}：{{t('sop.confirm.edited')}}</span>
            <span v-else class="status">{{t('status.label')}}：{{t('sop.confirm.unedited')}}</span>
        </div>
    </div>
    <component v-model:open="showCompnents" :is="components" :params="ModelFormParams" v-bind="componentsProps"></component>
    <ModelForm :config="ModelFormConfig" :params="ModelFormParams" v-model:open="openModelForm"></ModelForm>
</template>
<script setup lang="ts">
import { watch, ref, shallowRef } from "vue"
import type { SopStepItemOptionAction, SopStepItemOption, ModelFormOptions, SopStepItemOptionData } from "@/types"
import { isRef } from "vue";
import { isFunction } from "@/utils";
import type { VNode, Ref } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
defineProps({
    step: {
        type: Object,
        default: () => ({
            options: [
                {}, {}
            ]
        })
    }
})

const openModelForm = ref(false)
const ModelFormConfig = ref({})
const ModelFormParams = ref({}) // 重要的option参数

const components = shallowRef();
const showCompnents = ref<boolean>(false);
const componentsProps = ref<SopStepItemOptionData>({}) // 重要的option、step、sop参数

const responseBtn = {
    openModelForm: (config: Ref<ModelFormOptions>, option: SopStepItemOption) => {
        watch(config, () => {
            ModelFormConfig.value = config.value
        }, { immediate: true, deep: true })
        openModelForm.value = true
        ModelFormParams.value = {
            key: option.key
        }
    },
    openComponents: (config: VNode, option: SopStepItemOption) => {
        components.value = config
        ModelFormParams.value = {
            key: option.key
        }
        componentsProps.value = option.data ?? {}
        showCompnents.value = true
    }
}

const handelOptionsBtn = async (action: SopStepItemOptionAction, option: SopStepItemOption) => {
    let config = await getConfig(action, option)
    if (!config) return;
    
    // 函数
    if (isFunction(config)) {
        config = await config(option.data)
    }
    // 表单弹窗
    if (isModelFormConfig(config)) {
        responseBtn.openModelForm(config, option)
    }
    // 组件
    if (isFunction(config.render) || isFunction(config.setup)) {
        responseBtn.openComponents(config, option)
    }
}

async function getConfig(action: SopStepItemOptionAction, option: SopStepItemOption) {
    const { sop_name } = option.data?.sop ?? {}
    const { step_name } = option.data?.step ?? {}
    const { option_name } = option.data?.option ?? {}
    const options = await import(/* @vite-ignore */`./config/${sop_name}`);
    console.info(sop_name, '-', [step_name, option_name, option.type + '_' + action].join('.'))
    let config = options.default[step_name as string][option_name as string][option.type + '_' + action]
    if (!config) {
        console.error(`未找到工单 ${sop_name}， 配置： ${[step_name, option_name, option.type + '_' + action].join('.')}`)
    }
    return config
}

function isModelFormConfig(config: any) {
    if(isRef(config)) return true
}
</script>
<style lang="less" scoped>
.options-panel{
    padding: 14px;
    color: @text-light-color;
    background-color: @bg-blank;
    outline: 1px dotted @text-light-color !important;
    outline-offset: -4px;
    -webkit-box-shadow: @bg-blank 0 0 0 2px;
    box-shadow: @bg-blank 0 0 0 2px;
    border-radius: 0.2rem;
    min-width: 13rem;
    .list{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .list-top{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.2rem;
        }
        .status{
            font-size: 0.75rem;
            color: @text-label-color;
            opacity: 0.5;
            &.done{
                color: @color-green;
                opacity: 1;
            }
        }
        &:not(:last-child){
            margin-bottom: 0.8rem;
        }
        section{
            padding-left: 30px;
            :deep(.ant-btn-sm){
                font-size: 0.78rem;
            }
        }
    }
}
.btn-xs{
    height: 1.2rem;
    line-height: 1.1rem;
}
</style>