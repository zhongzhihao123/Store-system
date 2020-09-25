<template>
    <div>
        <!-- 面包屑 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

         <!-- 卡片视图 -->
        <el-card>
            <el-button type="primary" class="addRoles" >添加角色</el-button>
            <el-table :data="rolesList" style="width: 100%"  stripe border>
                <!-- 展开列 -->
                <el-table-column type="expand" >
                    <template slot-scope="scope">
                        <el-row v-for="(item1,index) in scope.row.children" :key="item1.id" :class="['bgbottom',index === 0 ? 'bgtop' : '' ,'vcenter']">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close='removeRightById(scope.row,item1.id)'>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级，三级权限 -->
                            <el-col :span="19">
                                <el-row v-for="(item2,index2) in item1.children" :key="item2.id" :class="[index2 === 0? '':'bgtop','vcenter']" >
                                    <!-- 渲染二级 -->
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close='removeRightById(scope.row,item2.id)'>{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 三级权限 -->
                                    <el-col :span="18" >
                                        <el-tag v-for="item3 in item2.children" :key="item3.id" closable @close='removeRightById(scope.row,item3.id)'>{{item3.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!-- <pre>
                            {{scope.row}}
                        </pre> -->
                    </template>
                </el-table-column>
                <!-- type='index'索引列 -->
                <el-table-column type="index" ></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column  label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)">删除</el-button>
                            <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable='false'>
                                <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                            </el-tooltip>   
                        </template>    
                </el-table-column>   
            </el-table>
        </el-card>

        <!-- 分配权限对话框 -->
        <el-dialog title="提示" :visible.sync="setRightDialogVisible" width="50%" @close='setRightDialogClosed'>
            <!-- 树形控件 -->
            <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key='id' default-expand-all :default-checked-keys='defKeys' ref="treeRef"></el-tree>

            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>       
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
           rolesList:[],
        //    分配权限
            setRightDialogVisible:false,
        // 获取权限列表数据
            rightslist:[],
            // 树形控件列表
            treeProps:{
                label:'authName',
                children:'children'
            },
            //树形控件 默认选中的节点
            defKeys:[],
            //没点击时id为空
            roleId:''   
            
        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
        async getRolesList() {
            const {data:res} = await this.$http.get('roles') 
            if(res.meta.status !==200) {
                return this.$message.error('请求数据失败')
            }
            this.rolesList = res.data
        },
        //根据id删除权限
         async removeRightById(role,rightID) {
          const result =  await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
             type: 'warning',
             center: true
        })
        // .catch(err=>err)
        // if(result !=='confirm') {
        //     return this.$message.error('删除失败')
        // }
        // const {data:res} = await this.$http.delete
        //         (
        //             `roles/${role.id}/rights/${rightID}`
        //         )
               
        //         this.$message.success('删除用户成功')
        //         this.getRolesList()
        // if(res.meta.status !==200) {
        //             return $message.error('删除失败')
        //         }  
        
        //上面的注释也可以
        .then(async () => {
                this.$message({
                    type:'success',
                    message:'！成功删除'
                })
                const {data:res} = await this.$http.delete
                (
                    `roles/${role.id}/rights/${rightID}`
                )
                if(res.meta.status !==200) {
                    return $message.error('删除失败')
                }
                this.$message.success('删除用户成功')
                role.children = res.data
            }).catch( () => {
                 this.$message({
                    type:'info',
                    message:'！取消删除'
                    })
                })       
            },
            
             // 展示分配权限的对话框
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
                console.log(keys)
                const idStr = keys.join(',')
                console.log(idStr)
                const  {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
                console.log(res)
                if(res.meta.status!==200){
                    return this.$message.error('分配权限失败')
                }
                this.$message.success('分配成功')

                this.getRolesList()
                this.setRightDialogVisible = false   
                
            }
        
           
           
        }
         
}
</script>
<style lang="less" scoped>
.addRoles {
    margin-bottom: 15px;
}
.el-tag {
    margin: 7px;
}
.bgtop {
    border-top: 1px solid #eee;
}
.bgbottom {
    border-bottom: 1px solid #eee;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>