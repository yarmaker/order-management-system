<template>
    <div class="ordering" v-loading="loading">
        <div class="heading">数据分析</div>
        <FirstFloor class="head" :pieChart="analysis.pieChart" :hisTogram="analysis.hisTogram"></FirstFloor>
        <Second :lineChart="analysis.lineChart"></Second>
    </div>
</template>

<script setup>
import FirstFloor from './component/first-floor.vue';
import Second from './component/second.vue';
import { reactive ,onMounted,getCurrentInstance,ref} from 'vue';


    const {proxy} = getCurrentInstance()
    const loading = ref(true)
    const analysis = reactive({
        pieChart:[],//饼图
        hisTogram:[],//柱状图
        lineChart:[],//折线图
    })

    //请求数据
    onMounted(()=>{
        get_data()
    })

    const get_data = async ()=>{
        
        try{
            const res= await new proxy.$request(proxy.$urls.m().analysis).modeget()
            analysis.pieChart = res.data.data[0]
            analysis.hisTogram = res.data.data[1]
            analysis.lineChart = res.data.data[2]
            loading.value = false
        }catch(e){
            new proxy.$tips(res.data.msg,'error').message_pop()
        }
    }

</script>


<style>
.head{
    margin-bottom: 30px;
    margin-left: 10px;
}

</style>
