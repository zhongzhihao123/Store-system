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
                <el-alert  title="消息提示的文案" type="info" :closable='false'></el-alert>
                <!-- 步骤条   :active="activeIndex-0"为了转化为数字类型-->
                <el-steps :space="200" :active="activeIndex-0" finish-status="success" class="steps" align-center>
                    <el-step title="基本信息"></el-step>
                    <el-step title="商品步骤"></el-step>
                    <el-step title="商品属性"></el-step>
                    <el-step title="商品图片"></el-step>
                    <el-step title="商品内容"></el-step>
                    <el-step title="完成"></el-step>
                </el-steps>

                <!-- tab栏区域 -->
                <el-form ref="addFormRef" :model="addForm"  label-width="100px" :rules="addFormRules" label-position="top"   > 
                    <el-tabs :tab-position="'left'"  class="tab" v-model="activeIndex" :before-leave="beforeTabLeave"  @tab-click='tabClicked'>
                        <el-tab-pane label="基本信息" name='0'>
                            <el-form-item label="商品名称" prop="goods_name" >
                                <el-input v-model="addForm.goods_name"></el-input>
                            </el-form-item>
                            <el-form-item label="商品价格" prop="goods_price">
                                <el-input v-model="addForm.goods_price" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="商品重量" prop="goods_weight">
                                <el-input v-model="addForm.goods_weight" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="商品数量" prop="goods_number">
                                <el-input v-model="addForm.goods_number" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="商品分类" prop="goods_cat">
                                <el-cascader expand-trigger="hover" :options="catelist" :props="cateProps" v-model="addForm.goods_cat" @change="handleChange">
                            </el-cascader>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="商品参数" name='1'>
                            <!-- 渲染表单的Item项 -->
                            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                            <!-- 复选框组 -->
                                <el-checkbox-group v-model="item.attr_vals">
                                    <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="商品属性" name="2">
                            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                              <el-input v-model="item.attr_vals"> </el-input>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="商品图片" name='3'>
                          <!-- :on-success="handleSuccess" 表示上传图片成功的回调函数 action是表示要上传图片到后台的地址  :on-preview上传后的处理函数  :on-remove删除图片的处理函数  list-type	文件列表的类型-->
                          <el-upload
                            class="upload-demo"
                            :action="uploadUrl"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture"
                            :headers="headerObj"
                            :on-success="handleSuccess"
                            >
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                          </el-upload>
                        </el-tab-pane>
                        <el-tab-pane label="商品内容" name='4'>
                          <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <!-- 添加商品 -->
                        <el-button type="primary" class="bcd" @click="add">添加商品</el-button>
                        </el-tab-pane>
                    </el-tabs>
                </el-form>
           </el-card>
        
      <!-- 图片预览 -->
      <el-dialog
        title="图片预览"
        :visible.sync="previewVisible"
        width="50%">
        <img :src="previewPath" alt="" class="preview">
      </el-dialog>
    </div>
</template>


<script>
//引入lodash进行深拷贝
import _ from 'lodash'

export default {
    data() {
        return{
          activeIndex:'0',
          addForm:{
              goods_name:'',
              goods_price:'',
              goods_weight:'',
              goods_number:'',
              goods_cat:[],
              //图片临时路径
              pics:[],
              //商品描述
              goods_introduce:'',
              attrs: []
          },
          //商品规则
          addFormRules:{
            goods_name: [
                { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
            goods_price: [
                { required: true, message: '请输入商品价格', trigger: 'blur' }
                ],
            goods_weight: [
                { required: true, message: '请输入商品重量', trigger: 'blur' }
                ],
            goods_number: [
                { required: true, message: '请输入商品数量', trigger: 'blur' }
                ],
            goods_cat: [
                { required: true, message: '请选择商品分类', trigger: 'blur' }
                ]
          },
          //商品分类列表
          catelist:[],
          //级联选择器操作对象
          cateProps: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
          },
          // 动态参数列表数据
          manyTableData: [],
          // 静态属性列表数据
          onlyTableData: [],
          //图片上传地址
          uploadUrl:'http://127.0.0.1:8888/api/private/v1/upload',
          //为图片设置请求头，因为要有token权限才可以经过api
           headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      //预处理图片的地址
          previewPath:'',
          //图片处理预览弹框
          previewVisible:false
        }
    },
    created() {
      this.getCateList()
    },
    methods:{
        async getCateList() {
        const { data: res } = await this.$http.get('categories')

        if (res.meta.status !== 200) {
            return this.$message.error('获取商品分类数据失败！')
        }

        this.catelist = res.data
        console.log(this.catelist)
        },
        // 级联选择器选中项变化，会触发这个函数
        handleChange() {
        console.log(this.addForm.goods_cat)
        if (this.addForm.goods_cat.length !== 3) {
            this.addForm.goods_cat = []
            }
        },
        //标签切换监听函数
        beforeTabLeave(activeName,oldActiveName) {
            //       console.log('即将离开的标签页名字是：' + oldActiveName)
            //   console.log('即将进入的标签页名字是：' + activeName)
            //   return false
            if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                this.$message.error('请先选择商品分类！')
                return false
            }
        },
        //标签切换时触发函数
        async tabClicked() {
          console.log(this.activeIndex+'哈哈')
          // 证明访问的是动态参数面板
          if (this.activeIndex === '1') {
            const { data: res } = await this.$http.get(
              `categories/${this.cateId}/attributes`,
              {
                params: { sel: 'many' }
              }
            )

            if (res.meta.status !== 200) {
              return this.$message.error('获取动态参数列表失败！')
            }

            console.log(res.data)
            res.data.forEach(item => {
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
            })
            this.manyTableData = res.data
          } else if (this.activeIndex === '2') {
            const { data: res } = await this.$http.get(
              `categories/${this.cateId}/attributes`,
              {
                params: { sel: 'only' }
              }
            )

            if (res.meta.status !== 200) {
              return this.$message.error('获取静态属性失败！')
            }  
            console.log(res.data)
            this.onlyTableData = res.data 
                }
        },
        //图片处理函数
        handlePreview(file) {
          console.log(file)
          this.previewPath = file.response.data.url
          this.previewVisible = true
        },
        //图片删除函数
        handleRemove(file) {
          //1.找出删除图片的临时路劲
          console.log(file)
          const filePath = file.response.data.tmp_path
          //2.找出索引值
          const i = this.addForm.pics.findIndex(x => x.pic === filePath)
          //3.调用方法，从pics数组删除
          this.addForm.pics.splice(i,1)
          console.log(this.addForm)
        },
        //图片成功上传后的函数
        handleSuccess(response) {
          console.log(response)
          //拼接得到一个图片信息对象
         
         const picInfo = {pic:response.tmp_path}
          //将图片信息对象push到pics空数组进去
        this.addForm.pics.push(picInfo) 
        console.log(this.addForm)       
        },
        //添加商品的事件
      async add() {
          this.$refs.addFormRef.validate(async valid => {
            if(!valid){
              return this.$message.error('请填写必要的表单项')
            }
          })
          //执行添加后的逻辑
          //通过深拷贝重新赋予一个对象出来，不会影响到级联选择器
          const form = _.cloneDeep(this.addForm)
          form.goods_cat = this.addForm.goods_cat.join(',')
          
          //处理动态参数和静态属性
          //1.把参数进行循环,然后放进去
          this.manyTableData.forEach(item => {
            const newInfo = {
              attr_id:item.attr_id,
              attr_value:item.attr_vals.join(' ')
              }
            this.addForm.attrs.push(newInfo)
          })
          console.log(this.addForm.attrs)
          //静态
          
          this.onlyTableData.forEach(item => {
            const newInfo = {
              attr_id:item.attr_id,
              attr_value:item.attr_vals}
            this.addForm.attrs.push(newInfo)
          })
           form.attrs = this.addForm.attrs
           //通过api添加商品
           const {data:res} = await this.$http.post('goods',form)
           if(res.meta.status !=201) {
             return this.$message.error('添加商品失败')
           }
           this.$message.success('添加商品成功')
           //重定向到商品列表
           this.$router.push('/goods')
            
        }   
    },
    computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.steps {
    margin-top: 15px;
}
.el-step {
    font-size: 13px;
}
.tab {
    margin-top: 15px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.preview {
  width: 100%;
}
.bcd {
    margin-top: 30px;
}

</style>