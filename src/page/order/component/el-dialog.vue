<template>
    <div>
        <el-dialog
            v-model="dialogVisible"
            title="详细菜单"
            width="500px"
            center
            class="dialog"
        >
        <div class="menu-padd" v-for="(item,index) in menu_data" :key=index>
            <div class="Menu-details menu-span">
                <span>第{{menu_data.length-index}}次下单</span>
            </div>
            <div>
                <div class="Menu-details menu-margin" v-for="(item_menu,index_menu) in item.goods_list" :key=index_menu>
                    <span>{{ item_menu.name }}</span>
                    <span v-if="item_menu.good_specs !=''">{{item_menu.good_specs}}</span>
                    <span>{{item_menu.quantity}}{{item_menu.unit}}</span>
                </div>
            </div>
        </div>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref,reactive,defineExpose,toRef} from 'vue'

    const dialogVisible = ref(false) 
    const menu_data = ref(
        []
    )

    const popup = (val)=>{
        dialogVisible.value = true
        menu_data.value= val
    }   

    defineExpose({popup})
</script>


<style scoped>
    .dialog{
        height: 600px;
        overflow-y: auto;
    }
    .menu-padd{
        border-bottom: 1px solid #f8f8f8;
    }
    .menu-datails{
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 50px;
    }
    .menu-margin{
        margin: 20px 0;
    }
    .menu-span{
        font-weight: bold;
        font-size: 15px;
        padding-top: 20px;
    }
</style>


