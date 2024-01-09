<template>
    <VueFlow class="my-flow" v-model="elements"></VueFlow>
</template>
<script lang="ts" setup>
//样式引入
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { ref } from 'vue';

const data = [
    { id: '1', type: 'input', label: 'Node 1', position: { x: 250, y: 5 }, class: 'start' },
    { id: '2', label: 'Node 2', position: { x: 100, y: 100 } },
    { id: '3', label: 'Node 3', position: { x: 400, y: 100 } },
    { id: '4', label: 'Node 4', position: { x: 400, y: 200 } },
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e1-3', source: '1', target: '3' },
    { id: 'e1-4', source: '3', target: '4' },
]
const elements = ref(data)

const { onPaneReady, onNodeDragStop, onConnect, addEdges, setTransform, toObject, nodes, edges } = useVueFlow()
onPaneReady(({ fitView }) => {
    fitView()
  console.log(nodes)
})

</script>
<style lang="less" scoped>
    .my-flow{
        width: 100%;
        height: 100%;
    }
    :deep(.start){
        background: red;
    }
</style>