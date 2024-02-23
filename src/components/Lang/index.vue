<template>
    <!-- {{ locale }} -->
    <a-switch v-model:checked="locale" :checked-children="t('zh')" :un-checked-children="t('en')" checkedValue='zh' unCheckedValue='en' />
</template>
<script setup lang="ts">
import { watch } from "vue";
import { setLocalLang } from '@/hooks/useLang';
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
watch(locale, (val: any) => {
    setLocalLang(val)
})
</script>
<style lang="">
    
</style>