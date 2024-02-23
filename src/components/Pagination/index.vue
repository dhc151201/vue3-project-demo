<template>
    <div class="m-pagination">
        <div class="total">
            <span v-if="showTotal">{{ t('pagination.total') }} {{ total }} {{ t('pagination.per_page') }}</span>
        </div>
        <div class="empty-full"></div>
        <a-pagination v-model:current="current" v-model:pageSize="pageSize" :total="total" @change="change"
            :show-size-changer="false">
        </a-pagination>
        <div ref="pagRef" style="position: relative;"></div>
        <a-popover v-if="showSizeChanger" trigger="hover" color="#090909" overlayClassName="pagination-popover"
            :getPopupContainer="() => pagRef">
            <template #content>
                <div class="change-limit-options">
                    <p v-for="v of [5, 10, 20, 50]" :key="v" @click="chageLimit(v)" :class="{ active: v === limit }">{{ v
                    }}{{ t('page_size') }}</p>
                </div>
            </template>
            <a-button class="change-limit-btn">
                {{ limit }}{{ t('page_size') }}
                <DownOutlined :style="{ fontSize: '0.7rem' }" />
            </a-button>
        </a-popover>
    </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n";
import { DownOutlined } from '@ant-design/icons-vue';

const { t } = useI18n();

const emits = defineEmits(["update:page", "update:limit", "change"])
const props = defineProps({
    page: {
        type: Number,
        default: 1
    },
    limit: {
        type: Number,
        default: 10
    },
    total: {
        type: Number,
        default: 0
    },
    showTotal: {
        type: Boolean,
        default: true
    },
    showSizeChanger: {
        type: Boolean,
        default: true
    },
})

const current = computed({
    get() { return props.page },
    set(val) { emits("update:page", val) }
})
const pageSize = computed({
    get() { return props.limit },
    set(val) { emits("update:limit", val) }
})

const change = () => {
    emits("change", {
        page: current.value,
        limit: pageSize.value
    })
}

const pagRef = ref()
const chageLimit = (limit: number) => {
    if (limit !== pageSize.value) {
        pageSize.value = limit
        change()
    }
}
</script>
<style lang="less" scoped>

.m-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5em 0 1.5em;
}

.empty-full {
    flex: 1;
}

.total {
    font-size: 1.05em;
    color: @text-label-color;
}

.change-limit-btn {
    background-color: #090909;
    color: @text-light-color;
    border-color: transparent;
    min-width: 90px;

    &:hover {
        cursor: pointer;
    }
}

.change-limit-options {
    color: @text-light-color;
    width: 90px;
    background-color: @bg-blank-light;
    border-radius: 0.4rem;
    padding: 0.3rem;
    font-size: 0.9rem;

    p {
        margin: 0;
        padding: 0.6rem 0.5rem;
        line-height: 1;
        border-radius: 0.3rem;

        transition: all 300ms;

        &.active {
            background-color: #090909;
        }

        &:not(.active):hover {
            cursor: pointer;
            background-color: rgba(10, 10, 10, 0.09);
        }
    }
}
</style>
<style lang="less">
.pagination-popover {
    .ant-popover-arrow::before {
        background-color: @bg-blank-light;
    }

    .ant-popover-inner {
        padding: 0;
    }
}
</style>