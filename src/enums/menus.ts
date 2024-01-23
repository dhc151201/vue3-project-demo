export default [
    {
        label: "商品中心",
        key: '/manager-goods'
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
        key: '/manager-widthdraw'
    },
    {
        label: "系统设置",
        key: '/manager-system',
        children: [
            {
                label: "系统配置",
                key: '/manager-system/config'
            },
            {
                label: "角色管理",
                key: '/manager-system/roles'
            },
            {
                label: "账号管理",
                key: '/manager-system/users',
            },
            {
                label: "修改密码",
                key: '/manager-system/pwd'
            },
        ]
    }
  ]