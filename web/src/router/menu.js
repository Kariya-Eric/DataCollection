export const menus = [
    {
        "id": "1", //主键
        "parentId": "0", //父级ID
        "name": "首页", //菜单名称
        "menuUrl": "/dashboard/workplace", //url
        "templateUrl": "/dashboard/workplace", //模板Url
        "menuIcon": "home", //图标地址
        "enableMenu": 0, //在菜单中显示
        "sn": "1", //排序
    },
    {
        "id": "2",
        "parentId": "0",
        "name": "系统管理",
        "menuUrl": "/sys",
        "templateUrl": "/sys",
        "menuIcon": "sys",
        "enableMenu": 0,
        "sn": "2",
        children: [{
            "id": "3",
            "parentId": "2",
            "name": "用户管理",
            "menuUrl": "/sys/user",
            "templateUrl": "/sys/user",
            "menuIcon": "user",
            "enableMenu": 0,
            "sn": "1",
        }]
    },
]