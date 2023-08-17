<template>
    <div>
        <!-- 顶部-->
        <div class="sidebar-top">
            <div><el-icon><Eleme /></el-icon><div>点餐管理系统</div></div>
            <div><el-button type="primary" @click="signOut">退出</el-button></div>
        </div> 
        <div class="sidebar-cont">
            <el-menu :default-active="ac_index"  @select="handleSelect">
                <div v-for="(item,index) in menu" :key="index">
                    <router-link :to="{path:item.router}"  style="text-decoration: none;">
                        <el-menu-item v-if="item.subClass.length == 0" :index="item.id">
                            <el-icon><component :is="item.icon"></component></el-icon>
                            <span>{{item.title}}</span>
                        </el-menu-item>
                    </router-link>
                    <!-- 二、三级路由-->
                    <el-sub-menu  v-if="item.subClass.length > 0" :index="item.id">
                        <template #title>
                            <el-icon><component :is="item.icon"></component></el-icon>
                            <span>{{item.title}}</span>
                        </template>
                        <div v-for="(subItem,subIndex) in item.subClass" :key="subItem.id">
                            <router-link  :to="{path:subItem.router}" style="text-decoration: none;">
                                <el-menu-item :index="subItem.id"><span>{{subItem.title}}</span></el-menu-item>
                            </router-link>
                            
                        </div>
                    </el-sub-menu>
                </div>
            </el-menu>
        </div>
        <router-view></router-view>
    </div>
</template>

<script setup>
import { reactive ,ref,onMounted} from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const ac_index= ref('1')
const dataArray = [
    {
        id:'1',
        icon:'Document',
        title:'数据分析',
        router:'data',
        subClass:[]  //是否有二、三级菜单
    },
    {
        id:'2',
        icon:'User',
        title:'用户列表',
        router:'userpage',
        subClass:[]  //是否有二、三级菜单
    },
    {
        id:'3',
        icon:'CreditCard',
        title:'订单管理',
        router:'order',
        subClass:[]  //是否有二、三级菜单
    },
    {
        id:'4',
        icon:'Dish',
        title:'菜品管理',
        router:'dishes',
        subClass:[]  //是否有二、三级菜单
    },
    {
        id:'5',
        icon:'User',
        title:'员工管理',
        router:'',
        subClass:[
            {
                id:'5-1',
                title:'员工详情',
                router:'role'
            },
            {
                id:'5-1',
                title:'其他',
                router:''
            }
        ]  //是否有二、三级菜单
    },
]
const menu = reactive(dataArray)




//菜单激活回调
const handleSelect = (index,path)=>{
    localStorage.setItem('menuid',JSON.stringify(index))
}

onMounted(()=>{
    ac_index.value=JSON.parse(localStorage.getItem('menuid'))
})

const signOut = ()=>{
    localStorage.clear()
    router.push({name:'login'})
}




</script>

<style scoped>
    .sidebar-top{
        width: 100%;
        height: 50px;
        background: #ffffff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 50;
    }
    .sidebar-top div:nth-child(1){
        display: flex;
        padding-left: 25px;
        font-size: 20px;
        color: rgb(28, 181, 247);
    }
    .sidebar-top div:nth-child(1) img{
        background-size: auto;
        
        
    }
    .sidebar-top div:nth-child(2){
        padding-right: 22px;
        cursor: pointer;
    }

    .sidebar-cont{
        position: fixed;
        top: 50px;
        left: 0;
        bottom: 50px;
        background: #ffffff;
        width: 200px;
        height: 100vh;
        color: #000000 !important;
        font-size: 16px;
        overflow-y: auto;
    }
    
</style>