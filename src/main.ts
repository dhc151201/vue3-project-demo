import "@/styles/global.less"
import "@/styles/ant.meta.less"
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import DirectiveTrim from "@/directives/trim"
import DirectiveStopAutocomplete from "@/directives/autocomplete"
import ModelFormBtn from "@/components/ModelFormBtn/index.vue"
import ModelTableBtn from "@/components/ModelTable/index.vue"
import DcTable from "@/components/Table/index.vue"

const app = createApp(App)
app.use(createPinia())
app.use(router)
DirectiveTrim(app)
DirectiveStopAutocomplete(app)
app.component('ModelTableBtn', ModelTableBtn)
app.component('ModelFormBtn', ModelFormBtn)
app.component('DcTable', DcTable)

app.mount('#app')
