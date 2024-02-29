<template>
  <div class="repository-view">
    <a-card class="left-menu">
      <a-form-item label="年份">
        <a-select v-model="searchYear" style="width: 100%" placeholder="请选择年份" @change="changeYear">
          <a-select-option v-for="(item, index) in yearList" :key="index" :value="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-spin :spinning="spinning">
        <ul class="first-title">
          <li v-for="item in menuData" :key="item.id">
            <div :class="{ active: item.id === selectedKey }" :title="item.name" @click="clickMenu(item)"><dc-icon type="icon-dc_type" />{{ item.name }}</div>
            <ul class="second-title">
              <li v-for="(subMenu, index) in item.children" :key="subMenu.formCategories">
                <div :class="{ active: subMenu.formCategories === selectedKey }" :title="subMenu.name" @click="clickMenu(subMenu)">{{ index + 1 }}.{{ subMenu.name }}</div>
              </li>
            </ul>
          </li>
        </ul>
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
        <router-view v-if="keepAlive" />
      </keep-alive>
      <router-view v-if="!keepAlive" />
    </page-header-wrapper>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import api from '@/api/repository'
const listPath = '/repository/list'
export default {
  name: 'RepositoryView',
  data() {
    return {
      spinning: false,
      yearList: [],
      searchType: '教学基本状态数据',
      searchYear: '',
      selectedKey: '',
      menuData: []
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
    },
    ...mapState({
      year: state => state.repository.repositorySelYear,
      menu: state => state.repository.repositorySelMenu
    })
  },
  created() {
    this.getYears()
  },
  methods: {
    // 获取年份列表
    getYears() {
      api.getYearList().then(res => {
        this.yearList = res.value
        if (this.year) {
          this.searchYear = this.year
        } else {
          this.searchYear = res.value[0]
          this.$store.commit('SET_REPOSITORYSELYEAR', res.value[0])
        }
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
              // 在详情页切换菜单回到列表页
              if (!isInit && this.$route.path !== listPath) {
                this.$router.replace({
                  path: listPath
                })
              }
              if (this.menu && isInit) {
                this.selectedKey = this.menu.formCategories || this.menu.id
              } else {
                const defaultMenu = res.value[0]
                defaultMenu.type = this.searchType
                this.selectedKey = defaultMenu.id
                this.$store.commit('SET_REPOSITORYSELMENU', defaultMenu)
              }
            }
            this.menuData = res.value
          } else {
            this.menuData = []
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.spinning = false
        })
    },
    changeYear(key) {
      this.$store.commit('SET_REPOSITORYSELYEAR', key)
      this.getMenu()
    },
    clickMenu(obj) {
      this.selectedKey = obj.formCategories || obj.id
      obj.type = this.searchType
      this.$store.commit('SET_REPOSITORYSELMENU', obj)
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
      .first-title {
        padding: 0;
        li {
          font-size: 14px;
          line-height: 46px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
          .anticon {
            font-size: 14px !important;
            margin-right: 10px;
            color: #2f68bd;
          }
          > div {
            padding: 0 20px;
          }
        }
        > li > div {
          transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          &:hover,
          &.active {
            color: #2f68bd;
          }
          &.active {
            background: #e6efff;
          }
        }
      }
      .second-title {
        padding: 0;
        li > div {
          padding-left: 40px;
          position: relative;
          &::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 6px;
            height: 0;
            background: #2f68bd;
          }
          &:hover,
          &.active {
            background: linear-gradient(270deg, #7facee 0%, #245eb3 100%);
            color: #fff;
          }
          &.active::after {
            height: 100%;
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
    width: calc(100% - 192px);
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
