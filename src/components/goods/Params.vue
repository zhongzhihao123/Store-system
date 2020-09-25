<template>
    <div>
         <!-- 面包屑 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 警告 -->
            <el-alert title="只允许第三极分类设置为相关参数" type="warning" show-icon :closable='false'>
             </el-alert>
             <!-- 商品分类区域 -->
             <el-row class="cat_opt">
                 <el-col>
                      <span class="demonstration">选择商品分类：</span>
                        <el-cascader
                            v-model="selectedCateKeys"
                            :options="cateList"
                             expand-trigger="hover"
                              :props="cateProps"
                            @change="handleChange"></el-cascader>
                 </el-col>
             </el-row>
             <!-- 页签区域 -->
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size='mini' :disabled="isBtnDisabled" @click="addParams">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTabelData" style="width: 100%">
                        <!-- 展开列 -->
                         <el-table-column type="expand" >
                             <!-- 循环标签 -->
                             <template slot-scope="scope">
                                 <el-tag v-for="(item,i) in scope.row.attr_vals" :key='i' closable @close='handleClose(i,scope.row)'>{{item}}</el-tag>
                                  <!-- 添加标签 -->
                             <el-input  class="input-new-tag"  v-if="scope.row.inputVisible" v-model="scope.row.inputValue"  ref="saveTagInput"  size="small"  @keyup.enter.native="handleInputConfirm(scope.row)"  @blur="handleInputConfirm(scope.row)" >
                             </el-input>
                             <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                             </template>
                            

                         </el-table-column>
                        <!-- type='index'索引列 -->
                         <el-table-column type="index" ></el-table-column>
                         <el-table-column
                        prop="attr_name"
                        label="参数名称">
                        </el-table-column>
                        <!-- 操作 -->
                        <el-table-column  label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParams(scope.row.attr_id)">修改</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button> 
                        </template>    
                        </el-table-column> 
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="配置管理" name="only">
                    <el-button type="primary" size='mini' :disabled="isBtnDisabled"  @click="addParams">添加属性</el-button>
                <!-- 静态参数表格 -->
                    <el-table :data="onlyTabelData" style="width: 100%">
                        <!-- 展开列 -->
                         <el-table-column type="expand" >
                             <template slot-scope="scope">
                                 <el-tag v-for="(item,i) in scope.row.attr_vals" :key='i' closable @close='handleClose(i,scope.row)'>{{item}}</el-tag>
                                  <!-- 添加标签 -->
                                 <el-input  class="input-new-tag"  v-if="scope.row.inputVisible" v-model="scope.row.inputValue"  ref="saveTagInput"  size="small"  @keyup.enter.native="handleInputConfirm(scope.row)"  @blur="handleInputConfirm(scope.row)" >
                                 </el-input>
                                 <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                             </template>
                             
                         </el-table-column>
                        <!-- type='index'索引列 -->
                         <el-table-column type="index" ></el-table-column>
                         <el-table-column
                        prop="attr_name"
                        label="参数名称">
                        </el-table-column>
                        <!-- 操作 -->
                        <el-table-column  label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini"  @click="editParams(scope.row.attr_id)">修改</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button> 
                        </template>    
                        </el-table-column> 
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加动态和静态对话框 -->
        <el-dialog :title="'添加'+ titleText" :visible.sync="addParamsDialogVisible" width="50%" @closed='addDialogVisibleClosed'>
            <el-form ref="addFormRef" label-width="80px"  :rules="addFormRules" :model="addParamsForm">
                    <el-form-item  prop="attr_name" :label=titleText>
                        <el-input v-model="addParamsForm.attr_name"  ></el-input>
                    </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addParamsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="ConfirmsAdd" >确 定</el-button>
            </span>       
        </el-dialog>

        <!-- 编辑动态和静态对话框 -->
        <el-dialog :title="'修改'+ titleText" :visible.sync="editParamsDialogVisible" width="50%" @closed='editDialogVisibleClosed'>
            <el-form ref="editFormRef" label-width="80px"  :rules="editFormRules" :model="editParamsForm">
                    <el-form-item  prop="attr_name" :label=titleText>
                        <el-input v-model="editParamsForm.attr_name"  ></el-input>
                    </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editParamsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="ConfirmsEdit" >确 定</el-button>
            </span>       
        </el-dialog>
    </div>
</template>


<script>
export default {
    data() {
        return{
            //商品分类列表
            cateList:[],
            selectedCateKeys:[],
            //级联选择框配置对象
            cateProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            //标签页高亮
            activeName:'many',
            //动态参数数据
            manyTabelData:[],
            //静态参数数据
            onlyTabelData:[],
            //添加属性
            addParamsForm:{
                attr_name:''
            },
            //添加对话框显示与隐藏
            addParamsDialogVisible:false,
            // 添加参数的规则
            addFormRules:{
                attr_name:[
                     { required: true, message: '请输入属性名称', trigger: 'blur' }
                ]
            },
            //编辑对话框
            editParamsDialogVisible:false,
            //编辑属性
            editParamsForm:{
                attr_name:''
            },
            // 编辑参数的规则
            editFormRules:{
                attr_name:[
                     { required: true, message: '请输入属性名称', trigger: 'blur' }
                ]
            }
            
        }
    },
    created() {
      this.getCateList()
    },
    methods:{
        //获取所有商品列表数据
      async getCateList() {
          const {data:res} = await this.$http.get('categories')
          if(res.meta.status!==200) {
              return this.$message.error('获取数据失败')
          }
          console.log(res)
          this.cateList = res.data
         
      },
      //监听级联选择改变事件
      handleChange(){
          this.getParamsData()
      },
        //   标签页切换监听事件
        handleClick() {
            console.log(this.activeName)
            this.getParamsData()
        },
        //获取参数的列表数据
        async getParamsData() {
             //级联选择器不是选择第三级
          if(this.selectedCateKeys.length !==3){
              this.selectedCateKeys=[]
              this.manyTabelData = []
              this.onlyTabelData = []
              return
          }
          //选择第三级
          const{data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
            if(res.meta.status!==200){
                return this.$message.error('获取失败')
            }
            console.log(res.data)

            //将attr_vals弄成数组
            res.data.forEach(item =>{
                // 添加每一行中加入的新标签的显示与隐藏
                item.inputVisible = false
                // 添加新标签的内容
                item.inputValue = ''

                //判断是否为空
                item.attr_vals =item.attr_vals ?
                item.attr_vals.split(' ') : []
            })
            
            //判断获取的是动态参数数据还是静态参数数据
            if(this.activeName == 'many') {
                //动态参数
                this.manyTabelData = res.data
            }else{
                //静态参数
                this.onlyTabelData = res.data
            }
        },
        //添加属性
        addParams() {
            this.addParamsDialogVisible=true
        },
        //监听添加对话框关闭
        addDialogVisibleClosed() {
            //重置
            this.$refs.addFormRef.resetFields()
        },
        //确定添加
        ConfirmsAdd(){
            //验证
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid) {return}
                const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,
                {
                    attr_name:this.addParamsForm.attr_name,
                    attr_sel:this.activeName
                    }
                )
                if(res.meta.status !==201){
                    return this.$message.error('添加参数失败')
                }
                this.$message.success('添加成功')
                this.addParamsDialogVisible=false
                this.getParamsData()
            })
            
        },
        //编辑属性
        async editParams(attr_id){
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,
            {params:{attr_sel:this.activeName}})
            if(res.meta.status !==200){
                    return this.$message.error('添加参数失败')
                }
            this.$message.success('添加成功')
            this.editParamsForm = res.data
            this.editParamsDialogVisible=true
        },
        //监听编辑对话框关闭
        editDialogVisibleClosed() {
            //重置
            this.$refs.editFormRef.resetFields()
        },
        //确定修改
        ConfirmsEdit(){
            //验证
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid) {return}
                const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`,
                {
                    attr_name:this.editParamsForm.attr_name,
                    attr_sel:this.activeName
                    }
                )
                if(res.meta.status !==200){
                    return this.$message.error('修改参数失败')
                }
                this.$message.success('添加成功')
                this.editParamsDialogVisible=false
                this.getParamsData()
            })
        },
            // 根据Id删除对应的参数项
        async removeParams(attr_id) {
            const confirmResult = await this.$confirm(
                '此操作将永久删除该参数, 是否继续?',
                '提示',
                {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }
            ).catch(err => err)

            // 用户取消了删除的操作
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除！')
            }

            // 删除的业务逻辑
            const { data: res } = await this.$http.delete(
                `categories/${this.cateId}/attributes/${attr_id}`
            )

            if (res.meta.status !== 200) {
                return this.$message.error('删除参数失败！')
            }

            this.$message.success('删除参数成功！')
            this.getParamsData()
        },
        // 添加标签事件
        async handleInputConfirm(row) {
            //判断输入的是否为空格
            if(row.inputValue.trim().length ===0) {
                row.inputValue =''
                row.inputVisible = false
                return
            }
            //如果不是为空
            row.attr_vals.push(row.inputValue.trim())
            row.inputVisible=false
            row.inputValue=''
            this.saveAttrVals(row)
        },
        // 对标签属性操作保存到数据库
        async saveAttrVals(row) {
            //发起请求，保存这次操作
             const {data:res} =  await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                 attr_name:row.attr_name,
                 attr_sel:row.attr_sel,
                 attr_vals:row.attr_vals.join(' ')
             })  
             if(res.meta.status !==200){return this.$message.error('错误')}
             this.$message.success('成功')

        },
        // 展示添加标签的内容
        showInput(row) {
            row.inputVisible = true
            // 自动获取焦点
             this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        //删除标签
        handleClose(i,row) {
            row.attr_vals.splice(i,1)
            this.saveAttrVals(row)
        }
    },
    //计算属性
    computed:{
        // 监听添加参数和添加属性按钮是否要禁用
        isBtnDisabled(){
            if(this.selectedCateKeys.length !==3) {
                return true
            }
            return false
        },
        //当选中三级分类,（为了接口中找出参数 ：id
        cateId() {
            if(this.selectedCateKeys.length ===3) {
                //返回三级分类的id值
                 console.log('selectCateKeys：'+this.selectedCateKeys)
                return this.selectedCateKeys[2]
            }
            return null
        },
        // 判断对话框标题的属性
        titleText(){
            if(this.activeName ==='many') {
                return '动态参数'
            }
            else{
                return '静态参数'
            }
        }
    }
    
}
</script>
<style lang="less" scoped>
.cat_opt {
    margin-top: 15px;
}
.el-tag {
    margin: 7px;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>