<template>
  <div class="repository-view">
    <a-card class="left-menu">
      <a-form-item label="年份">
        <a-select v-model="searchYear" style="width: 100%" placeholder="请选择年份" @change="changeYear">
          <a-select-option v-for="(item, index) in yearList" :key="index" :value="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-spin :spinning="spinning">
        <a-menu :selectedKeys="selectedKeys" :open-keys.sync="openKeys" mode="inline" :inlineIndent="20" @click="clickMenu">
          <a-sub-menu v-for="item in menuData" :key="item.key">
            <span slot="title"><dc-icon type="icon-dc_type" />{{ item.value }}</span>
            <a-menu-item v-for="(subMenu, index) in item.children" :key="subMenu.id">{{ index + 1 }}.{{ subMenu.name }}</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-spin>
    </a-card>
    <page-header-wrapper
      class="right-content"
      :title="false"
      :breadcrumb="{
        props: {
          routes: customRoutes,
          itemRender: defaultItemRender
        }
      }"
    >
      <keep-alive>
        <router-view v-if="keepAlive" :repid="selectedKeys[0]" :year="searchYear" :type="searchType" />
      </keep-alive>
      <router-view v-if="!keepAlive" />
    </page-header-wrapper>
  </div>
</template>

<script>
import api from '@/api/repository'
const listPath = '/repository/list'
export default {
  name: 'RepositoryView',
  data() {
    return {
      spinning: false,
      yearList: [],
      searchYear: '',
      searchType: '',
      selectedKeys: [],
      openKeys: ['0'],
      menuData: [
        {
          key: '0',
          value: '教学基本状态数据',
          children: []
        }
      ]
    }
  },
  computed: {
    customRoutes() {
      let breadList = []
      breadList.push({ path: '/home', title: '首页' })
      this.$route.matched.forEach(item => {
        if (item.path) {
          let rt = { path: item.path, title: item.meta.title }
          breadList.push(rt)
        }
      })
      return breadList
    },
    keepAlive() {
      return this.$route.path === listPath
    }
  },
  created() {
    this.searchType = this.menuData[0].value
    this.getYears()
  },
  methods: {
    // 获取年份列表
    getYears() {
      api.getYearList().then(res => {
        this.yearList = res.value
        const queryYear = this.$route.query.year
        this.searchYear = queryYear || res.value[0]
        this.getMenu(true)
      })
    },
    defaultItemRender(_ref) {
      let route = _ref.route
      let routes = _ref.routes
      let h = _ref.h
      return (
        (routes.indexOf(route) === routes.length - 1 && h('span', [route.title])) ||
        h(
          'router-link',
          {
            attrs: {
              to: {
                path: route.path || '/'
              }
            }
          },
          [route.title]
        )
      )
    },
    getMenu(isInit) {
      this.spinning = true
      api
        .getListByYearAndType({
          year: this.searchYear,
          type: this.searchType
        })
        .then(res => {
          if (res.state) {
            if (res.value.length > 0) {
              const queryKey = this.$route.query.repid
              if (isInit && queryKey) {
                const [actMenu] = res.value.filter(item => item.id === queryKey)
                if (actMenu) {
                  this.selectedKeys = [queryKey]
                }
              } else {
                this.selectedKeys = [res.value[0].id]
              }
              if (!isInit && this.$route.path !== listPath) {
                this.$router.push({
                  path: listPath
                })
              }
            }
            this.menuData[0].children = res.value
          } else {
            this.menuData[0].children = []
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.spinning = false
        })
    },
    changeYear(e) {
      this.searchYear = e
      this.getMenu()
    },
    clickMenu(e) {
      const activeKey = e.key
      this.selectedKeys = [activeKey]
      this.$router.push({
        path: listPath
      })
    }
  }
}
</script>
<style scoped lang="less">
.ant-pro-page-header-wrap-page-header-warp {
  background: none;
}
.ant-breadcrumb-link {
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: bold;
}
.repository-view {
  display: flex;
  justify-content: space-between;

  /deep/.ant-form-item-label {
    padding-right: 10px !important;
    width: auto;
    white-space: nowrap;
    line-height: 40px;
    > label::after {
      display: none;
    }
  }
  .left-menu {
    width: 240px;
    margin-left: -24px;
    margin-top: -24px;
    margin-right: 24px;
    border: 0;
    border-radius: 0;
    /deep/.ant-card-body {
      padding: 0;
      .ant-form-item {
        padding: 6px 20px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 0;
        &::before,
        &::after {
          display: none;
        }
        .ant-form-item-control-wrapper {
          flex: auto;
        }
      }
      .ant-menu-inline {
        border: 0;
      }
      .ant-menu-submenu {
        width: 100%;
        .ant-menu-submenu-title {
          margin: 0;
          padding-right: 20px;
          text-align: left;
          line-height: 46px;
          height: 46px;
          font-size: 14px;
          .anticon {
            font-size: 14px !important;
          }
        }
        .ant-menu-submenu-arrow {
          &::before,
          &::after {
            background: #000;
          }
        }
        &.ant-menu-submenu-open {
          background: #e6efff;
          color: #2f68bd;
        }
        > .ant-menu {
          background: #fff !important;
          color: #4a4c51;
          .ant-menu-item {
            font-size: 14px;
            line-height: 46px;
            height: 46px !important;
            padding-left: 44px !important;
            margin: 0;
            text-align: left;
            &.ant-menu-item-active,
            &.ant-menu-item-selected {
              background: linear-gradient(270deg, #7facee 0%, #245eb3 100%);
              position: relative;
              color: #fff !important;
            }
            &.ant-menu-item-selected {
              &::after {
                position: absolute;
                top: 0;
                right: 0;
                width: 6px;
                height: 46px;
                background: #2f68bd;
              }
            }
          }
        }
      }
    }
  }
  .ant-menu,
  .ant-menu-sub,
  .ant-menu-inline {
    color: #4a4c51;
    background: none !important;
  }
  .right-content {
    flex: auto;
    /deep/.ant-pro-page-header-wrap-children-content {
      margin: 0 20px;
      .ant-card-bordered {
        border: 0;
      }
      .ant-table {
        &:not(.ant-table-bordered) {
          .ant-table-thead > tr > th {
            border: 0;
          }
          .ant-table-tbody > tr > td {
            border-bottom: 1px solid #e5e5e5;
          }
        }
        // .ant-table-thead > tr > th,
        // .ant-table-tbody > tr > td {
        //   padding: 15px 20px;
        // }
      }
    }
  }
}
</style>
