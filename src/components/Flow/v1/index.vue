<template>
<div class="flox-model">
    <div class="flow" id="flox-box">
        <table>
            <thead>
                <tr>
                    <th v-for="role of roles" :key="role.title">
                        <div class="role">{{role.title}}</div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, rowIndex) of SopStepsTable" :key='rowIndex'>
                    <td v-for="(step, colIndex) of row" :key="step?.id || colIndex" :colspan="step?.colspan" :class="{
                        'current-role': colIndex === 2
                    }">
                        <a-dropdown v-if="step" :getPopupContainer="() => step.element">
                            <div class="step-box" :ref="(el) => step.element = (el as any)" >
                                <div class="step" :class="{
                                    end: step.node_id === -2,
                                    done: step.status === 'done',
                                    'has-options': step.options && step.options.length > 0
                                }">
                                    <div class="step-name">{{step?.step_name}}</div>
                                    <div class="step-allow">
                                        <CaretDownOutlined />
                                    </div>
                                </div>
                            </div>
                            <template #overlay>
                                <Option :step="step"></Option>
                            </template>
                        </a-dropdown>
                    </td>
                </tr>
                <tr><td class="footer-td"></td></tr>
            </tbody>
        </table>
    </div>
</div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
import { CaretDownOutlined } from '@ant-design/icons-vue';
import { useRoute, useRouter } from "vue-router"
import { type SOP } from "@/types";
import Sop from "@/components/Flow/core";
import Option from "@/components/Flow/option.vue"
const { id } = useRoute().params

const { loading, roles, steps, SopStepsTable }: SOP = Sop(Number(id))
</script>
<style lang="less" scoped>
.flox-model{
    overflow-x: auto;
}
.flow{
    border-radius: 0.25rem;
    display: flex;
    overflow: visible;
}
table{
    width: 100%;
    background-color: #212129;
    border: 5px dashed #383845;
    th{
        padding-top: 1.3rem;
        padding-bottom: 1.3rem;
    }
    td{
        position: relative;
    }
    tbody tr:not(:last-child)>td:not(:last-child){
        border-right: 2px dotted rgba(92,126,229,.2);
    }
}
th,td{
    padding: 2rem 2rem;
    text-align: center;
    &.current-role::after{
        content: "";
        display: block;
        position: absolute;
        left: 2rem;
        right: 2rem;
        top: 0;
        bottom: 0;
        background-image: linear-gradient(to bottom,rgba(92,126,229,.25) 20%,transparent 20%);
        background-size: 1px 5px;
    }
    &.footer-td{
        padding: 0.8rem;
    }
}
table, td, th{
    border-collapse: collapse;
}
.role{
    min-height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 3px solid rgba(92,126,229,.2);
    text-align: center;
    padding-bottom: 0.5rem
}
.step-box{
    display: inline-block;
}
.step{
    border-radius: 0.25rem;
    outline: 2px solid rgba(0,0,0,.3);
    outline-offset: -4px;
    color: #09090b;
    background-color: #b0b4b6;
    padding: 8px;
    min-height: 3.2rem;
    display: flex;
    align-items: center;
    text-align: center;
    min-width: 140px;
    max-width: 200px;
    margin: auto;
    position: relative;
    z-index: 10;
    &.end{
        border-radius: 2rem;
        min-width: 100px;
    }
    &.done{
        background-color: #0aac61;
        color: #d0d4d6;
    }
    &.has-options{
        cursor: pointer;
        .step-allow{
            display: flex;
        }
    }
}
.step-name{
    width: 100%;
}
.step-allow{
    background-color: @text-label-color;
    height: 14px;
    color: #fff;
    margin-right: -0.4rem;
    transform: translateY(17px);
    display: none;
    align-items: center;
}
</style>