<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu class="el-menu-vertical-demo" background-color="#373d41" text-color="#fff"
                 unique-opened :collapse='isCollapse' :collapse-transition='false' router
                 :default-active="defaultActive">
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
                          @click="saveNavState('/' +subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      menuList: [],
      isCollapse: false,
      defaultActive: '',
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      }
    }
  },
  created () {
    // 获取菜单数据
    this.getMenuList()
    this.defaultActive = window.sessionStorage.getItem('defaultActive')
  },
  methods: {
    logout () {
      window.sessionStorage.setItem('token', '');
      this.$router.push('/login');
    },
    async getMenuList () {
      const { data: result } = await this.$http.get('menus');
      if (result.meta.status == 200) {
        this.menuList = result.data;
      } else {
        this.$message.error('获取数据失败!');
      }
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse;
    },
    saveNavState (path) {
      window.sessionStorage.setItem('defaultActive', path);
      this.defaultActive = path;
    }
  }
}
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

    > div {
      display: flex;
      align-items: center;

      span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #373d41;

    .el-menu {
      border-right: none;
    }

    .toggle-button {
      background-color: #4a5064;
      font-size: 10px;
      line-height: 24px;
      color: #fff;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
  }
}
</style>
