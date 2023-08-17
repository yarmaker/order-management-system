<template>
    <el-dialog v-model="dialogFormVisible">
        <el-form :model="form">
            <el-form-item label="工号">
                <el-input v-model="form.job_num" autocomplete="off" />
            </el-form-item>
            <el-form-item label="姓名" >
                <el-input v-model="form.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="性别" >
                <el-radio-group v-model="form.sex" class="ml-4">
                    <el-radio label="001" >男</el-radio>
                    <el-radio label="002" >女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="职位" >
                <el-input v-model="form.position" autocomplete="off" />
            </el-form-item>
            <el-form-item label="是否离职" >
                <el-radio-group v-model="form.quit" class="ml-4">
                    <el-radio label="001" >在职</el-radio>
                    <el-radio label="002" >已离职</el-radio>
                </el-radio-group>
            </el-form-item>

        </el-form>
        <!--按钮 -->
        <template #footer>
            <span class="dialog-footer">
                <el-button  @click="dialogFormVisible = false" >取消</el-button>
                <el-button type="primary" @click="submit" :loading="sub_load">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref,reactive,defineExpose,getCurrentInstance,defineEmits } from 'vue'
    const dialogFormVisible = ref(false)
    const sub_load = ref(false)
    const emit = defineEmits(['launch'])
    const {proxy} = getCurrentInstance()
    const form = reactive({
        job_num:'',//工号
        name:'',//姓名
        sex:'',//性别
        position:'',//职位
        quit:'',//是否离职
    })
    const add = ()=>{
        dialogFormVisible.value = true
    }
    const submit = async()=>{
        sub_load.value = true
        const {job_num,name,sex,position,quit} = form
        const obj = {
            jobnumber:job_num,
            name,
            sex,
            position,
            quit
        }
        try{
            const res = await new proxy.$request(proxy.$urls.m().addem,obj).modepost()
            console.log(res)
            if(res.status != 200){
                new proxy.$tips(res.data.msg,'warning').message_pop()
            }else{
                new proxy.$tips(res.data.msg,'success').message_pop()
                emit('launch')
                dialogFormVisible.value =false
            }
            sub_load.value = false
            
        }catch(e){
            sub_load.value = true
        }

    }
    defineExpose({
        add,
    })

</script>