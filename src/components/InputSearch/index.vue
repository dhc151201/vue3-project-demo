<template>
<a-input-search 
    v-model:value="model[searchKey]"
    :placeholder="t('please_input')"
    style="width: 300px" 
    enter-button 
    v-trim 
    allowClear 
    @search="handelSearch"
>
    <template v-if="dic.length > 0" #addonBefore>
        <dc-select v-model:value="model[searchTypeKey]" style="width: 90px" :options="dic" :placeholder="t('select.placeholder')"></dc-select>
    </template>
</a-input-search>
</template>
<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useI18n } from "vue-i18n";
const { t } = useI18n()

const props = defineProps({
    dic: {
        type: Array,
        default: () => []
    },
    value: {
        type: Object,
        default: () => ({})
    },
    searchKey: {
        type: String,
        default: "keyword"
    },
    searchTypeKey: {
        type: String,
        default: "search_type"
    }
})
const emits = defineEmits(['update:value', 'search'])

const model = ref({
    [props.searchKey]: undefined,
    [props.searchTypeKey]: undefined
})
const handelSearch = () => {
    emits('update:value', {
        ...props.value,
        ...model.value
    })
    nextTick(() => {
        emits('search', model.value)
    })
}
</script>
<style lang="less" scoped>
    :deep(.ant-input-group-addon){
        padding: 0;
        border: none;
        .ant-select-selector{
            border-right: 0 !important;
        }
    }
</style>