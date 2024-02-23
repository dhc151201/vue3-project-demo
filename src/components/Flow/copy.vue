<template>
    <div class="model">
        <div class="title">{{ t('tbxx') }}</div>
        <Form ref="refForm" :config="config" v-model:form-state="model"></Form>
    </div>
</template>
<script setup lang="ts">
import Form from "@/components/Form/index.vue"
import { compRole } from "@/hooks/useRole";
import type { FormOptions } from "@/types";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps({
    step: {
        type: Object,
        default: () => ({})
    },
    formState: {
        type: Object,
        default: () => ({})
    },
})
const emits = defineEmits(["update:form-state"])

const model = computed({
    get() {
        return props.formState
    },
    set(value) {
        emits("update:form-state", value)
    }
})

const config = computed((): FormOptions => ({
    options: { disabled: props.step.disabledNext, labelCol: { span: 0 } },
    items: [
        ...props.step.copyOptions?.map((item: any) => {
            return {
                label: compRole.value(item),
                field: 'copy_user_id',
                required: true,
                type: "select",
                dic: item.dic
            }
        }) || [],
    ]
}))

const refForm = ref<any>(null)
defineExpose({
    submit: () => refForm.value?.submit(),
    model: refForm.value?.model
})
</script>
<style lang="less" scoped>
@import url(./card.less);
</style>