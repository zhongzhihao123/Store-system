<template>
    <div>
       <!-- 面包屑 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card class="box-card">          
                <!-- 输入框 -->
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-input placeholder="请输入内容"  class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList()">
                            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
                         </el-input> 
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                    </el-col>
                </el-row>  
            <!--用户列表数据  -->
                <el-table :data="userlist" style="width: 100%">
                    <!-- type='index'索引列 -->
                    <el-table-column type="index" ></el-table-column>
                    <el-table-column
                        prop="username"
                        label="姓名">
                    </el-table-column>
                    <el-table-column
                        prop="email"
                        label="邮箱">
                    </el-table-column>
                    <el-table-column
                        prop="mobile"
                        label="电话">
                    </el-table-column>
                    <el-table-column
                        prop="role_name"
                        label="角色">
                    </el-table-column>
                    <el-table-column  label="状态">
                        <template slot-scope = "scope" > 
                            <!-- {{scope.row}} -->
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)" >
                        </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180px">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable='false'>
                                <el-button type="warning" icon="el-icon-setting" size="mini"  @click="setRole(scope.row)"></el-button>
                            </el-tooltip>   
                        </template>                    
                    </el-table-column>
                </el-table>
                <!-- 数据分页 -->
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
        </el-card>

        <!-- 添加用户对话框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%"  @close='addDialogClosed' >
            <el-form ref="addFormRef" label-width="70px" class="login_form" :model="addForm" :rules="addFormRules" >
                    <!-- 用户名 -->
                    <el-form-item prop="username" label="用户名">
                        <el-input v-model="addForm.username" ></el-input>
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item  prop="password" label="密码">
                        <el-input v-model="addForm.password" type='password' ></el-input>
                    </el-form-item>
                    <el-form-item  prop="email" label="邮箱">
                        <el-input v-model="addForm.email"  ></el-input>
                    </el-form-item>
                    <el-form-item  prop="mobile" label="手机">
                        <el-input v-model="addForm.mobile"  ></el-input>
                    </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑用户对话框 -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close='editDialogClosed' >
            <el-form ref="editFormRef" label-width="70px" class="login_form" :rules="editFormRules" :model="editForm">
                    <!-- 用户名 -->
                    <el-form-item prop="username" label="用户名">
                        <el-input v-model="editForm.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item  prop="email" label="邮箱">
                        <el-input v-model="editForm.email"  ></el-input>
                    </el-form-item>
                    <el-form-item  prop="mobile" label="手机">
                        <el-input v-model="editForm.mobile"  ></el-input>
                    </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>


         <!-- 分配角色对话框 -->
        <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%">
            <div>
                <p>当前的用户：{{userInfo.username}}</p>
                <p>当前的用户：{{userInfo.role_name}}</p>
                <p>分配角色：
                    <el-select v-model="sectionRole" placeholder="请选择">
                        <el-option
                        v-for="item in rolesList"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                        </el-option>
                    </el-select>

                </p>
            </div>
            

            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo" >确 定</el-button>
            </span>       
        </el-dialog>
        
    </div>
</template>


<script>
export default {
    data() {
         // 自定义验证邮箱的规则
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
        return {
            //获取用户列表的参数
            queryInfo:{
                // 查询参数
                query:'',
                // 当前页码
                pagenum:1,
                // 每页显示条数
                pagesize:2
            },
            userlist:[],
            total:0,
            //添加用户的显示与隐藏操作
            addDialogVisible:false,
            //编辑用户的显示与隐藏操作
            editDialogVisible:false,
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            // 编辑用户的信息对象
            editForm:[],
           
            //添加用户表单规则
            addFormRules:{
                username:[
                     { required: true, message: '请输入用户名称', trigger: 'blur' },
                     { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                password:[
                     { required: true, message: '请输入登录密码', trigger: 'blur' },
                     { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                email:[
                     { required: true, message: '请输入邮箱', trigger: 'blur' },
                     { validator:checkEmail, trigger: 'blur' }
                ],
                mobile:[
                     { required: true, message: '请输入手机号码', trigger: 'blur' },
                     {validator:checkMobile, trigger: 'blur' }
                ]
            },
             //编辑用户表单规则
            editFormRules:{
                email:[
                     { required: true, message: '请输入邮箱', trigger: 'blur' },
                     { validator:checkEmail, trigger: 'blur' }
                ],
                mobile:[
                     { required: true, message: '请输入手机号码', trigger: 'blur' }
                    
                ]
            },

            //分配角色
            rolelist:[],
            //分配角色对话框
            setRoleDialogVisible:false,
            //用户信息
            userInfo:{},
            //角色列表
            rolesList:[],
            //对话框中选中id值
            sectionRole:''
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
        },
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
        },
        async userStateChanged(userInfo) {
            console.log(userInfo)
            const {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
            if(res.meta.status !==200) {
                userInfo.mg_state = !userInfo.mg_state
                return this.$message.error('更改失败')
            }
            this.$message.success('更改用户状态成功')
        },
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
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
        },
        async showEditDialog(id) {
        const{data:res} =  await  this.$http.get('users/'+id)
            if(res.meta.status !==200){
                this.$message.error('查询用户失败')
            }
            this.editForm=res.data
            this.editDialogVisible=true
        },
        editDialogClosed() {
             this.$refs.editFormRef.resetFields()
        },
        //编辑操作预验证
        editUserInfo() {
             this.$refs.editFormRef.validate( async vaild => {
                if(!vaild) return
                    //发起修改用户网络请求   
           const{data:res} = await this.$http.put('users/'+this.editForm.id,{
                email:this.editForm.email,
                mobile:this.editForm.mobile
            })
            if(res.meta.status !==200) {
                this.$message.error('修改失败')
            }
            //关闭对话框
            this.editDialogVisible = false
            //刷新数据列表
            this.getUserList()
            //提示成功
            this.$message.success('修改成功')

            })
        },
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
        },
        //分配角色
        async setRole(userInfo) {
            this.userInfo = userInfo


            //展示所有角色列表
            const {data:res} = await this.$http.get('roles')
            if(res.meta.status!==200) {
                return this.$message.error('获取列表失败')
            }
            this.rolesList =res.data

            this.setRoleDialogVisible = true
            console.log('io')
        },
        async saveRoleInfo() {
            if(!this.sectionRole) {
                return this.$message.error('请选择要分配的角色')
            }
            const  {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.sectionRole})
                if(res.meta.status!==200){
                    return this.$message.error('分配角色失败')
                }
                this.$message.success('分配成功')

                this.getUserList()
                this.setRoleDialogVisible = false 
        }

        
        
    }
}
</script>
<style lang="less" scoped>
.el-pagination {
    margin-top: 15px;
}
</style>