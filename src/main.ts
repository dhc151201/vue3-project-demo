import "@/styles/global.less"
import "@/styles/ant.meta.less"
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import DirectiveTrim from "@/directives/trim"
import StopAutocomplete from "@/directives/autocomplete"

const app = createApp(App)

app.use(createPinia())
app.use(router)

DirectiveTrim(app)
StopAutocomplete(app)

app.mount('#app')
