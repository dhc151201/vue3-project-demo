import { nextTick, ref, watch, onActivated, computed, isRef, type Ref } from "vue"
import useRequest from "@/hooks/useRequest"
import { isFunction } from "@/utils"
import type { Record, TableColumnItem, TableColumns } from "@/types"
import i18n from "@/i18n"
const { t } = i18n.global;

/**
 * 监控操作按钮个数
 * @returns 
 */
export const useWatchOper = () => {
    let observer: any = null
    const watchOperRef = (el: HTMLElement, record: any) => {
    
        if (record._childrenLength !== undefined || !el) return; // 很关键， 否则内存会溢出
    
        const callback = () => {
            const child: any = el?.children || []
            record._childrenLength = child.length
        }
        if (observer === null) {
            observer = new MutationObserver(callback);
        }
    
        observer.observe(el, {
            // attributes: true,
            childList: true,
            // subtree: true
        });
        nextTick(() => {
            callback()
        })
    }

    return {
        watchOperRef,
        remove: () => {
            observer?.disconnect()
        }
    }
}
/**
 * 表格数据
 * @param props
 * @returns 
 */
export const useData = (props: any) => {
    const dataSource = ref<{items?: Record[], meta?: Record}>({})
    const dataList = ref<Record[]>([])
    const pagination = ref<{ page: number, limit: number, total: number }>({ page: 1, limit: 10, total: 0 })
    const { loading, run: getTableData, cancel } = useRequest(props.api, {
        manual: true,
        debounceInterval: 300,
        defaultParams: () => {
            return {
                ...pagination.value,
                ...props.query,
                total: undefined
            }
        },
        onSuccess: (res: any) => {
            dataSource.value = res.data;
            const { items, meta } = res.data ?? {}
            dataList.value = items ?? res.data ?? []

            const { total, page, limit } = meta ?? {}
            pagination.value.total = total ?? pagination.value.total
            pagination.value.page = page ?? pagination.value.page
            pagination.value.limit = limit ?? pagination.value.limit
        }
    })
    

    watch(() => props.query, () => {
        loading.value = true;
        cancel()
        getTableData()
    }, {
        immediate: true,
        deep: true
    })

    const changeHandel = (_pagination: any) => {
        pagination.value.page = _pagination.current
        pagination.value.limit = _pagination.pageSize
    }

    onActivated(() => {
        getTableData()
    })

    return {
        loading,
        dataSource,
        dataList,
        pagination: computed(() => {
            return {
                showTotal: () => {
                    return `${t('pagination.total')} ${pagination.value.total} ${t('pagination.per_page')}`
                },
                current: pagination.value.page,
                pageSize: Number(pagination.value.limit),
                total: pagination.value.total
            }
        }),
        getTableData,
        cancel,
        changeHandel
    }
}

/***
 * 表格表头自定义处理
 */
export const useChosedColumns = function (columns: TableColumns | Ref<TableColumns>) {
    const chosedCols = ref<any[]>([])
    const chosedColsOpts = computed(() => {
        const cols = isRef(columns) ? columns.value : columns;
        return (cols?.filter((col: TableColumnItem) => col.awaitChose) || []).map((v: TableColumnItem) => {
            return {
                label: isFunction(v.title) ? (v.title as Function)() : v.title,
                value: v.dataIndex
            }
        })
    })
    const cols = computed(() => {
        const cols = isRef(columns) ? columns.value : columns;
        return cols?.filter((col: any) => !col.awaitChose || chosedCols.value.includes(col.dataIndex)) || []
    })

    return {
        chosedCols,
        chosedColsOpts,
        columns: cols
    }
}

/**
 * 扩展表格相关的
 */
export const useExpanded = () => {
    const expandedRowKeys = ref<string[]>([])
    const taggleExtends = (record: any, rowKey: string = "id") => {
        const key: string = record[rowKey];
        const index = expandedRowKeys.value.findIndex(v => v === key)
        if (index >= 0) {
            expandedRowKeys.value.splice(index, 1)
        } else {
            expandedRowKeys.value = [key]
            // expandedRowKeys.value.push(key)
        }
    }
    return {
        expandedRowKeys,
        taggleExtends
    }
}
