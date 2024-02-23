<template lang="">
    <div class="top" v-if="y > 500" @click="y = 0">
        <VerticalAlignTopOutlined />
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue"
import { VerticalAlignTopOutlined } from '@ant-design/icons-vue';
import { useScroll } from '@vueuse/core'
const el: any = ref(document.querySelector('#Router-Page'))
const { y } = useScroll(el, { behavior: 'smooth' })
</script>
<style lang="less" scoped>
    .top{
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        bottom: 10%;
        right: 4rem;
        width: 3.2rem;
        height: 3.2rem;
        border-radius: 50%;
        border: 1px solid;
        box-shadow: 0 0 15px rgba(0, 0, 0, .3);
        font-size: 1.5rem;
        color: #fff;
        background-color: @color-primary;
        border-color: @color-primary;
        opacity: 0.9;
        transition: opacity 200ms;
        &:hover{
            opacity: 1;
            cursor: pointer;
        }
    }
</style>