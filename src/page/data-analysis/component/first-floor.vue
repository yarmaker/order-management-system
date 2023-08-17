<template>
    <!-- 饼图、柱状图-->
    <div>
        <el-row :gutter="24">
            <el-col :span="12">
                <div class="grid-content">
                    <div class="grid_title">菜品销量排行榜</div>
                    <div id="piechart"></div>
                </div>

            </el-col>
            <el-col :span="12">
                <div class="grid-content">
                    <div class="grid_title">客户年龄分布</div>
                    <div id="columnar"></div>
                </div></el-col> 
        </el-row>
    </div>
</template>

<script setup>
import { Pie , Column} from '@antv/g2plot'
import { onMounted ,defineProps,watch} from 'vue'

    const props = defineProps({
        pieChart:Array,
        hisTogram:Array,
    })
    onMounted(()=>{
        
       
    })
    //饼图
    const pieChart = (data)=>{
        

        const piePlot = new Pie('piechart', {
            appendPadding: 10,
            data,
            angleField: 'value',
            colorField: 'name',
            radius: 0.8,
            label: {
                type: 'outer',
                content:'{name} {percentage}'
            },
            
            interactions: [{ type: 'element-active' }],
        });

        piePlot.render()

    }

    //柱状图
    const coLumnar = (data)=>{

        const columnPlot = new Column('columnar', {
            data,
            xField: 'age',
            yField: 'sales-volume',
            label: {
                // 可手动配置 label 数据标签位置
                position: 'middle', // 'top', 'bottom', 'middle',
                // 配置样式
                style: {
                    fill: '#FFFFFF',
                    opacity: 0.6,
                },
            },
            xAxis: {
                label: {
                    autoHide: true,
                    autoRotate: false,
                },
            },
            meta: {
                'age': {
                    alias: '年龄',
                },
                'sales-volume': {
                    alias: '销售额',
                },
            },
        });

    columnPlot.render();
    }
    
    
    watch(props,(newVal,oldVal)=>{
        pieChart(newVal.pieChart)
        coLumnar(newVal.hisTogram)
    })



</script>



<style scoped>
el-row{
    margin-bottom: 20px;
}
.grid-content{
    background-color: #ffffff;
}
.grid_title{
    font-weight: bold;
    padding: 10px;
    border-bottom: 1px solid #eee;
    margin-top: 20px;
}
</style>