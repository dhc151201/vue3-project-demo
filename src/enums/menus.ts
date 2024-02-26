export default [
    {
        label: "商品管理",
        children: [
            {
                label: "商品列表",
                key: '/manager-goods'
            },
            {
                label: "商品分类",
                key: '/manager-goods-type'
            },
        ]
    },
    {
        label: "订单中心",
        key: '/manager-order'
    },
    {
        label: "充值中心",
        key: '/manager-recharge'
    },
    {
        label: "推广中心",
        key: '/manager-spread',
    },
    {
        label: "提现中心",
        key: '/manager-widthdraw',
        children: [
            {
                label: "提现管理",
                key: '/manager-widthdraw/list'
            },
            {
                label: "提现资料管理",
                key: '/manager-widthdraw/information'
            }
        ]
    },
    {
        label: "系统设置",
        key: '/manager-system',
        children: [
            {
                label: "系统配置",
                key: '/manager-system-config'
            },
            {
                label: "角色管理",
                key: '/manager-role'
            },
            {
                label: "账号管理",
                key: '/manager-user',
            },
            {
                label: "修改密码",
                key: '/manager-password'
            },
        ]
    }
  ]