<template>
  <div class="home">
    <el-container height="100%" width="200px">
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isCollapse"
      >
        <el-menu-item index="1-1" @click="collapse()">
            <i class="el-icon-s-unfold"></i>
        </el-menu-item>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-s-custom"></i>
            <span>企业管理 </span>
          </template>
    <router-link :to="{path:'/home/factory'}" >
          <el-menu-item index="1-1">企业查询</el-menu-item>
    </router-link>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-s-order"></i>
            <span>新闻管理</span>
          </template>
          <router-link :to="{path:'/home/news'}">
          <el-menu-item index="1-1">新闻查询</el-menu-item>
          </router-link>
          <router-link :to="{path:'/home/addnews'}">
          <el-menu-item index="1-1">发布新闻</el-menu-item>
          </router-link>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-shopping-bag-1"></i>
            <span>食品管理</span>
          </template>
             <router-link :to="{path:'/home/searchFood'}">
          <el-menu-item index="1-1">食品追溯</el-menu-item>
         </router-link>
          <router-link :to="{path:'/home/sendFood'}">
          <el-menu-item index="1-1">食品认证</el-menu-item>
         </router-link>
          <router-link :to="{path:'/home/logisticsmanage'}">
          <el-menu-item index="1-1">物流管理</el-menu-item>
         </router-link>
         <!-- <router-link :to="{path:'/home/sign'}">
          <el-menu-item index="1-1">食品签收</el-menu-item>
         </router-link> -->
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-notebook-2"></i>
            <span>投诉管理</span>
          </template>
          <router-link :to="{path:'/home/complaint'}">
            <el-menu-item index="1-1">投诉查询</el-menu-item>
          </router-link>
        </el-submenu>
      </el-menu>

      <el-container>
        <el-header height="80px">
          <router-link :to="{path:'/home/factory'}">
            <i class="el-icon-s-home"></i>
            首页
          </router-link>
          <!-- <el-dropdown style="margin-top:8px;float:right">
          <span class="el-dropdown-link" style="font-size:12px">
          用户状态<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
          <el-dropdown-item><router-link style="font-size:12px" v-bind:to="{name:'adminlogin'}"><a class="el-dropdown-item-a" href="javascript:void(0)">切换用户</a></router-link></el-dropdown-item>
          <el-dropdown-item><a style="font-size:12px" class="el-dropdown-item-a" href="javascript:void(0)" @click="removeuserid()">退出登录</a></el-dropdown-item>
          </el-dropdown-menu>
          </el-dropdown> -->
          <!-- <img src="../assets/彭于晏.jpg" style="width:55px;height:55px;float:right;margin-top:10px;"> -->
          <!-- <el-image
              :src="web_static_serve"
              class="image"
              style="width:60px;height:60px;float:right;margin-top:10px;"
              lazy
            ></el-image> -->
          <p style="float:right;margin-top:10px;"> 欢迎你，Admin</p>
        </el-header>
        <el-main style="height:670px">
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      isCollapse: false,
      isc: true,
      web_static_serve:"../assets/彭于晏.jpg"
    };
  },
  methods: {
    //折叠导航栏
    collapse() {
      this.isCollapse = !this.isCollapse;
    },
       /*退出登录方法 */
         removeuserid(){
            // if (!this.uid) return;    //如果userid有值则if结果为反，执行window.sessionStorage.removeItem(userId);
            // window.sessionStorage.removeItem("loginUserId");
            this.$router.push({
                    name:'adminlogin',
                  })
        }
  }
};
</script>
<style>
.el-header {
  background: #fff;
  color: #333;
  text-align: center;
  line-height: 60px;
  height: 100px;
}


.el-main {
  background-color: #f5f5f5;
  color: #333;
}
body > .el-container {
  margin-bottom: 40px;
}
.el-col {
  height: 740px;
  width: 200px;
}
.el-header a {
  float: left;
  text-decoration: none;
  color: dimgray;
  line-height: 80px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>

