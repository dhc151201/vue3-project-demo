import type { SopRoles, SopStepItemOption, SopSteps } from "@/types";

export const roles: SopRoles = [
    {
        role_id: 1,
        title: '角色1'
    },
    {
        role_id: 2,
        title: '角色2'
    },
    {
        role_id: 3,
        title: '角色3'
    },
    {
        role_id: 4,
        title: '角色4'
    },
]
const optionItem: SopStepItemOption = {
    option_name: "test_option",
    status: false,
    key: "sdfdsfsfsfsd",
    type: 'form',
    do: ["view", "edit"]
}

export const steps: SopSteps = !location.href.includes('sop-new') ? [
    {
        id: 1,
        node_id: 1,
        step_id: 1,
        role_id: 2,
        status: 'peading',
        step_name: "test_step",
        options: [
            optionItem, optionItem
        ]
    },
    {
        id: 2,
        node_id: 2,
        step_id: 2,
        role_id: 1,
        status: 'peading',
        step_name: "内容审核",
        pid: 1,
        options: []
    },
    {
        id: 3,
        node_id: 3,
        step_id: 2,
        role_id: 3,
        status: 'peading',
        step_name: "内容审核",
        pid: 1,
        options: []
    },
    {
        id: 4,
        node_id: 4,
        step_id: 2,
        role_id: 4,
        status: 'peading',
        step_name: "内容审核",
        pid: 1,
        options: []
    },
    {
        id: 5,
        node_id: 5,
        step_id: 3,
        role_id: 4,
        status: 'peading',
        step_name: "申请审批",
        pid: [2, 3, 4],
        options: []
    },
    {
        id: 6,
        node_id: 6,
        step_id: 4,
        role_id: 1,
        status: 'peading',
        step_name: "推动签署合同",
        pid: 5,
        options: []
    },
    {
        id: 7,
        node_id: 7,
        step_id: 5,
        role_id: 2,
        status: 'peading',
        step_name: "归档管理",
        pid: 6,
        options: []
    },
    {
        id: 8,
        node_id: 8,
        step_id: 5,
        role_id: 3,
        status: 'peading',
        step_name: "归档管理",
        pid: 6,
        options: []
    },
] : [
    {
        id: 1,
        step_number: 1,
        step_name: "起草合同",
        user_name: "yyjlsj1",
        role_name: "托管BD负责人",
        update_time: "2023-12-23 23:23:23",
        status: "done",
        current: false,
        showNext: false,
        showCatch: false,
        showQuestion: false,
        note: "合同描述说明合同描述说明合同描述说明合同描述说明合同描述说明合同描述说明",
        options: [optionItem, optionItem]
    },
    {
        id: 2,
        step_number: 2,
        step_name: "起草合同",
        user_name: "yyjlsj1",
        role_name: "托管BD负责人",
        update_time: "2023-12-23 23:23:23",
        status: "done",
        current: false,
        showNext: false,
        showCatch: false,
        showQuestion: false,
        note: "合同描述说明合同描述说明合同描述说明合同描述说明合同描述说明合同描述说明",
        options: [optionItem, optionItem]
    },
    {
        id: 3,
        step_number: 3,
        step_name: "内容审核",
        user_name: "yyjlsj1",
        role_name: "",
        update_time: "2023-12-23 23:23:23",
        status: "done",
        current: false,
        showNext: false,
        showCatch: false,
        showQuestion: false,
        options: [optionItem, optionItem],
        children: [
            {
                id: 11,
                step_number: 11,
                step_name: "内容审核",
                user_name: "yyjlsj1",
                role_name: "托管总负责人",
                update_time: "2023-12-23 23:23:23",
                status: "done",
                current: false,
                showNext: false,
                showCatch: false,
                showQuestion: false,
                note: "内容审核描述说明内容审核描述说明内容审核描述说明内容审核描述说明内容审核描述说明内容审核描述说明内容审核描述说明内容审核描述说明内容审核描述说明",
            },
            {
                id: 21,
                step_number: 12,
                step_name: "内容审核",
                user_name: "yyjlsj1",
                role_name: "法务负责人",
                update_time: "2023-12-23 23:23:23",
                status: "done",
                current: false,
                showNext: true,
                showCatch: false,
                showQuestion: false,
            },
        ]
    },
    {
        id: 4,
        step_number: 4,
        step_name: "test_step",
        user_name: "yyjlsj1",
        role_name: "托管BD负责人（EN）",
        role_display_name: "托管BD负责人（中文）",
        update_time: "2023-12-23 23:23:23",
        status: "peading",
        current: true,
        showCopy: true,
        showNext: true,
        disabledNext: false,
        showCatch: false,
        showQuestion: false,
        options: [optionItem, optionItem],
        nextOptions: [
            {
                role_name: "运营负责人（en）",
                role_display_name: "运营负责人（中文）",
                dic: [
                    { label: "花花", value: 1 },
                    { label: "吧不然", value: 2 }
                ]
            }
        ],
        copyOptions: [
            {
                role_name: "运营负责人（en）",
                role_display_name: "运营负责人（中文）",
                dic: [
                    { label: "花花", value: 1 },
                    { label: "吧不然", value: 2 }
                ]
            }
        ],
    },
    {
        id: 5,
        step_number: 5,
        step_name: "申请审批/推动签署合同",
        role_name: "",
        update_time: "",
        status: "peading",
        current: false,
        showNext: false,
        showCatch: false,
        showQuestion: false,
        // options: [optionItem, optionItem],
    },
    {
        id: 6,
        step_number: 6,
        step_name: "处理问题工单",
        role_name: "",
        update_time: "",
        status: "peading",
        current: false,
        showNext: false,
        showCatch: false,
        showQuestion: false,
    },
]