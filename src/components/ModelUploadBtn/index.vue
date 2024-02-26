<template>
    <slot name="btn">
        <a-button type="primary" @click="open = true" v-bind="$attrs">
            <slot>{{ t('btn.upload') }}</slot>
        </a-button>
    </slot>
    <ModelForm :config="_config" :params="params" v-model:open="open" @submit-success="emits('submit-success')" @download="download">
        <template v-for="(_value, name) in $slots" #[name]="slotData">
            <slot :name="name" v-bind="slotData || {}" />
        </template>
    </ModelForm>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import type { FormOptions } from "@/types/index"
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const open = ref(false)
const props = defineProps({
    config: {
        type: Object,
        default: () => ({})
    },
    params: {
        type: Object,
        default: () => ({})
    },
})
const emits = defineEmits(['submit-success', 'download'])
const download = (file: any) => emits('download', file)

const _config = computed(():FormOptions => {
    return Object.assign({
        title: t('btn.upload'),
        api: "/test",
        items: [
            {
                label: t('btn.upload'),
                field: 'file',
                type: 'file',
                required: true,
                maxLength: 1
            }
        ]
    }, props.config) as FormOptions
})

</script>
<style lang="less" scoped>
    .btns{
        display: flex;
        justify-content: end;
        padding-top: 1rem;
    }
</style>