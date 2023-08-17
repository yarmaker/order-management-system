<template>
    <div class="ordering" v-loading="loading">
        <div class="heading">用户列表</div>
        <div>
            <el-table :data="user_array" style="width: 100%">
                <el-table-column prop="time" label="注册时间" width="180" />
                <el-table-column prop="name" label="姓名" width="180" />
                <el-table-column label="头像">
                    <template #default="scope">
                        <el-image  style="width: 60px; height:60px;" 
                        fit="cover" 
                        :src="scope.row.head"
                        :preview-src-list="[scope.row.head]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="sex" label="性别" width="180" />
            </el-table>
            <el-pagination background layout="prev, pager, next"  :total="data.total"  @current-change="currentchange"/>
        </div>
    </div>
</template>
<script setup>
import { reactive,onMounted,getCurrentInstance,toRefs,ref} from 'vue';
    onMounted(()=>{
        getData()
    })
    const {proxy} =getCurrentInstance()
    const loading = ref(true)
    const data = reactive(
    {
        user_array:[],//表格数据
        total:0 ,//数据总量
        page:0,
    }
    )
    //请求数据
    const getData = async()=>{
        try {
            const res = await new proxy.$request(proxy.$urls.m().pulluserlist+'?page='+data.page).modeget()
            data.user_array = res.data.data.result
            data.total = res.data.data.total
            loading.value = false
        } catch (e) {
            new proxy.$tips(res.data.msg,'error').mess_age()
        }
    }
   //msg total _id time name head sex position

    //页面变化
    const currentchange = (e)=>{

        data.page = e-1
        getData() 
    }
    const {user_array} = toRefs(data)
</script>

<style scoped>









</style>