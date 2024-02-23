<template>
    <div class="model">
        <Form :config="config">
            <template  #footer="{submit, loading}">
                <a-button :disabled="loading" type="primary" @click.prevent.stop="submit">{{t('btn.confirm')}}</a-button>
            </template>
        </Form>
    </div>
</template>
<script setup lang="ts">
import Form from "@/components/Form/index.vue"
import type { FormOptions } from "@/types";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const config = computed((): FormOptions => ({
    onSubmit: async () => { },
    options: {labelCol: {span: 7}},
    items: [
        {
            label: t('sop.log.new_node'),
            field: 'send_user_id',
            required: true,
            type: "select-multiple"
        },
        {
            label: t('sop.log.summary'),
            field: "note",
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
    .model{
        background-color: #212129;
        border-radius: 6px;
        padding: 1rem 0.8rem 0.8rem;
        margin-bottom: 1rem;
    }
    .ant-btn{
        margin: auto;
        display: block;
    }
</style>