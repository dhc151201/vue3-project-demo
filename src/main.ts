import "@/styles/global.less"
import "@/styles/ant.meta.less"
import { createApp } from 'vue'
import i18n from '@/i18n'
import App from './App.vue'
import router from './router'
import DirectiveTrim from "@/directives/trim"
import DirectiveStopAutocomplete from "@/directives/autocomplete"
import ModelFormBtn from "@/components/ModelFormBtn/index.vue"
import ModelUploadBtn from "@/components/ModelUploadBtn/index.vue"
import ModelTableBtn from "@/components/ModelTable/index.vue"
import BtnExport from "@/components/Export/index.vue"
import DcTable from "@/components/Table/index.vue"
import DcSelect from "@/components/Select/index.vue"
import DelBtn from "@/components/DelBtn/index.vue"

const app = createApp(App)
app.use(i18n)
app.use(router)
DirectiveTrim(app)
DirectiveStopAutocomplete(app)
app.component('ModelTableBtn', ModelTableBtn)
app.component('ModelUploadBtn', ModelUploadBtn)
app.component('ModelFormBtn', ModelFormBtn)
app.component('DcTable', DcTable)
app.component('BtnExport', BtnExport)
app.component('DcSelect', DcSelect)
app.component('DelBtn', DelBtn)

app.mount('#app')
