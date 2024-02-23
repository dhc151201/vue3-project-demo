<template>
    <!-- 表格头部 自定义表头勾选 -->
    <div class="table-top-row" v-if="chosedColsOpts.length">
        <a-popover overlayClassName="bg-lighter-popover" placement="bottomRight" trigger="click" :getPopupContainer="() => chosePopver">
            <template #content>
                <a-checkbox-group v-model:value="chosedCols" :options="chosedColsOpts" />
            </template>
            <a-button class="action-chose-th" type="primary" ghost>{{ t('other_th') }}
                <CaretDownOutlined class="action-xiala" />
                <span @click.stop ref="chosePopver" class="chose-mount-element"></span>
            </a-button>
        </a-popover>
    </div>
    <a-table sticky :loading="loading" :data-source="dataList" :columns="_columns" :pagination="pagination" v-bind="$attrs" @change="changeHandel">
        <template #expandColumnTitle></template>
        <template #expandIcon></template>
        <template #emptyText>
            <div v-if="loading === false">
                <slot name="emptyText">
                    <a-empty :description="t('table.no_data')" class="no-data" style="padding: 3rem 0;" :image="simpleImage" />
                </slot>
            </div>
            <div v-else :style="{ height: $attrs.size === 'small' ? '20px' : '30px' }"></div>
        </template>
        <template #bodyCell="{ text, column, record }">
            <!-- 扩展表格 -->
            <template v-if="column.key === 'extend'">
                <div style="width: 30px">
                    <right-outlined class="extends-icon" :class="{ extends: extendsIcon(record) }" @click="taggleExtends(record, rowKey as string)" />
                </div>
            </template>
            <!-- 操作 -->
            <template v-else-if="column.slot === 'operation'">
                <!-- 启用收缩 -->
                <template v-if="shrinkOper">
                    <!-- 元素个数小于1个 -->
                    <div :style="{ display: record._childrenLength < 2 ? '' : 'none' }">
                        <span :ref="(val: any) => watchOperRef(val, record)">
                            <slot :name="column.slot" :column="column" :record="record" :text="text"></slot>
                        </span>
                    </div>
                    <!-- 元素个数大于1个 -->
                    <a-popover v-if="record._childrenLength && record._childrenLength > 1"
                        overlayClassName="bg-lighter-popover" :arrowPointAtCenter="true" placement="topRight">
                        <template #content>
                            <slot :name="column.slot" :column="column" :record="record" :text="text"></slot>
                        </template>
                        <a-button class="more-btn" type="primary" ghost size="small">{{ t('table.col_action') }}</a-button>
                    </a-popover>
                </template>
                <!-- 不启用收缩 -->
                <template v-else>
                    <slot :name="column.slot" :column="column" :record="record" :text="text"></slot>
                </template>
            </template>
            
            <!-- 空值 -->
            <template v-else-if="[undefined, null, ''].includes(text)">--</template>

            <!-- 省略处理 -->
            <template v-else-if="column.tooltip">
                <div></div>
                <div style="position: relative;" ref="tooltipRef"></div>
                <a-tooltip color="#090909" v-bind="tooltip" :getPopupContainer="() => tooltipRef">
                    <template #title>
                        <template v-if="isFunction(column.tooltip)">{{ column.tooltip({
                            text, record, column
                        })
                        }}</template>
                        <template v-if="isString(column.tooltip)">{{ column.tooltip }}</template>
                        <template v-else>
                            <slot :name="column.slot" :column="column" :record="record" :text="text">
                                {{ column.customRender ? column.customRender({ text, record, column }) : text }}
                            </slot>
                        </template>
                    </template>
                    <div class="text-overflow-line1" :style="{ maxWidth: column.width + 'px' }">
                        <slot :name="column.slot" :column="column" :record="record" :text="text">
                            {{ column.customRender ? column.customRender({ text, record, column }) : text }}
                        </slot>
                    </div>
                </a-tooltip>
            </template>

            <!-- 自定义插槽 -->
            <slot v-else-if="column.slot" :name="column.slot" :text="text" :column="column" :record="record">
                <!-- 日期时间 -->
                <template v-if="column.slot === 'date' || column.date === true">
                    {{ DateTimeZone(text, column.dateFormat || 'YYYY-MM-DD') }}
                </template>
                <!-- 图片 -->
                <template v-else-if="column.picture">
                    <template v-if="Array.isArray(text)"><a-image v-for="src of text" :key="src" :width="60" :src="src"/></template>
                    <a-image v-else :width="60" :src="text"/>
                </template>
                <!-- 枚举渲染 -->
                <template v-else-if="column.dic">
                    {{ column.dic[text] ?? text }}
                </template>
                <!-- 其他 -->
                <template v-else-if="column.dataIndex">
                    {{ text }}
                </template>
            </slot>
            <!--  非customRender -->
            <template v-else-if="column.dataIndex && !column.customRender">
                {{ text }}
            </template>
        </template>
        <template v-for="(_value, name) in $slots" #[name]="slotData">
            <slot :name="name" v-bind="slotData || {}" />
        </template>
    </a-table>
    <slot name="footer" :source="dataSource" :meta="dataSource.meta"></slot>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, ref, computed, type Ref } from "vue"
import { RightOutlined, CaretDownOutlined } from '@ant-design/icons-vue';
import { Empty } from 'ant-design-vue';
import { useWatchOper, useData, useChosedColumns, useExpanded } from "@/hooks/useTable"
import { DateTimeZone } from "@/hooks/useTimezone"
import { isFunction, isString } from "@/utils/index"
import type { Record, TableColumns } from "@/types"
import { useI18n } from "vue-i18n";
import { useAttrs } from "vue";
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
const { t } = useI18n();

const props = defineProps({
    api: {
        type: String,
        default: ""
    },
    query: {
        type: Object,
        default: () => ({})
    },
    // 是否搜集btn，只展示一个
    shrinkOper: {
        type: Boolean,
        default: true
    },
    tooltip: {
        type: Object,
        default: () => ({ color: 'rgba(200, 200, 200, .98)', overlayInnerStyle: { color: '#111' } })
    },
})

// 扩展
const { rowKey } = useAttrs()
const { expandedRowKeys, taggleExtends } = useExpanded()
const extendsIcon = computed(() => (record: any) => {
    return expandedRowKeys.value.find((v: string | number) => v === record[rowKey as string])
})

// 表头筛选
const { columns } = useAttrs()
const chosePopver = ref()
const { chosedCols, chosedColsOpts, columns: _columns } = useChosedColumns(computed(() => columns) as Ref<TableColumns>)

// tooltip
const tooltipRef = ref()

// 操作按钮
const { watchOperRef, remove } = useWatchOper()
onBeforeUnmount(() => remove())

// 表格数据、分页、接口
const { loading, dataSource, dataList, pagination, getTableData, cancel, changeHandel } = useData(props);
onBeforeUnmount(() => cancel())

defineExpose({
    source: dataSource,
    list: dataList,
    meta: computed(() => dataSource.value.meta),
    refresh: (query: Record) => {
        loading.value = true;
        cancel()
        Object.assign(pagination.value, query),
        getTableData(query);
    },
})
</script>
<style lang="less" scoped>
.table-top-row {
    display: flex;
    justify-content: space-between;
    margin: 0 0 0 0;
    height: 0;
    position: relative;

    .action-chose-th {
        position: absolute;
        bottom: 0;
        right: 0;
    }
}
:deep(.text-overflow-line1){
    display: inline-block;
}
</style>