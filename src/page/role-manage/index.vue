<template>
    <div class="ordering" v-loading="loading">
        <div class="heading">员工详情</div>
        <div class="query-view">
            <el-button type="success" @click="add_to">添加员工</el-button>
            <el-button type="danger" @click="Delete" :disabled="data.arr_id.length>0 ? false : true">批量删除</el-button>
        </div>
        <!--表格-->
        <div>
            <el-table :data="data.table_data" style="width: 100%" @select="Select" @select-all="Selectall">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="time" label="创建时间" align="center" min-width="100" />
                <el-table-column prop="jobnumber" label="工号" align="center" min-width="100" />
                <el-table-column prop="name" label="姓名" align="center" min-width="100" />
                <el-table-column prop="sex" label="性别" align="center" min-width="100" />
                <el-table-column prop="position" label="职位" align="center" min-width="100" />
                <el-table-column  label="是否离职" align="center" min-width="100" >
                    <template #default="scope">
                        <el-switch v-model="scope.row.quit" @change="Switch($event,scope.row._id)" />
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页-->
            <el-pagination background layout="prev, pager, next" 
             :total=data.total 
             :hide-on-single-page="true"
            @current-change="currentchange"
             :current-page="data.cur_page"/>
            <!-- 弹窗-->
            <ElDialog ref="dialog" @launch="launch"></ElDialog>
        </div>
    </div>

</template>

<script setup>
import { ref,onMounted,getCurrentInstance } from 'vue'
import ElDialog from './component/El-dialog.vue'
import qs from 'qs'


    const {proxy} = getCurrentInstance()
    const data = ref({
        table_data:[],
        page:0,//分页数
        total:0,//总数据条数
        arr_id:[],//存储待删除员工的id
        cur_page:0,//当前页码
    })
    const loading = ref(true)
    const dialog = ref(null)
    //调用子组件显示弹窗
    const add_to = ()=>{
        dialog.value.add()
    }

    //请求员工数据
    onMounted(()=>{
        get_role()
    })

    const get_role = async()=>{
        try{
            const res = await new proxy.$request(proxy.$urls.m().getemployees+'?page='+data.value.page).modeget()
            data.value.table_data = res.data.data.result
            data.value.total = res.data.data.total
            loading.value = false
        }catch(e){
            new proxy.$tips(res.data.msg,'error').message_pop()
        }
    }

    //开关选择器触发
    const Switch = async(val,id,index)=>{
        console.log(val,id)
        const query = qs.stringify({id,quit:val,})
        try{
            const res = await new proxy.$request(proxy.$urls.m().modifyresi+'?'+query).modeget()
            if(res.status == 200){
                new proxy.$tips(res.data.msg,'success').message_pop()
            }else{
                data.value.table_data[index].quit = !val 
            }
            
        }catch(e){
            data.value.table_data[index].quit = !val 
        }
    } 

    //删除员工数据
    const Delete = ()=>{
        console.log(data.value.arr_id)
        ElMessageBox.confirm(
            `确认对${data.value.arr_id.length}个员工下架吗?`,
            '提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
                center:'true'
            }
        )
        .then(res=>{Batch()})
        .catch(err=>{})
    }
    //调用接口删除员工数据
    const Batch = async()=>{
        const obj = {
            arrayid:data.value.arr_id,
        }
        try{
            const res = await new proxy.$request(proxy.$urls.m().deleteemp,obj).modepost()
            if(res.status ==200){
                new proxy.$tips(res.data.msg,'success').message_pop()
                data.value.arr_id = []
                get_role()
            }else{
                new proxy.$tips(res.data.msg,'warning').message_pop()
            }
            
            
        }catch(e){
            new proxy.$tips(res.data.msg,'warning').message_pop()
        }
    }
    //单行选择or取消选中
    const Select = (e)=>{
        const ID = e.map(item=>item._id)
        data.value.arr_id = ID
    }
    //全选or取消全选
    const Selectall = (e)=>{
        const ID = e.map(item=>item._id)
        data.value.arr_id = ID
    }

    //分页触发事件
    const currentchange = (e)=>{
        data.value.page = e-1
        data.value.cur_page = e
        get_role()
    }
   //加载数据
   const launch = ()=>{
        data.value.page = 0
        data.value.cur_page = 1
        get_role()
   }

</script>