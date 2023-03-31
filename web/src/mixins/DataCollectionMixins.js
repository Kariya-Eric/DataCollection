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
                total: 0,
                showTotal: (total, range) => range[0] + "-" + range[1] + "共" + total + "条",
            },
            // table加载状态
            loading: false,
            // table选中keys
            selectedRowKeys: [],
            // table选中rows
            selectedRows: [],
            // 筛选参数
            filters: {},
            // 排序参数
            sorter: {
                column: 'createTime',
                order: 'desc'
            }
        };
    },

    created() {
        this.loadData(1);
    },

    methods: {
        searchQuery() {
            this.loadData(1);
        },

        // 重置查询条件
        searchReset() {
            this.queryParam = {};
            this.loadData(1);
        },

        loadData(arg) {
            if (!this.url || !this.url.list) {
                this.$message.error('请设置url.list属性!');
                return;
            }
            //加载数据 若参数为1则加载第一页的内容
            if (arg === 1) {
                this.ipagination.current = 1;
            }
            this.loading = true;
            let params = this.getQueryParams(); //构造查询条件
            postAction(this.url.list, params)
                .then((res) => {
                    this.dataSource = res.rows;
                    this.ipagination.total = res.total;
                })
                .catch((e) => console.log('此处报错', e))
                .finally(() => {
                    //清空选择框
                    this.selectedRowKeys = []
                    //console.log(this.selectedRowKeys, this.rowSelectionBox)
                    this.loading = false;
                });
        },

        // 封装查询参数
        getQueryParams() {
            let pageBean = {
                page: this.ipagination.current,
                pageSize: this.ipagination.pageSize,
                showTotal: true,
            };
            return { params: Object.assign(this.queryParam), pageBean };
        },

        onSelectChange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys
            this.selectedRows = selectedRows
        },

        onSelectClear() {
            this.selectedRowKeys = []
            this.selectedRows = []
        }
    },
};
