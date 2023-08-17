<template>
    <div>
        <el-row :gutter="24">
            <el-col :span="24">
                <div class="grid_content">
                    <div class="grid_title">菜品分类销量趋势</div>
                    <div id="broken-line"></div>
                    <!-- 切换图标-->
                    <div class="query_time">
                        <el-radio-group v-model="res_data.sort_value" size="small">
                            <el-radio-button v-for="(item,index) in res_data.el_radio" :key="index"  :label="item"/>
                        </el-radio-group>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { Line } from '@antv/g2plot';
import { onMounted,defineProps,watch ,ref,reactive,getCurrentInstance} from 'vue';

    const props = defineProps({
        lineChart:Array,
    })
    const res_data = reactive({
        sort_value:'素菜类',
        el_radio:['素菜类','荤菜类','酒水','龙虾'],
        line_update:null,
    })
    const {proxy} = getCurrentInstance()

    //折线图
    const brokenLine = (data)=>{
      
        
        const line = new Line('broken-line', {
            data,
            padding: 'auto',
            xField: 'month',
            yField: 'sales-volume',
            label:{},
            point:{
                size:5,
                shape:'diamond',
                style:{
                    fill:'white',
                    stroke:'#588FF9',
                    lineWidth:2
                }
            },
            tooltip:{showMarkers:false},
            state:{
                active:{
                    style:{
                        shadowBlur:4,
                        stroke:'#000',
                        fill:'red',
                    }
                }
            },
            meta:{
                'month':{
                    alias:'月份'
                },
                'sales-volume':{
                    alias:'销售额'
                }
            },
            interactions:[{type:'marker-active'}]
        });

        line.render();
        res_data.line_update = line


    }

    //监听父组件传来的接口
    watch(props,(newVal,oldVal)=>{
        brokenLine(newVal.lineChart)
    })
    //监听选中哪个分类菜品
    watch(()=>res_data.sort_value,(newVal,oldVal)=>{
        Switch(newVal)

    })
    //请求分类菜品切换的数据
    const  Switch = async(val)=>{
        try{
            const res = await new proxy.$request(proxy.$urls.m().switchcate +'?cateid='+val).modeget()
            res_data.line_update.changeData(res.data.data)
        }catch(e){

        }
    }

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
.query_time{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    padding-bottom: 20px;
}
</style>