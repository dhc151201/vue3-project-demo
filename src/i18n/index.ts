import { createI18n } from 'vue-i18n'
import zh from './config/zh'
import en from './config/en'
import { getLocalLang } from "@/hooks/useLang"

const i18n = createI18n({
    legacy: false,
    locale: getLocalLang(),
    messages: {
        zh,
        en
    }
})

export default i18n