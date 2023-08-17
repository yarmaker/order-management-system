<template>
    <div class="ordering" v-loading="loading">
        <div class="heading">订单管理</div>
        <div class="query-view">
            <!-- 时间选择器-->
            <div class="quotation-query">
                <div class="quotation-title">交易时间</div>
                <el-date-picker
                    v-model="data.time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD"
                />
            </div>
            <!-- 下拉菜单 -->
            <div class="quotation-query">
                <div class="quotation-title">桌号</div>
                <div>
                    <el-select v-model="data.savalue" class="m-2" placeholder="请选择桌号" >
                        <el-option
                            v-for="item in data.options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>
            </div>
            <!-- 查询按钮-->
            <div class="quotation-query"><el-button type="success" @click="queryFun">查询</el-button></div>
        </div>
        <!-- 表格 -->
        <div>
            <el-table :data="data.table_data" style="width: 100%">
                <el-table-column prop="order_time" label="交易时间" min-width="100" />
                <el-table-column prop="table_number" label="桌号" min-width="100" />
                <el-table-column prop="number_of_diners" label="用餐人数" min-width="100" />
                <el-table-column label="菜品详情" align="center" min-width="100">
                    <template #default="scope">
                        <el-button size="small" :loading="scope.$index == data.deta_load ? true:false" @click="detailed(scope.$index,scope.row._id)">详细菜单</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="set_amount" label="交易金额" min-width="100" />
                <el-table-column label="交易状态" align="center" min-width="100">
                    <template #default="scope">
                        <el-button size="small" v-if="scope.row.transac_status =='success'"  disabled type="danger">已结账</el-button>
                        <el-button size="small" v-else type="danger">未结账</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next"  :total="data.total"  @current-change="currentchange"/>
        </div>
        <!-- 弹窗-->
		<Dialog ref="dialog"></Dialog>
    </div>
</template>
<script setup>
import { ref,onMounted,getCurrentInstance } from 'vue';
import qs from 'qs'
import Dialog from './component/el-dialog.vue';

    const {proxy} = getCurrentInstance()
    const data = ref({
        time:'', //选中的时间
        savalue:'', //选中的桌号
        options:[], //桌号的数据
        table_data:[], //表格数据
        page:0,//第一页的数据
        total:0,//分页
        deta_load:-1,
    })
    const loading = ref(true)
    let dialog = ref(null)
    // 请求数据
    onMounted(()=>{
        get_order()
    })

    const get_order = async()=>{
        const query = qs.stringify({
            page:data.value.page,
            table_number:data.value.savalue,
            order_time:JSON.stringify(data.value.time),

        })
        try{
            const TAB =  new proxy.$request(proxy.$urls.m().gettable).modeget()
            const ORDER =  new proxy.$request(proxy.$urls.m().obtainorder+'?'+query).modeget()
            const res = await Promise.all([TAB,ORDER])
            data.value.options = res[0].data.data
            data.value.table_data = res[1].data.data.result
            data.value.total = res[1].data.data.total
            loading.value = false
        }catch(e){
            new proxy.$tips(res.data.msg,'error').message_pop()
        }
    }
    //分页触发事件
    const currentchange = (e)=>{
        data.value.page= e-1 
        get_order()
    }
    //点击详细菜单传值给子组件
    const detailed = async(index,id)=>{
        data.value.deta_load = index
        try{
            //const res = await new proxy.$request(proxy.$urls.m().vieworder+'?id='+id).modeget() 
            const res = await new proxy.$request(proxy.$urls.m().vieworder + '?id=' + id).modeget()
            dialog.value.popup(res.data.data)
            data.value.deta_load = -1
        }catch(e){
            new proxy.$tips('服务器发生错误','error').message_pop()
            data.value.deta_load = -1
        }
    }
    // 查询
    const queryFun = ()=>{
        get_order()
    }
</script>

<style scoped>
/* -----------------------查询组件，flex--------------*/
.query-view{
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
}
.quotation-query{
    display: flex;
    align-items: center;
    margin-right: 15px;
}
.quotation-title{
    margin-right: 10px;
}
</style>