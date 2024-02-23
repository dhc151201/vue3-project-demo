/***
 * 手动调用 错误信息提示组件
 */


import { createApp } from "vue"
import ErrorModel from "@/components/ModelError/index.vue"

export default () => {
    let app: any = null
    let parent: any = null

    // 关闭组件
    let closeErrorModel = () => {
        if (app) {
            app._instance.data.show = false
        }
    }

    // 打开组件
    const openErrorModel = (props: {
        errors: any[];
        tips?: string;
        isArray?: Boolean;
    }) => {

        app = createApp({
            template: `<ErrorModel v-model:show="show" :errors="errors" :tips="tips" :isArray="isArray"></ErrorModel>`,
            data: () => {
                return {
                    show: true,
                    ...props
                }
            },
            watch: {
                show: function(val) {
                    if (val === false) {
                        setTimeout(() => {
                            app.unmount()
                            document.body.removeChild(parent)
                        }, 1000)
                    }
                }
            },
            components: {
                ErrorModel: ErrorModel
            },
            onMounted() {
                closeErrorModel = () => {
                    this.show = false;
                }
            }
        })

        app.use(i18n)

        parent = document.createElement('div')
        document.body.appendChild(parent)
        app.mount(parent);
    }

    return {
        openErrorModel,
        closeErrorModel,
    }
}