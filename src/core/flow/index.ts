import { ref } from "vue"
import useStep from "./libs/useStep"
import useLine from "./libs/useLine"
import useInfomation from "./libs/useInfomation"
import type {Flow} from "@/types"

export default () => {
    const Flow = ref<Flow|undefined>()

    const create = () => {

    }

    const mount = () => {

    }

    const update = () => {

    }

    const unmount = () => {
        
    }

    return {
        Flow,
        create,
        mount,
        update,
        unmount
    }
}