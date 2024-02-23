import type { Record } from "@/types";
import { computed } from "vue";
import { isZh } from "./useLang";

export const compRole = computed(() => (data: Record) => {
    return (isZh.value ? data.role_display_name : data.role_name) ?? data.role_name ?? ''
})