import { Modal } from 'ant-design-vue';
import { h, type VNode } from "vue"

type options = {
    title?: string | any;
    delete?: boolean; // 删除确认
    toast?: boolean; // toast形式的弹窗, 没有取消按钮
    templateClassName?: string; // 自定义模板的外层包装样式名
    template?: string // 自定义模板
    onOkBefore?: () => Promise<any>
}

export default function (content: string | null | VNode, options?: options) {
    return new Promise((res, rej) => {
        let _content: any;
        if (options?.template) {
            _content = h('div', {
                class: options.templateClassName
            }, options.template)
        } else if (options?.delete) {
            _content = '确认删除'
        } else {
            _content = content
        }
        Modal.confirm({
            title: options?.title || "提示",
            content: _content,
            zIndex: 2000,
            okText: "确定",
            cancelText: "取消",
            cancelButtonProps: {
                style: options?.toast ? 'display: none' : ''
            },
            onOk: async () => {
                if (options?.onOkBefore) {
                    await options.onOkBefore()
                }
                res(true)
            },
            onCancel: () => {
                rej()
            }
        })
    })

}