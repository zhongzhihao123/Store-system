<template>
    <div>
         <!-- 面包屑 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品页面</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-button type="primary" class="addRoles" @click="showAddCateDialog">添加分类</el-button>

            <!-- 表格   :selection-type='false'去掉多选框 :expand-type='false'取消展开行效果 :show-index='true'展示索引 index-text='#'索引名称 border纵向边框-->
            <tree-tabel class="treeTabel" :data='cateList' :columns="columns" :selection-type='false' :expand-type='false' :show-index='true' index-text='#' border>
                <!-- 是否有效 -->
                <template slot="isOK" slot-scope="scope">
                    <i style="color:lightgreen" type='primary' class="el-icon-success" v-if="scope.row.cat_deleted===false"></i>
                    <i class="el-icon-error" style="color:red"  v-else></i>
                </template>  
                <!-- 自定义模板的排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag type="mini" v-if="scope.row.cat_level===0">一等级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.cat_level===1">二等级</el-tag>
                    <el-tag type="warning" v-else>三等级</el-tag>
                </template> 
                <!-- 自定义模板的操作 -->
                <template slot="opt" >
                    <el-button type="primary" icon="el-icon-edit" size="mini" >编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" >删除</el-button>
                </template>   
            </tree-tabel>
    

            <!-- 分页视图 -->
            <!-- 数据分页 -->
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
        </el-card>

        <!-- 添加分类对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close='addCateDialogClosed'>
           <!-- 添加分类表单 -->
            <el-form ref="addCateFormRef" label-width="80px" class="login_form" :rules="addCateFormRules" :model="addCateForm">
                    <el-form-item prop="cat_name" label="分类名称">
                        <el-input v-model="addCateForm.cat_name" ></el-input>
                    </el-form-item>
                    <!--expand-trigger='hover'表示鼠标移动就出现 change-on-select 允许选择任意一项 :props="cascaderProps"表示配置对象，就是用来选中后的对象 :options="parentCateList" 操作对象  @change="handleChange"监听改变事件的值-->
                    <el-form-item label="父级分类">
                        <el-cascader  v-model="selectedKeys" :options="parentCateList" change-on-select  expand-trigger='hover' :props="cascaderProps" @change="parentCateChanged" :clearable='true'></el-cascader>
                    </el-form-item>
                    
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>       
        </el-dialog>
    </div>
</template>


<script>
export default {
    data() {
        return{
            //查询参数
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            cateList:[],
            //总数据条数
            total:0 ,
            //为tabel指定列的定义
            columns:[
                {
                    //标题名称
                    label:'分类名称',
                    //标题属性
                    prop:'cat_name'
                },
                {
                    //标题名称
                    label:'是否有效',
                    //自定义模板
                    type:'template',
                    // 自定义列的名称
                    template:'isOK'
                },
                {
                    //标题名称
                    label:'排序',
                    //自定义模板
                    type:'template',
                    // 自定义列的名称
                    template:'order'
                }
                ,
                {
                    //标题名称
                    label:'操作',
                    //自定义模板
                    type:'template',
                    // 自定义列的名称
                    template:'opt'
                }
            ],
            //添加分类对话框显示与隐藏
            addCateDialogVisible:false,
            //添加分类
            addCateForm:{
                cat_name:'',
                //父级分类等级  
                cat_pid:0,
                // 分类等级
                cat_level:0
            } , 
            //添加分类规则
            addCateFormRules:{
                cat_name:[
                     { required: true, message: '请输入分类名称', trigger: 'blur' },
                     { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ]
            },
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
        }
    },
    created() {
       this.getCateList()
    },
    methods:{
        //获取数据列表
      async getCateList() {
          const{data:res} = await this.$http.get('categories',{ params:this.queryInfo})
          console.log(res)
          if(res.meta.status !==200) {
              return this.$message.error('获取数据失败')
          }
          this.$message.success('获取数据成功')
          this.cateList = res.data.result
          //总数据条数
          this.total = res.data.total
        },
        //监听每页显示条数的参数
        handleSizeChange(newPageSize) {
            console.log(newPageSize)
            this.queryInfo.pagesize = newPageSize
            //重新渲染
            this.getCateList()
        },
        // 监听页码值的改变的事件
         handleCurrentChange(newPage) {
              console.log(newPage)
              this.queryInfo.pagenum = newPage
                //重新渲染
            this.getCateList()
         },
         //添加分类
         showAddCateDialog() {
             //调用获取父级分类数据列表的方法
             this.getParentCateList()

             this.addCateDialogVisible = true
         },
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
         parentCateChanged() {
            //  console.log(this.selectedKeys)
            //为了在添加分类后判断添加的父级分类是什么（根据id）以及添加的等级，则要根据selectkeys如果selecteKeys数组的length大于0，则证明已经选择父级名称了，否则就是还没有选择父级名称
            if(this.selectedKeys.length>0) {
                // 父级分类的id
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length -1]
                //添加分类的等级
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            }else {
                 // 父级分类的id
                this.addCateForm.cat_pid = 0
                //添加分类的等级
                 this.addCateForm.cat_pid = 0
                  this.addCateForm.cat_level = 0
            }

         },
         //添加分类确定事件
         addCate() {
             //预验证
             this.$refs.addCateFormRef.validate(async valid => {
                 if(!valid) return
                 const {data:res} = await this.$http.post('categories',this.addCateForm)
                 if(res.meta.status!==20) {
                     this.$message.error('添加错误')
                 } 
                 this.$message.success('添加成功')
                 this.getCateList()
                 this.addCateDialogVisible = false

             })

         },
         //监听对话框的关闭事件，重置表单
         addCateDialogClosed() {
             this.$refs.addCateFormRef.resetFields()
             this.selectedKeys=[]
              this.addCateForm.cat_level = 0
             this.addCateForm.cat_pid = 0

         }
    }
}
</script>
<style lang="less" scoped>
.treeTabel {
    margin-top: 15px;
}
.el-cascader {
    width: 100%;
}
</style>