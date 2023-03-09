// 用于简化展示表格的mixins

export const DataCollectionMixin = {
    data() {
        return {
            // 查询条件
            queryParam: {},
            // 数据源
            dataSource: [],
            //分页参数
            ipagination: {
                current: 1,
                pageSize: 10,
                pageSizeOptions: [10, 20, 30],
                showJumper: true,
                showPageSize: true,
                total: 0
            },
            // table加载状态
            loading: false,
        }
    },
}