<template>
    <div class="page-title">
        <div class="title-center" @click="back ? backHandel() : undefined">
            <slot name="prefix">
                <left-outlined class="back-icon" v-if="back" />
            </slot>
            <span class="title">
                {{title}}
            </span>
        </div>
        <div class="default-slot">
            <slot></slot>
        </div>
        <div class="suffix">
            <slot name="suffix"></slot>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router"
import { LeftOutlined } from "@ant-design/icons-vue";
const props = defineProps({
    title: {
        type: String,
        default: ""
    },
    back: {
        type: Boolean,
        default: true
    },
    // 自定义返回逻辑
    customBcak: {
        type: Boolean,
        default: false
    }
})
const emits = defineEmits(["back"])

const router = useRouter()
const backHandel = () => {
    if (props.back) emits("back")
    if (!props.customBcak) {
        router.back()
    }
}
</script>
<style lang="less" scoped>
    .page-title{
        padding-top: 1rem;
        padding-bottom: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: @bg-blank-light;
        border-radius: 6px;
    }
    .title-center{
        display: flex;
        align-items: center;
        .back-icon{
            font-size: 1.2em;
            margin-right: 0.5em;
            &:hover{
                color: @color-primary;
            }
        }
        &:hover{
            cursor: pointer;
        }
    }
    .title{
        font-size: 1.5rem;
        font-weight: bold;
    }
    .suffix{
        min-width: 0;
        &:deep( > * + *) {
            margin-left: 1rem;
        }
    }
    .default-slot{
        flex: 1;
        min-width: 0;
    }
</style>