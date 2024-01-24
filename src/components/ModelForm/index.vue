<template>
    <a-modal v-model:open="visable" :title="config.title" :width="config.width" :footer="null" :maskClosable="false">
        <Form v-if="RandelForm" :config="config" @submit-success="handelSuccess()">
            <template #default="{submit, loading}">
                <div class="btns">
                    <a-button @click.prevent="cancel">取消</a-button>
                    <a-button :disabled="loading" type="primary" @click.prevent.stop="submit">确定</a-button>
                </div>
            </template>
        </Form>
    </a-modal>
</template>
<script setup lang="ts">
import Form from "@/components/Form/index.vue"
import { computed, watch, ref } from "vue";
const RandelForm = ref(false)

const props = defineProps({
    config: {
        type: Object,
        default: () => ({})
    },
    open: {
        type: Boolean,
        default: false
    }
})
const emits = defineEmits(['update:open'])
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
        RandelForm.value = false
    }
}, {
    immediate: true
})

const cancel = () => {
    visable.value = false;
}
const handelSuccess = () => {
    visable.value = false;
}
</script>
<style lang="less" scoped>
    .btns{
        display: flex;
        justify-content: end;
        padding-top: 1rem;
    }
    .ant-btn + .ant-btn{
        margin-left: 1rem;
    }
</style>