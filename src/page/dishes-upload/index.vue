<template>
    <div class="ordering" >
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ name:'dishes' }">菜品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加菜品</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content-view-ten">
            <!-- 菜品类目-->
            <div class="image-view-title">
                <div class="image-list">菜品类目</div>
                <div>
                    <el-select v-model="data.catevalue" class="m-2" placeholder="请选择菜品类目" >
                        <el-option
                            v-for="cate in data.cates"
                            :key="cate.value"
                            :label="cate.label"
                            :value="cate.value"
                        />
                    </el-select>
                </div>
            </div>
            <!-- 菜品名称 -->
            <div class="image-view-title">
                <div class="image-list">菜品名称</div>
                <el-input v-model="data.name" placeholder="请输入菜品名称" />
            </div>
            <!-- 菜品价格-->
            <div class="image-view-title">
                <div class="image-list">菜品价格</div>
                <div class="upload-option">
                    <el-input type="nubmer" v-model="data.price" placeholder="请输入菜品价格" />
                    <el-select v-model="data.compvalue" class="m-2" placeholder="请选择单位" >
                        <el-option
                            v-for="item in data.company"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                    <el-input v-if="data.compvalue =='自定义单位'"  v-model="data.unit" placeholder="请输入自定义单位" clearable />
                    <div v-if="data.compvalue =='自定义单位'"><el-button 
                        type="success" 
                        style="width: 100%;" 
                        @click="handleAdd"
                        :loading="data.unitload"
                        >添加自定义单位</el-button></div>
                </div>
            </div>
            <!-- 上传照片-->
            <div class="image-view-title">
                <div class="image-list">图片上传</div>
                <div>
                    <el-upload
                        :action="img_url"
                        list-type="picture-card"
                        accept=".jpg,.png,.webp,.jpeg,.jfif"
                        :on-preview="onPreview"
                        :on-remove="onRemove"
                        :on-success="onSuccess"
                        :on-error="onError"
                        :on-progress="onProgress"
                        :before-upload="project"
                        :file-list="data.goodsImages"
                        :limit="1"
                    >
                        <el-icon><Plus /></el-icon>
                    </el-upload>

                    <el-dialog v-model="data.dialogVisible">
                        <img style="width: 100%;" :src="data.dialogImageUrl" alt="Preview Image" />
                    </el-dialog>
                </div>
            </div>
            <!-- 提交-->
            <div class="sub-button">
                <el-button type="success" :loading="data.subload" @click="submit">提交</el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { getCurrentInstance, ref ,toRaw,onMounted} from 'vue'
import {useRouter,useRoute} from 'vue-router'

    const {proxy} = getCurrentInstance()
    const img_url = proxy.$urls.m().uploadres
    const jump_router = useRouter()
    const router = useRoute()
    const data = ref({
        catevalue:'', //选中的菜品类目
        name:'',//输入的菜品名称
        price:'',//输入的菜品价格
        compvalue:'',//选中的菜品的单位
        unit:'',//选中的自定义单位
        cates:[],//菜品类目列表
        company:[],//菜品单位列表
        goodsImages:[], //上传接收的图片
        dialogVisible:false, //是否展示大图
        dialogImageUrl:'', //展开大图的图片连接
        unitload:false,//是否显示加载动画
        subload:false,//提交按钮加载动画
        id:'',//该条菜品数据的唯一标识
    })
    const loading = ref(true)
    //点击文件以上传的文件时的钩子
    const  onPreview = (file)=>{
        data.value.dialogVisible = true
        data.value.dialogImageUrl = toRaw(file).url
    }
    //移除文件钩子
    const onRemove = (file,filelist)=>{
        data.value.goodsImages = [] 
    }
    //上传成功钩子
    const onSuccess = (res,file,filelist)=>{
        data.value.goodsImages.push({url:res.data,uid:file.uid})
    }
    //上传失败钩子
    const onError = (err,file,filelist)=>{

    }
    //上传时钩子
    const onProgress = (event,file,filelist)=>{

    }
    //上传之前钩子
    const project = ()=>{

    }
    //获取菜品类目和单位
    const cate_unit = async()=>{
        try{
            const CATE = new proxy.$request(proxy.$urls.m().obtaincate).modeget()
            const UNIT = new proxy.$request(proxy.$urls.m().obtainunit).modeget()
            const res = await Promise.all([CATE,UNIT])
            data.value.cates = res[0].data.data
            data.value.company = res[1].data.data
            data.value.company.push({label:'自定义单位',unid:'990',value:'自定义单位',_id:'14139'})
        }catch(e){

        }
    }
    //添加自定义单位
    const handleAdd = async()=>{
        data.value.unitload = true
        const obj = {unit:data.value.unit}
        try{
            const res = await new proxy.$request(proxy.$urls.m().dishunit,obj).modepost()
            console.log(res)
            if(res.status != 200){
                new proxy.$tips(res.data.msg,'warning').message_pop()
            }else{
                new proxy.$tips(res.data.msg).message_pop()
                data.value.compvalue = ''
                data.value.unit = ''
                cate_unit()
            }
            data.value.unitload = false
        }catch(e){
            data.value.unitload = false
            new proxy.$tips('服务器发生错误','error').message_pop()
        }
    }
    //提交事件
    const submit = async ()=>{
        data.value.subload = true
        const {id,catevalue,name,price,compvalue,goodsImages} = data.value
        const obj = {id,category:catevalue,name,unitprice:price,unit:compvalue,image:goodsImages}
        const URL = id == '' ? proxy.$urls.m().putdishes:proxy.$urls.m().editdishes

        try{
            const res = await new proxy.$request(URL,obj).modepost()
            console.log(res)
            if(res.status !=200){
                new proxy.$tips(res.data.msg,'warning').message_pop()
            }else{
                new proxy.$tips(res.data.msg,'success').message_pop()
                jump_router.push({name:'dishes'})
            }
            data.value.subload = false

        }catch(e){
            new proxy.$tips(res.data.msg,'error').message_pop()
        }
    }
    //接收传来的菜品数据据
    const etid_data = router.params.val
    if(etid_data != undefined){
        const value = JSON.parse(etid_data)
        console.log(value)
        const {category,name,unitprice,unit,image,_id} = value
        data.value.id = _id
        data.value.catevalue = category
        data.value.name = name
        data.value.price = JSON.stringify(unitprice)
        data.value.compvalue = unit
        data.value.goodsImages = image
    }
    onMounted(()=>{
        cate_unit()
    })
</script>


<style scoped>
    .content-view-ten{
        margin-top: 30px;
        background-color: #ffffff;
        padding: 10px;
    }
    .image-view-title{
        max-width: 800px;
        margin: 0 auto 30px auto;
    }
    .image-list{
        margin-bottom: 20px;
    }
    .upload-option{
        display: flex;
        align-items: center;
        justify-content: left;
    }
    .upload-option div{
        width: 25% !important;
        margin-left: 5px;

    }
    .sub-button {
        text-align: center;
        margin: 120px 0;
    }
    .el-button--success{
        width: 120px;
    }
</style>