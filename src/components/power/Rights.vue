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
    </div>
</template>

<script>
export default {
    data(){
        return{
            rightsList:[]
        }
    },
    created(){
        this.getrightsList()
    },
    methods:{
        async getrightsList() {
            const {data:res} = await this.$http.get('rights/list') 
            if(res.meta.status !=200) return this.$message.error('请求数据失败')
            this.rightsList = res.data
        }
    }
    
}
</script>
<style lang="less" scoped>

</style>