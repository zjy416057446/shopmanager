<template>
  <el-container class="container">
    <el-header>
      <!--
        el-row 一行
        el-col 一列
        份数  24
      -->
      <el-row>
        <el-col :span="4">
          <img src="@/assets/logo.png" alt="图片加载失败">
        </el-col>
        <el-col :span="19" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <div class="grid-content bg-purple">
            <a href="#" class="loginout" @click.prevent="handleLoginout()">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <!-- 导航 -->
        <el-menu default-active="1" class="el-menu-vertical-demo" :unique-opened="true" :router="true">
          <el-submenu :index="item1.order+''" v-for="(item1) in menus" :key="item1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>
            <!--
              1. <router-link ></router-link> 改标识
              2. 提供容器
              3. 提供组件 users.vue
              4. newVueRouter()
              5. 配置
              6. 挂载
            -->
            <el-menu-item :index="item2.path+''" v-for="(item2) in item1.children" :key="item2.id">
              <i class="el-icon-menu"></i>
              {{item2.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        menus: []
      }
    },
    beforeMount() {
      if (!localStorage.getItem('token')) {
        this.$router.push({
          name: "login"
        })
      }
    },
    created() {
      this.getMenus()
    },
    methods: {
      async getMenus() {
        // 角色为超管->超管的token->请求菜单
        // admin登录->主管->所有权限->主管的token->
        const res = await this.$http.get(`menus`);
        const {
          meta: {
            msg,
            status
          },
          data
        } = res.data;
        console.log(res);
        if (status === 200) {
          this.menus = data;
          console.log(this.menus);
        }
      },
      handleLoginout() {
        localStorage.clear();
        this.$router.push({
          name: "login"
        });
        this.$message.warning("退出成功")
      }
    },
  }

</script>

<style>
  .container {
    height: 100%;

    background: #fff;
  }

  .middle {
    text-align: center;
    line-height: 60px;
  }


  .main {
    background: gray;
  }

  .loginout {
    line-height: 60px;
    text-decoration: none;
  }

</style>
