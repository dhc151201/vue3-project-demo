<template>
    <a-button type="primary" size="small" @click="link" v-bind="$attrs">
        <slot>{{t('btn.detail')}}</slot>
    </a-button>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps({
    path: {
        type: String,
        default: ""
    },
    query: {
        type: Object,
        default: () => ({})
    },
    type: {
        type: String,
        default: "push"
    }
})

const router = useRouter()
const link = async () => {
    router[props.type as 'push' | 'replace']({
        path: props.path,
        query: props.query
    })
}
</script>
<style lang="">
    
</style>