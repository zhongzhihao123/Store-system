<template>  
        <el-container class="home-container">

            <!-- 头部区域 -->
            <el-header >
                <div>
                    <img src="../assets/heima.png" alt="">
                    <span>电商管理系统</span>
                </div>
                <el-button type="info" @click='logout'>退出</el-button>
            </el-header>

            <el-container>
                <!-- 侧边栏区域 -->
                <el-aside width=" isCollapse ? 64px : 200px " >
                    <!-- 折叠 -->
                    <div class="toggle-button" @click="toggleCollaose">|||</div>
                    <!-- 菜单栏   unique-opened表示是否保持一个子菜单的展开-->
                    <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" :unique-opened='true' :collapse="isCollapse"  :collapse-transition='false'
                    :router="true"  :default-active='activePath'>
                        <!-- 第一菜单 -->
                        <!-- 获取菜单进行循环，循环一般用key绑定唯一值，一般用id  :index是动态  后面是用字符串，所以用级联方式，让item.id变成字符串 -->
                        <el-submenu :index="item.id+''"  v-for="item in menulist" :key="item.id">
                            <template slot="title" class="template">
                                <i :class="iconObj[item.id]"></i>
                                <span>{{item.authName}}</span>
                            </template>
                            <!-- 第二菜单   @click="saveNavState()保存路径到sessionstage-->
                            <el-menu-item-group >
                                    <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)" >
                                        <i class="el-icon-menu"></i>
                                        <span>{{subItem.authName}}</span>
                                    </el-menu-item>
                            </el-menu-item-group>
                         </el-submenu>
      
                    </el-menu>
                </el-aside>
                <!-- 主体部分 -->
                <el-main class="el-main">
                    <!-- 路由占位符 -->
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container> 
</template>

<script>
export default {
    data() {
        return {
            //左侧菜单数据
            menulist:[],
            // 菜单图标
            iconObj:{
                '125':'el-icon-user',
                '103':'el-icon-s-goods',
                '101':'el-icon-help',
                '102':'el-icon-picture-outline-round',
                '145':'el-icon-bell'
            },
            // 是否折叠
            isCollapse:false,
            //被激活的链接地址 
            activePath:''
        }
    },
    // 生命周期函数，先渲染
    created() {
        this.getMenuList(),
        // 链接地址被创建就会获取这个保存的键
        this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods:{
        //退出功能，实际就是删除sesstionStorge的信息
        logout() {
            window.sessionStorage.clear();
            this.$router.push('/login')
        },
        //获取所有的菜单  
        async getMenuList() {
            const {data:res} = await this.$http.get('menus')
            if(res.meta.status !=200) return this.$message.error(res.meta.msg);
            this.menulist = res.data
            // console.log(res)
        },
        // 折叠
        toggleCollaose() {
            this.isCollapse = !this.isCollapse
        },
        // 保持链接的激活状态
        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath',activePath),
            this.activePath = activePath

        }
    }
}
</script>

<style lang="less" scoped>
.home-container {
    height: 100%;
}
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left:0 ;
    align-items: center;
    color: #ffffff;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      span {
          padding-left: 15px;
      }  
    }
}
.el-aside {
    background-color:#333744;
    .el-menu {
        border-right:none ;
    }
}
.el-main {
    background-color: #eaedf1;
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
.template {
    i {
        margin-left: 10px;
    }
}
</style>