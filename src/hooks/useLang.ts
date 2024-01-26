import { computed, type Ref } from "vue"
import { getCookie, setCookie } from "./useCookie"
import i18n from "@/i18n"

const langKey = "lang"
type lang = 'zh' | 'en'

/**
 * 获取语言值（优先级：缓存 > 浏览器语言 > 默认语言zh中文）
 * @returns zh | en
 */
export const getLocalLang = (): lang => {
    return (getCookie(langKey) || {
        'zh-CN': 'zh',
        'zh': 'zh',
        'zh-TW': 'zh',
        'en-US': 'en',
    }[navigator.language] || 'zh') as lang
}

/**
 * 本地语言设置
 * @param value 语言值
 */
export const setLocalLang = (value: 'zh' | 'en') => {
    setCookie(langKey, value, 100)
    document.body.classList.remove("zh")
    document.body.classList.remove("en")
    document.body.classList.add(value)
}

/**
 * 计算属性，是否是中文
 */
export const isZh:Ref<boolean> = computed(() => i18n.global.locale.value === 'zh')