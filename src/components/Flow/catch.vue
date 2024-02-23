<template>
    <div class="model">
        <Copy ref="refCopyForm" v-if="step.showCopy" :step="step" v-model:form-state="copyModel"></Copy>
        <div class="title">{{ t('btn.archive') }}</div>
        <Form :config="config">
            <template  #footer="{submit, loading}">
                <a-button :disabled="loading || step.disabledCatch" type="primary" @click.prevent.stop="submit">{{t('sop.confirm.sure_catch')}}</a-button>
            </template>
        </Form>
    </div>
</template>
<script setup lang="ts">
import Form from "@/components/Form/index.vue"
import Copy from "@/components/Flow/copy.vue"
import type { FormOptions } from "@/types";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps({
    step: {
        type: Object,
        default: () => ({})
    }
})
const refCopyForm = ref<any>(null)
const copyModel = ref({})

const config = computed((): FormOptions => ({
    model: copyModel,
    onSubmit: async (data: any) => {
        await refCopyForm.value.submit()
        debugger
    },
    options: {disabled: props.step.disabledCatch, labelCol: {span: 5}},
    items: [
        {
            label: t('sop.confirm.note'),
            field: "note",
            required: true,
            type: "textarea",
            inputOptions: {
                maxLength: 500,
                placeholder: t('inputMaxLength').replace("[]", '500'),
                autoSize: { minRows: 2, maxRows: 3 },
            }
        }
    ]
}))
</script>
<style lang="less" scoped>
@import url(./card.less);
</style>