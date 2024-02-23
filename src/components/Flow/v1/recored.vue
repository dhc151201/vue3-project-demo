<template>
    <div class="model" ref="el">
        <h2>工单动态</h2>
        <div class="list-box">
            <li v-for="item of 50">武汉维护文本文本和本地化发表过的风格和和对方个别地方干部的风格机会都不给的风格</li>
        </div>
    </div>
</template>
<script setup lang="ts">

</script>
<style lang="less" scoped>
    .model{
        background-color: #212129;
        border-radius: 6px;
        height: 100%;
        max-height: 100%;
        padding: 1px 0.8rem 0.2rem;
        display: flex;
        flex-direction: column;
        h2{
            margin: 0.5rem 0;
        }
        .list-box{
            flex: 1;
            min-height: 1px;
            overflow: auto;
            margin-right: -0.8rem;
            padding-right: 0.8rem;
        }
    }
</style>