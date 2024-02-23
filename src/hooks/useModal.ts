import { computed } from "vue"

export const propsConfig = {
    show: {
        type: Boolean,
        default: false
    }
}
export const emitsConfig = ["update:show"]

export default function (props: any, emits: any) {
    const visable = computed({
        get() {
            return props.show
        },
        set(val) {
            emits("update:show", val)
        }
    })

    return { visable };
}