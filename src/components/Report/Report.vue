<template>
    <div>
        
          <!-- 面包屑 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <!--1. 为ECharts准备一个具备大小（宽高）的Dom -->
            <div id="main" style="width: 750px;height:400px;"></div>
        </el-card>
        
        

       

    </div>
</template>
<script>
import echarts from 'echarts'
import _ from 'lodash'
export default {
    data() {
        return {
        options: {
                title: {
                text: '用户来源'
                },
                tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                    backgroundColor: '#E9EEF3'
                    }
                }
                },
                grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
                },
                xAxis: [
                {
                    boundaryGap: false
                }
                ],
                yAxis: [
                {
                    type: 'value'
                }
            ]
        }


            
        }
    },
    created(){
       
    },
    //此时，页面上的元素已经渲染完毕
    async mounted(){
        // 2.基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        const {data:res} = await this.$http.get('reports/type/1')
        if(res.meta.status !==200){
            return this.$message.error('获取数据失败')
        }
        this.$message.success('获取数据成功')
        
        //基于准备好的配置项和数据
            //1.因为有2份数据，所以需要进行合并
            const result = _.merge(res.data,this.options)
        // 4.使用刚指定的配置项和数据显示图表。
        myChart.setOption(result);


    },
    methods:{
       
    }
}
</script>
<style lang="less" scoped>

</style>