<template>
    <a-modal v-model:open="visable" :title="TITLE" :width="config.width" :footer="null" :maskClosable="false">
        <Form v-if="RandelForm" :config="config" :params="params" @submit-success="handelSuccess()" @download="download">
            <template #footer="{submit, loading}">
                <div class="btns">
                    <a-button @click.prevent="cancel">{{t('btn.cancel')}}</a-button>
                    <a-button :disabled="loading" type="primary" @click.prevent.stop="submit">{{t('btn.confirm')}}</a-button>
                </div>
            </template>
            <template v-for="(_value, name) in $slots" #[name]="slotData">
                <slot :name="name" v-bind="slotData || {}" />
            </template>
        </Form>
    </a-modal>
</template>
<script setup lang="ts">
import Form from "@/components/Form/index.vue"
import { isRef } from "vue";
import { computed, watch, ref } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const RandelForm = ref(false)

const props = defineProps({
    config: {
        type: Object,
        default: () => ({})
    },
    params: {
        type: Object,
        default: () => ({})
    },
    open: {
        type: Boolean,
        default: false
    }
})

const TITLE = computed(() => {
    return isRef(props.config.title) ? props.config.title.value : props.config.title
})

const emits = defineEmits(['update:open', 'submit-success', 'download'])
const visable = computed({
    get() {
        return props.open
    },
    set(value: Boolean) {
        emits('update:open', value)
    }
})
watch(visable, () => {
    if (visable.value) {
        RandelForm.value = true
    } else {
        setTimeout(() => {
            RandelForm.value = false
        }, 300);
    }
}, {
    immediate: true
})

const cancel = () => {
    visable.value = false;
}
const handelSuccess = () => {
    visable.value = false;
    emits('submit-success')
}
const download = (file: any) => {
    emits('download', file)
}
</script>
<style lang="less" scoped>
    .btns{
        display: flex;
        justify-content: end;
        padding-top: 1rem;
    }
</style>