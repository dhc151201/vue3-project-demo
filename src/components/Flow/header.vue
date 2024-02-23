<template>
    <page-title :title="t('btn.back')">
        <div class="sop-base-info">
            <span class="text-label" v-if="info?.farm_name">{{ t('sop.firm_name_') }}</span>{{ info.farm_name }}
            <span class="text-label">{{ t('sop.sop_name_') }}</span>
            <a-tooltip>
                <template #title>{{ info.sop_name }}</template>
                <span class="text-overflow-line1 sop-name">{{ info.sop_name ||
                    "..." }}</span>
            </a-tooltip>
            <span class="text-label">{{ t('sop.sop_no_') }}</span>{{ info.sop_no || "..." }}
            <span class="text-label">{{ t('sop.workflow_name_') }}</span>{{ info.template?.name ?
                t(`sop.list.${info.template?.name}`)
                :
                '...' }}

            <span class="text-label">{{ t('status.label') }}: </span>
            <a-tag v-if="info.status" :class="tagClass">{{ t('status.' + info.status) }}</a-tag>
            <template v-else>...</template>
        </div>
    </page-title>
</template>
<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n";
const props = defineProps({
    info: {
        type: Object,
        default: () => ({})
    }
})
const { t } = useI18n();

const tagClass = computed(() => {
    const status = props.info.status;
    if (status === "question") return "warning"
    else return ""
})
</script>
<style lang="less" scoped>
:deep(.title){
    font-size: 1rem;
    margin: 0.5rem 0;
}
.sop-base-info {
    display: inline-block;
    margin-left: 20px;
    margin-right: 20px;
    .text-label{
        margin-left: 1rem;
    }
}
</style>