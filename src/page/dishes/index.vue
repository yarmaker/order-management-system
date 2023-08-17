<template>
    <div class="ordering" v-loading="loading">
        <div class="heading">菜品管理</div>
        <div class="button-view">
            <router-link :to="{name:'upload'}">
                <el-button type="success">添加菜品</el-button>
            </router-link>
            
        </div>
        <div>
            <el-table :data="data.dish_data" style="width: 100%">
                <el-table-column prop="time" label="创建时间" align="center" min-width="100" />
                <el-table-column prop="category" label="类目" align="center" min-width="100" />
                <el-table-column prop="name" label="菜品名称" align="center" min-width="100" />
                <el-table-column label="商品图片">
                    <template #default="scope">
                        <el-image  style="width: 60px; height:60px;" 
                        fit="cover" 
                        :src="scope.row.image[0].url"
                        :preview-src-list="[scope.row.head]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="unitprice" label="价格" align="center" min-width="100" />
                <el-table-column  label="操作" align="center" >
                    <template #default="scope">
                        <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
                        <el-button type="danger" v-if="scope.row.onsale" @click="offthe_Shelf(scope.row.name,scope.row._id,scope.$index)">下架</el-button>
                        <el-button type="danger" disabled v-else>已下架</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页-->
            <el-pagination background layout="prev, pager, next"  :total="data.total" :hide-on-single-page="true" @current-change="currentchange"/>
        </div>
    </div>
</template>
<script setup>
import { ref,getCurrentInstance,onMounted} from 'vue'
import {useRouter} from 'vue-router'


    const {proxy} = getCurrentInstance()
    const router = useRouter()
    const data = ref({
        page:0,//当前页数
        dish_data:[],//菜品数据
        total:0,// 页面总数
    })
    const loading = ref(true)
    //请求菜品数据
    const getdishes = async ()=>{
        try{
            const res = await new proxy.$request(proxy.$urls.m().obtaindishes+'?page='+data.value.page).modeget()
            console.log(res)
            data.value.dish_data = res.data.data.result
            data.value.total = res.data.data.total
            loading.value = false
        }catch(e){
            new proxy.$tips(res.data.msg,'error').message_pop()
        }
    }
    //下架菜品
    const offthe_Shelf = (name,id,index)=>{
        ElMessageBox.confirm(
            `确认对${name}下架吗?`,
            '提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
                center:'true'
            }
        )
        .then(res=>{
            shelf(id,index)
        })
        .catch(err=>{
            console.log('取消')
        })
    }

    //下架菜品
    const shelf = async(id,index)=>{
        try{
            const res = new proxy.$request(proxy.$urls.m().fromsale+'?id='+ id).modeget()
            console.log(res)
            data.value.dish_data[index].onsale = false
        }catch(e){

        }
    }
    //编辑菜品
    const edit = (scope)=>{
        const val = JSON.stringify(scope)
        router.push({name:'upload',params:{val}})
    }



    const currentchange = ()=>{
        
    }
    onMounted(()=>{
        getdishes()
    })
</script>

<style scoped>
    .button-view{
        display: flex;
        justify-content: flex-end;
        margin-bottom: 30px;
    }
</style>