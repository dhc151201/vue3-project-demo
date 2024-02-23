<template >
    <a-modal v-model:open="visable" zIndex="1051" :title="t('confirm.title')" :maskClosable="false" :okText="t('wzdl')" @ok="okHnadel" :cancelButtonProps="{style: 'display: none'}">
        <slot name="header"></slot>
        <slot>
            <div class="tr">
                <span class="th">{{ t('xinxi') }}</span>
                <span class="th">{{ t('question') }}</span>
            </div>
            <c-scrollbar class="body" :height="list.length > 5 ? '200px' : ''">
                <div class="tr" v-for="(item, index) of list" :key="index">
                    <td class="td">
                        <template v-if="![null, undefined, ''].includes(item.accessory_type)">
                            {{ t(`devices.${item.accessory_type}`) }}
                        </template>
                        {{ item.label }}
                    </td>
                    <td class="td color-warning">
                        <template v-if="Array.isArray(item.value)">
                            <span v-for="(v, i) of item.value" :key="i">
                                {{ typeof v === 'string' ? t(v) : v }}
                            </span>
                        </template>
                        <template v-else-if="isObject(item.value)">{{ item.value }}</template>
                        <template v-else>{{ t(item.value) }}</template>
                    </td>
                </div>
            </c-scrollbar>
        </slot>
        <slot name="footer">
            <footer>
                {{ tips }}
            </footer>
        </slot>
    </a-modal>
</template>
<script setup lang="ts">
import { watch, ref } from "vue"
import { emitsConfig, propsConfig } from "@/hooks/useModal";
import useModal from "@/hooks/useModal";
import { isObject } from "@/utils/index";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps({
    ...propsConfig,
    // 错误描述list
    errors: {
        type: Array,
        default: () => []
    },
    // 底部提示
    tips: {
        type: String,
        default: ""
    },
    isArray: {
        type: Boolean,
        default: false
    }
})
const emits = defineEmits(emitsConfig)
const { visable } = useModal(props, emits)

const okHnadel = () => visable.value = false;

const list = ref<{ label: string, value: any, accessory_type?: string }[]>([])
watch(() => props.errors, () => {
    list.value = []
    if (!props.errors) return;

    for (let k in props.errors) {
        // 数组格式的数据组装
        if (props.isArray) {
            list.value.push(props.errors[k] as any)
        } else {
            list.value.push({
                label: k,
                value: props.errors[k]
            })
        }
    }
}, {
    immediate: true
})
</script>
<style lang="less" scoped>
.tr {
    display: flex;
    justify-content: space-between;
    font-size: 0.7rem;
}

.body .tr {
    border-bottom: 1px solid @border-color;
}

.th {
    color: @border-color;
    background-color: black;
}

.td {
    span+span {
        margin-left: 1em;
    }
}

.th,
.td {
    flex: 1;
    max-width: 50%;
    min-width: 0px;
    height: calc(100%);
    padding: 0.65rem 0.8rem;

    &:last-child {
        text-align: right;
    }
}

.color-warning {
    color: @color-warning;
}

footer {
    font-size: 0.7rem;
    padding: 1rem 0 0;
    transform: translateY(10px);
}

:deep(.ant-modal-footer button:first-child) {
    display: none;
}
</style>