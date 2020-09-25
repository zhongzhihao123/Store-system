# 电商管理系统

## login.vue组件

### 数据库问题

```


[mysqld]
# 设置3306端口
port=3306
# 设置mysql的安装目录
basedir=D:\mysql-8.0.15-winx64
# 设置mysql数据库的数据的存放目录
datadir=D:\mysql-8.0.15-winx64\data
# 允许最大连接数
max_connections=200
# 允许连接失败的次数。这是为了防止有人从该主机试图攻击数据库系统
max_connect_errors=10
# 服务端使用的字符集默认为UTF8
character-set-server=utf8
# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
# 默认使用“mysql_native_password”插件认证
default_authentication_plugin=mysql_native_password

[mysql]
# 设置mysql客户端默认字符集
default-character-set=utf8
[client]
# 设置mysql客户端连接服务端时默认使用的端口
port=3306
default-character-set=utf8

第一步：去官网下载安装（重点）第二步：先解压，然后在mysql下创建一个my.ini文件，
更改my.ini文件里面的两行安装目录，
第二行加上\data，my.ini文件不能多或少一个符号，
在path（环境变量里面）加上mysql路径（/bin）。（重点）第三步：进入命令指示符（cmd），
输入mysqld --initialize-insecure --user=mysql，
再输入mysqld -install，
出现Service successfully installed.表示配置完成
启动数据库net start mysql，
输入mysql -u root -p，不用输入密码直接回车   //root表示数据库的用户
出现mysql>表示配置完成
输入alter user user() identified by "密码";
输入net stop mysql关闭数据库

输入mysqld --initialize-insecure --user=mysql之后显示找不到vcruntime140.dll
可以去看看这个网址的解决办法，我已经解决了，记得点赞哦

https://blog.csdn.net/qq_42365534/article/details/102847013


找到api文件然后找出default.json,可以查数据库的信息
"db_config" : {
		"protocol" : "mysql",
		"host" : "127.0.0.1",
		"database" : "mydb",     数据库名称 该文档制定数据库的名称必须是mydb
		"user" : "root",		用户名   存储在root
		"password" : "123456",  	密码  密码为123456
		"port" : 3306
	}
```





### 表单数据重置

引用表单  然后找到这个引用

```
<el-form ref="loginFormRef" label-width="0px" class="login_form" :model="loginform" :rules="loginFormRules">
<el-button type="primary" @click="resetLoginForm">重置</el-button>
methods:{
        resetLoginForm () {
        // console.log(this)
        this.$refs.loginFormRef.resetFields()
         }
```

### 表单进行检验

```
validate	
对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise	
Function(callback: Function(boolean, object))
```

```
login() {
             this.$refs.loginFormRef.validate((valid)=>{
                 console.log(valid)
             })
```

### 数据登录请求

```
//获取axios 
import axios from 'axios'
Vue.config.productionTip = false
//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//把axios请求赋予到vue的原型的http上，可以全局使用
Vue.prototype.$http = axios


login() {
             this.$refs.loginFormRef.validate(async valid=>{
                 if(!valid) return;
                 //data:res表示请求过来的data
                 const {data:res} = await this.$http.post('login',this.loginform)
                 if(res.meta.status !== 200) return console.log('登录失败');
                 console.log('登陆成功')
             })
```

### 登陆弹出提出

```
import {Message} from 'element-ui'
// 把消息提示引入到全局使用
Vue.prototype.$message = Message
if(res.meta.status !== 200) return this.$message.error('错误');
                  this.$message.success('成功')
```

### 登陆成功后的行为

```
//1.将登陆成功之后的token，保存到客户端的sessionStorage中，因为
                  //1.1项目中除了登陆之外的其他api接口，必须在登陆之后才能访问，所以保存token可以给服务端知道是否已经登陆
                  //token只应在当前网站打开期间生效，所以将token把保存在sessionStorage(不是持久化)中’
                //   console.log(res)
                    window.sessionStorage.setItem('token',res.data.token)

                  //2.通过编程式导航跳转到后台主页，路由地址是/home
                  this.$router.push("/home")
                  
            
```

编程式导航可以让你登陆后的行为是怎样的

window.sessionStorage.setItem('token',res.data.token)  第一个参数是保存到sessionStorage的键名是什么



### 挂载路由导航守卫

```
// 挂载路由导航守卫，防止还没登录就跳转到其他页面
router.beforeEach((to,from,next) => {
  //to将要访问的路径
  //from 代表从哪个路径跳转而来
  //next是一个函数，表示放行
  // next()放行  next('/login')强制跳转
  if(to.path === '/login') return next();
  //如果要访问其他页，先获取token
  const tokenStr =window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})
```



### 退出功能

```
//退出功能，实际就是删除sesstionStorge的信息
        logout() {
            window.sessionStorage.clear();
            this.$router.push('/login')
        }
```

### 推送到远程



1. 合并分支,  git merge 要合并的分支 
2. 创建的新分支是在本地才有，如果要远程也要需要  git push -u orgin 创建分支名称
3. 创建新分支并且切换新分支 git checkout -b 新分支名称

## 主页布局

### header布局

```
 <el-header >
                <div>
                    <img src="../assets/heima.png" alt="">
                    <span>电商管理系统</span>
                </div>
                <el-button type="info" @click='logout'>退出</el-button>
            </el-header>
            
            s
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
```

### 侧边栏布局

```
<!-- 侧边栏区域 -->
                <el-aside width="200px" >
                    <!-- 菜单栏 -->
                    <el-menu background-color="#545c64" text-color="#fff">
                        <!-- 第一菜单 -->
                        <el-submenu index="1">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>导航一</span>
                            </template>
                            <!-- 第二菜单 -->
                            <el-menu-item-group>
                                    <el-menu-item index="1-1">
                                        <i class="el-icon-location"></i>
                                        <span>导航一</span>
                                    </el-menu-item>
                            </el-menu-item-group>
                         </el-submenu>
      
                    </el-menu>
                </el-aside>
```



### 请求拦截(预处理)

```
// 请求拦截，进行请求预处理，可以让有权限的api先进行判断是否带有token
axios.interceptors.request.use(config => {
  // console.log(config)
  // 有权限的api要吧token放在请求头里
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
```

### 获取所有的菜单

```
  <!-- 菜单栏 -->
                    <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF">
                        <!-- 第一菜单 -->
                        <!-- 获取菜单进行循环，循环一般用key绑定唯一值，一般用id  :index是动态  后面是用字符串，所以用级联方式，让item.id变成字符串 -->
                        <el-submenu :index="item.id+''"  v-for="item in menulist" :key="item.id">
                            <template slot="title">
                                <i :class="iconObj[item.id]"></i>
                                <span>{{item.authName}}</span>
                            </template>
                            <!-- 第二菜单 -->
                            <el-menu-item-group >
                                    <el-menu-item :index="subItem.id+''" v-for="subItem in item.children" :key="subItem.id">
                                        <i class="el-icon-menu"></i>
                                        <span>{{subItem.authName}}</span>
                                    </el-menu-item>
                            </el-menu-item-group>
                         </el-submenu>
      
                    </el-menu>
 
 
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
            }
        },
        // 生命周期函数，先渲染
created() {
        this.getMenuList()
    },
 async getMenuList() {
            const {data:res} = await this.$http.get('menus')
            if(res.meta.status !=200) return this.$message.error(res.meta.msg);
            // this.menulist = res.data
            console.log(res)
        }  
        
```

### 左侧菜单改为路由链接

| router | 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 | boolean | —    | false |
| ------ | ------------------------------------------------------------ | ------- | ---- | ----- |
|        |                                                              |         |      |       |

```
 :router="true"
:index="'/'+subItem.path"
```

由于开启 :router="true" 所以会变为链接  

### 用户列表开发

```
import Users from '../components/user/Users.vue'
{path:'/users',component:Users}
这个路径已经规定死了，在:index="'/'+subItem.path"
```

### 点击左侧的菜单出现高亮

| default-active | 当前激活菜单的 index | string | —    | —    |
| -------------- | -------------------- | ------ | ---- | ---- |
|                |                      |        |      |      |

```
让这个default-active绑定一个地址会高亮 ，所以要点击这个菜单要保存它的地址下来  @click="saveNavState('/'+subItem.path)" 
saveNavState(activePath) {
            window.sessionStorage.setItem('activePath',activePath)

        }
所以一开始让这个地址为空 activePath:'' ，然后在点击时已经保存点击的地址了，然后执行生命周期函数，在创建之前先获取
// 链接地址被创建就会获取这个保存的键
        this.activePath = window.sessionStorage.getItem('activePath')
        要让每次点击的菜单不同时，出现的高亮不同，要让activePath更换，则
        this.activePath = activePath
```

### 绘制用户列表的基本结构

```
 <!-- 面包屑 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card class="box-card">
            <div class="text item">
                <!-- 输入框 -->
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-input placeholder="请输入内容"  class="input-with-select">
                            <el-button slot="append" icon="el-icon-search"></el-button>
                         </el-input> 
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary">添加用户</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        

```

Row 组件 提供 `gutter` 属性来指定每一栏之间的间隔，默认间隔为 0。:span表示一行有24他占几份，达到自适应

### 获取用户列表数据

```
 data() {
        return {
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:2
            },
            userlist:[],
            total:0
        }
    },
    created() {
        this.getUserList()
    },
    methods:{
        async getUserList() {
            const {data:res} =await this.$http.get('users',{
                params:this.queryInfo
            })
            console.log(res)
            if(res.meta.status !==200) {
                return this.$message.error('获取用户列表失败')
            }
            this.userlist =res.data.users
            this.total = res.data.total
        }
    }

```

### 状态列的显示效果

```
              <template slot-scope = "scope" > 
                            {{scope.row}}
                        </template>
用这个slot-scope='scope'表示获取这个状态  {{scope.row}}表示获取这一行的状态信息

```

### 实现数据分页

```
<el-pagination
                    @size-change="handleSizeChange"  //// 监听每页显示条数的参数
                    @current-change="handleCurrentChange"//// 监听页码值的改变的事件
                    :current-page="queryInfo.pagenum"//当前页码
                    :page-sizes="[1, 2, 5, 10]"//数组元素为展示的选择每页显示个数的选项，[100, 200, 300, 400]表示四个选项，每页显示 100 个，200 个，300 个或者 400 个。
                    :page-size="queryInfo.pagesize"//每页显示条数
                    layout="total, sizes, prev, pager, next, jumper"//需要出现 的模板
                    :total="total">
                </el-pagination>
                
 // 监听每页显示条数的参数
        handleSizeChange(newPageSize) {
            console.log(newPageSize)
            this.queryInfo.pagesize = newPageSize
            // 重新渲染
             this.getUserList()
        },
        // 监听页码值的改变的事件
        handleCurrentChange(newPage) {
            console.log(newPage)
            this.queryInfo.pagenum = newPage
            // 重新渲染
             this.getUserList()
        }                

```

### 实现用户状态的改变

| 事件名称 | 说明                            | 回调参数   |
| :------- | :------------------------------ | :--------- |
| change   | switch 状态发生变化时的回调函数 | 新状态的值 |

```
 @change="userStateChanged(scope.row)"
  async userStateChanged(userInfo) {
            console.log(userInfo)
            const {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
            if(res.meta.status !==200) {
                userInfo.mg_state = !userInfo.mg_state
                return this.$message.error('更改失败')
            }
            this.$message.success('更改用户状态成功')
        }

```

### 实现搜索功能

```
 v-model="queryInfo.query" clearable @clear="getUserList()"
  @click="getUserList()"

```

### 自定义验证规则

```
let  checkEmail = (rule,value,callback)=>{
                //验证邮箱的正则表达式
                const regEmail =/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-0-9_-])+/

                if(regEmail.test(value)) {
                    //合法邮箱
                    return callback()
                }
                callback(new Error('验证错误'))
            }
            //自定义手机的规则
            
            let  checkMobile = (rule,value,callback)=>{
                //验证手机的正则表达式
                const regMobile =/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]18[0-9]|14[57])[0-9]{8}$/

                if(regMobile.test(value)) {
                    //合法邮箱
                    return callback()
                }
                callback(new Error('验证错误'))
            }
  { validator:checkEmail, trigger: 'blur' }
                       {validator:checkMobile, trigger: 'blur' }


```

### 添加用户操作

```
  //添加用户操作
        addUser() {
            //表单欲验证
            this.$refs.addFormRef.validate( async vaild => {
                if(!vaild) return
                    //发起添加用户网络请求   
                const {data:res} = await this.$http.post('users',this.addForm)
               if(res.meta.status !==201){
                   this.$message.error('添加用户失败')
               }
               this.$message.success('添加用户成功')
                this.addDialogVisible = false
                this.getUserList()
            })
        }s

```

### 删除用户操作

```
 //删除用户操作
         async removeUserById(id) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
             type: 'warning',
             center: true
        }).then(async () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          const {data:res} = await this.$http.delete('users/'+id)
            if(res.meta.status !==200) {
                return $message.error('删除失败')
            }
            this.$message.success('删除用户成功')
            this.getUserList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
                });
            });
        }

```

## 权限列表

```javascript
  <el-card>
            <el-table :data="rightsList" style="width: 100%"  stripe border>
                <!-- type='index'索引列 -->
                <el-table-column type="index" ></el-table-column>
                <el-table-column prop="authName" label="权限名称"></el-table-column>
                <el-table-column prop="path" label="路径"></el-table-column>
                <el-table-column prop="level" label="等级">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.level == '0'">等级一</el-tag>
                            <el-tag type="success" v-else-if="scope.row.level =='1'">等级二</el-tag>
                            <el-tag type="info" v-else>等级三</el-tag>
                        </template>
                </el-table-column>   
            </el-table>
        </el-card>

```

### 角色用户列表

```
<el-card>
            <el-button type="primary" class="addRoles" >添加角色</el-button>
            <el-table :data="rolesList" style="width: 100%"  stripe border>
                <!-- 展开列 -->
                <el-table-column type="expand" ></el-table-column>
                <!-- type='index'索引列 -->
                <el-table-column type="index" ></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column  label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)">删除</el-button>
                            <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable='false'>
                                <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
                            </el-tooltip>   
                        </template>    
                </el-table-column>   
            </el-table>
        </el-card>

```

### 展开列的渲染

```
 <!-- 展开列   index 是判断一级权限中第几个值  然后动态class来判断是否顶部要给边框 -->
                <el-table-column type="expand" >
                    <template slot-scope="scope">
                        <el-row v-for="(item1,index) in scope.row.children" :key="item1.id" :class="['bgbottom',index === 0 ? 'bgtop' : '']">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag>{{item1.authName}}</el-tag>
                            </el-col>
                            <!-- 渲染二级，三级权限 -->
                            <el-col :span="19"></el-col>
                        </el-row>
                        <!-- <pre>
                            {{scope.row}}
                        </pre> -->
                    </template>
                </el-table-column>

```

### 分配权限

```
async showSetRightDialog(role) {
                //获取这个点击权限的id
                this.roleId = role.id
            // 获取权限数据
            const {data:res} = await this.$http.get('rights/tree')
            if(res.meta.status !== 200) {
                return this.$message('获取权限列表失败')
            }
            this.rightslist = res.data
            console.log(this.rightslist)
            //递归获取三级节点的id
            this.getLeaKeys(role,this.defKeys)

            // 分配权限对话框
            this.setRightDialogVisible = true
            },

            //通过递归的形式，获取角色下所有的三级权限的id，并
            //保存到defKeys数组中
            getLeaKeys(node,arr) {
                //如果当前node节点不包涵children属性，说明还不是第三级权限，则要等他第三级才可以放进去
                if(!node.children) {
                    return arr.push(node.id)
                }
                //不是三级节点就继续进行
                node.children.forEach(item=>this.getLeaKeys(item,arr))
            },
            //监听分配权限对话框的关闭事件
            setRightDialogClosed() {
                //重置
                this.defKeys=[]
            },
            //点击分配权限的对话框的确定按钮事件
            async allotRights() {
                const keys = [
                //获取勾选的节点
                this.$refs.treeRef.getCheckedKeys(),
                //获取勾选的节点的半选中的节点
                this.$refs.treeRef.getHalfCheckedKeys()
                ]
                // console.log(keys)
                const idStr = keys.join(',')
                const  {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
                if(res.meta.status!==200){
                    return this.$message.error('分配权限失败')
                }
                this.$message.success('分配成功')

                this.getRolesList()
                this.setRightDialogVisible = false   
                
            }

```

### 分类管理

安装依赖树形表格**vue-tabel-with-tree-grid** 可以参考文档

```
// 引入vue-tabel-with-tree插件
import TreeTabel from 'vue-table-with-tree-grid'
Vue.component('tree-tabel',TreeTabel)


```

```
 <!-- 树形表格   :selection-type='false'去掉多选框 :expand-type='false'取消展开行效果 :show-index='true'展示索引 index-text='#'索引名称 border纵向边框-->
            <tree-tabel :data='cateList' :columns="columns" :selection-type='false' :expand-type='false' :show-index='true' index-text='#' border>
            </tree-tabel>
            
            
             columns:[
                {
                    //标题名称
                    label:'分类名称',
                    //标题属性
                    prop:'cat_name'
                }
            ]   

```

### 添加分类的父级分类名称

```
 <!--expand-trigger='hover'表示鼠标移动就出现 change-on-select 允许选择任意一项 :props="cascaderProps"表示配置对象，就是用来选中后的对象 :options="parentCateList" 操作对象  @change="handleChange"监听改变事件的值-->
                    <el-form-item label="父级分类">
                        <el-cascader  v-model="selectedKeys" :options="parentCateList" change-on-select  expand-trigger='hover' :props="cascaderProps" @change="handleChange" :clearable='true'></el-cascader>
                    </el-form-item>
                    
                    
                    
                    //父级分类的空数组
            parentCateList:[],
            //指定级联选择器的配置对象
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            // 选中父级分类的id数组
            selectedKeys:[]
            
            //获取父级分类的数据列表
         async getParentCateList() {
             const{data:res} =  await this.$http.get('categories',{
              params:{type:2}
             })
             if(res.meta.status!==200) {
                 return this.$message.error('获取数据失败')
             }
             console.log(res)
             this.$message.success('获取数据成功')
             this.parentCateList = res.data
             console.log(this.parentCateList)

         },
        //  监听父级名称的变换
         handleChange() {
             console.log(this.selectedKeys)
         }

```



### 监听计算属性

```
//计算属性
    computed:{
        // 监听添加参数和添加属性按钮是否要禁用
        isBtnDisabled(){
            if(this.selectedCateKeys.length !==3) {
                return true
            }
            return false
        }
    }

```

### 添加动态参数和静态参数

```
async handleChange(){
          //级联选择器不是选择第三级
          if(this.selectedCateKeys.length !==3){
              this.selectedCateKeys=[]
              return
          }
          //选择第三级
          const{data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
            if(res.meta.status!==200){
                return this.$message.error('获取失败')
            }
            console.log(res.data)

      },

//当选中三级分类,（为了接口中找出参数 ：id
        cateId() {
            if(this.selectedCateKeys.length ===3) {
                //返回三级分类的id值
                 console.log('selectCateKeys：'+this.selectedCateKeys)
                return this.selectedCateKeys[2]
            }
            return null
        }
        <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size='mini' :disabled="isBtnDisabled">添加参数</el-button>
                </el-tab-pane>
                <el-tab-pane label="配置管理" name="only">
                    <el-button type="primary" size='mini' :disabled="isBtnDisabled">添加属性</el-button>
                </el-tab-pane>
                 //标签页高亮
            activeName:'many'//本来是first second 因为获取参数要有带参数 many 和only 才可以判断获取的是静态的还是动态的，所以改成many 和onlY

```

### 添加动态参数和静态参数对话框（共用）

```
<!-- 分配角色对话框 -->
        <el-dialog :title="'添加'+ titleText" :visible.sync="addParamsDialogVisible" width="50%" @closed='addDialogVisibleClosed'>
            <el-form ref="addFormRef" label-width="80px"  :rules="addFormRules" :model="addParamsForm">
                    <el-form-item  prop="attr_name" :label=titleText>
                        <el-input v-model="addParamsForm.attr_name"  ></el-input>
                    </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addParamsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParamsDialogVisible=false" >确 定</el-button>
            </span>       
        </el-dialog>
        
        
        titleText(){
            if(this.activeName ==='many') {
                return '动态参数'
            }
            else{
                return '静态参数'
            }
        }

```

### 用过滤器处理时间

```
//全局过滤器Vue.filter('过滤器名字',function(){})   处理时间
Vue.filter('dateFormat',function(orginVal){
  const dt = new Date(orginVal)
  const y = dt.getFullYear()
  const m =(dt.getMonth()+1+'').padStart(2,'0')
  const d = (dt.getDate()+'' ).padStart(2,'0') 
  const hh =(dt.getHours()+'' ).padStart(2,'0') 
  const mm =(dt.getMinutes()+'' ).padStart(2,'0')
  const ss = (dt.getSeconds()+'' ).padStart(2,'0')  
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


<el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="scope">
              <!-- 调用过滤器 -->
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>

```

### 添加商品

使用``this.$router.push('/goods/add')`跳转到商品页面路由

### 图片上传

使用element 的图片上传



### 商品文本编辑器

利用vue的运行依赖 vue-quill-editor

在入口文件

```
import VueQuillEditor from 'vue-quill-editor'

```

//导入编辑器插件

import VueQuillEditor from 'vue-quill-editor'

//导入编辑器所需样式

import 'quill/dist/quill.core.css' // import styles

import 'quill/dist/quill.snow.css' // for snow theme

import 'quill/dist/quill.bubble.css' // for bubble theme

import vueQuillEditor from 'vue-quill-editor'

```
 <quill-editor v-model="addForm.goods_introduce"></quill-editor>

```

### 添加商品事件

| goods_cat | 以为','分割的分类列表 | 不   |
| --------- | --------------------- | ---- |
|           |                       |      |

不能直接重新赋值加入一个逗号，

```
this.addForm.goods_cat = this.addForm.goods_cat.join(',')

```

这样会影响级联选择器，级联需要数组，所以需要深拷贝，通过lodash  的cloneDeep重新弄一个对象出来

```
//引入lodash进行深拷贝
import _ from 'lodash'
  //执行添加后的逻辑
          //通过深拷贝重新赋予一个对象出来，不会影响到级联选择器
          const form = _.cloneDeep(this.addForm)
          form.goods_cat = this.addForm.goods_cat.join(',')	

```

### 物流地址

利用时间线组件

### 数据报表

```
使用ECharts依赖做数据报表

1. 引入import echarts from 'echarts'

2.  基于准备好的dom，初始化echarts实例

   ​        var myChart = echarts.init(document.getElementById('main'));

    3.指定图表的配置项和数据

   ​        var option = {

   ​            title: {

   ​                text: 'ECharts 入门示例'

   ​            },

   ​            tooltip: {},

   ​            legend: {

   ​                data:['销量']

   ​            },

   ​            xAxis: {

   ​                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]

   ​            },

   ​            yAxis: {},

   ​            series: [{

   ​                name: '销量',

   ​                type: 'bar',

   ​                data: [5, 20, 36, 10, 10, 20]

   ​            }]

   ​        }

 // 4.使用刚指定的配置项和数据显示图表。

​        myChart.setOption(option);

```





要合并的选择可以利用loadsh的merge进行合并，这样才可以通过在图中进行鼠标跟随效果查数据

### 进度条

`安装依赖nprogrss`

```
//导入NProgrss包对应的JS和CSS  这是进度条，可以在请求token时开始进度条NProgress.start()，结束时进度条完成NProgress.done()
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.start()
NProgress.done()

```



### 项目优化

1. 生成打包报告

2. 第三方库启用CDN

   使用vue-cli构建的vue项目，在打包发布的时候，发现打包后的文件体积很大，使用`webpack-bundle-analyzer`分析后，发现占用空间最多的是引用的第三方依赖。第三方的依赖文件可以使用cdn外链的方式引入，这样就能大大缩小项目文件的体积。

3. Element-UI组件按需加载

4. 路由懒加载

5. 首页内容定制

通过vue.config.js修改webpack的默认配置

通过vue-cli 3.0工具生成的项目，默认隐藏了所有webpack的配置项，目的是为了屏蔽项目的配置过程，可以把重心放在具体的功能和业务逻辑的实现上

如果需要修改项目根目录，可以创建vue.config.js这个配置文件，从而对项目的打包发布过程做自定义的配置

#### 通过externals加载外部CDN资源

通过Import语法导入的第三方依赖包，最终会被打包合并到同一个文件中，从而导致打包成功后，单文件体积过大的问题

为了解决这个问题，可以通过webpack的externals节点，来配置并加载外部的CDN资源，凡是声明在externals中的第三方依赖包，都不会被打包

```
1.//通过externals加载外部CDN资源
    config.set('externals',{
      vue:'Vue',
      'vue-router':'VueRouter',
      axios:'axios',
      lodash:'_',
      echarts:'echarts',
      nprogress:'NProgress',
      'vue-quill-editor':'VueQuillEditor'
    })
    
    2.在public/index.html引入CSS和JS
     <!-- nprogress 的样式表文件 -->
    <link rel="stylesheet" href="https://cdn.staticfile.org/nprogress/0.2.0/nprogress.min.css" />
    <!-- 富文本编辑器 的样式表文件 -->
    <link rel="stylesheet" href="https://cdn.staticfile.org/quill/1.3.4/quill.core.min.css" />
    <link rel="stylesheet" href="https://cdn.staticfile.org/quill/1.3.4/quill.snow.min.css" />
    <link rel="stylesheet" href="https://cdn.staticfile.org/quill/1.3.4/quill.bubble.min.css" />
    <!-- element-ui 的样式表文件 -->
    <link rel="stylesheet" href="https://cdn.staticfile.org/element-ui/2.8.2/theme-chalk/index.css" />

    <script src="https://cdn.staticfile.org/vue/2.5.22/vue.min.js"></script>
    <script src="https://cdn.staticfile.org/vue-router/3.0.1/vue-router.min.js"></script>
    <script src="https://cdn.staticfile.org/axios/0.18.0/axios.min.js"></script>
    <script src="https://cdn.staticfile.org/lodash.js/4.17.11/lodash.min.js"></script>
    <script src="https://cdn.staticfile.org/echarts/4.1.0/echarts.min.js"></script>
    <script src="https://cdn.staticfile.org/nprogress/0.2.0/nprogress.min.js"></script>
    <!-- 富文本编辑器的 js 文件 -->
    <script src="https://cdn.staticfile.org/quill/1.3.4/quill.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vue-quill-editor@3.0.4/dist/vue-quill-editor.js"></script>

    <!-- element-ui 的 js 文件 -->
    <script src="https://cdn.staticfile.org/element-ui/2.8.2/index.js"></script>

```





在这里， configureWebpack 和 chainWebpack 的作用相同，唯一的区别就是它们修改 webpack 配置的方
式不同：
① chainWebpack 通过链式编程的形式，来修改默认的 webpack 配置
② configureWebpack 通过操作对象的形式，来修改默认的 webpack 配置

```
/通过chinWebpack的链式编程来自定义打包入口，可以判断是生产环境还是开发环境，来引入不同的入口文件
  chainWebpack:config => {
    config.when(process.env.NODE_ENV === 'production',config => {
      config.entry('app').clear().add('./src/main-prod.js')
    })

    config.when(process.env.NODE_ENV === 'development',config => {
      config.entry('app').clear().add('./src/main-dev.js')
    })
  }

```

#### 通过 CDN 优化 ElementUI 的打包

虽然在开发阶段，我们启用了 element-ui 组件的按需加载，尽可能的减少了打包的体积，但是那些被按需加
载的组件，还是占用了较大的文件体积。此时，我们可以将 element-ui 中的组件，也通过 CDN 的形式来加
载，这样能够进一步减小打包后的文件体积。
具体操作流程如下：
① 在 main-prod.js 中，注释掉 element-ui 按需加载的代码
② 在 index.html 的头部区域中，通过 CDN 加载 element-ui 的 js 和 css 样式

```
<!-- element-ui 的样式表文件 -->
<link rel="stylesheet" href="https://cdn.staticfile.org/element-ui/2.8.2/themechalk/index.css" />
<!-- element-ui 的 js 文件 -->
<script src="https://cdn.staticfile.org/element-ui/2.8.2/index.js"></script>

```

#### 首页内容定制

来判断什么环境，生产环境标题不需要加一个dev

开发环境需加标题dev

可以通过插件的形式，来对生成环境追加一个属性isProd

**<%= %>**表示输出的意思

**htmlWebpackPlugin**表示插件名称options表示参数

```
 //判断是不是发布环境，追加一个属性然后可以改变页面index.html的结构,如果是发布环境，则追加一个isProd属性
    config.plugin('html').tap(args => {
      args[0].isProd = true
      return args
    })
    //判断是不是发布环境，追加一个属性然后可以改变页面index.html的结构,如果是发布环境，则追加一个isProd属性
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
<%= htmlWebpackPlugin.options.isProd ? '' : 'dev-' %>

```

##### **dist**文件是发布的产品

#### 路由懒加载

当打包构建项目时，JavaScript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成
不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。
具体需要 3 步：
① 安装 @babel/plugin-syntax-dynamic-import 包。
② 在 babel.config.js 配置文件中声明该插件。

```
'@babel/plugin-syntax-dynamic-import '

```



路由改为按需加载的形式，示例代码如下：

```
// import Login from '../components/Login.vue'
//实现路由懒加载  login-home-welcome表示放入路由的地方 ../components/Login.vue表示该路由的地址
const Login = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/Login.vue')

```

关于路由懒加载的详细文档，可参考如下链接：
https://router.vuejs.org/zh/guide/advanced/lazy-loading.htmlx`

### 项目上线相关配置

1.通过 node 创建 web 服务器。

2. 开启 gzip 配置。
3. 配置 https 服务。
4. 使用 pm2 管理应用。

#### 1. 通过 node 创建 web 服务器

创建一个文件夹，初始化，并放入dist文件,创建一个入口文件app.js

创建 node 项目，并安装 express，通过 express 快速创建 web 服务器，将 vue 打包生成的 dist 文件夹

```
const express = require('express')
// 创建 web 服务器
const app = express()
// 托管静态资源
app.use(express.static('./dist'))
// 启动 web 服务器
app.listen(80, () => {
 console.log('web server running at http://127.0.0.1')
})


```

#### 2. 开启 gzip 配置

使用 gzip 可以减小文件体积，使传输速度更快。
② 可以通过服务器端使用 Express 做 gzip 压缩。其配置如下：

```
// 安装相应包
 npm install compression -S
 // 导入包
 const compression = require('compression');
 // 启用中间件
 app.use(compression());

```

#### 使用 pm2 管理应用

可以关闭终端窗口后仍然可以运行

```
在服务器中安装 pm2：npm i pm2 -g
② 启动项目：pm2 start 脚本 --name 自定义名称
③ 查看运行项目：pm2 ls
④ 重启项目：pm2 restart 自定义名称或者id
⑤ 停止项目：pm2 stop 自定义名称或者id
⑥ 删除项目：pm2 delete 自定义名称或者id
```



### 去除console

利用babel-plugin-transform-remove-console插件
