import "@/styles/global.less"
import "@/styles/ant.meta.less"
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import DirectiveTrim from "@/directives/trim"
import DirectiveStopAutocomplete from "@/directives/autocomplete"
import ModelFormBtn from "@/components/ModelFormBtn/index.vue"

const app = createApp(App)
app.use(createPinia())
app.use(router)
DirectiveTrim(app)
DirectiveStopAutocomplete(app)
app.component('ModelFormBtn', ModelFormBtn)

app.mount('#app')
