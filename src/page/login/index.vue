<template>
    <div class="login-bg">
        <div class="login-content">
            <h1 class="login-title">点餐管理系统</h1>
            <div class="login-user">
                <p>账户</p>
                <el-input clearable v-model="user.account" type="text" class="inputref" placeholder="请输入账户" />
            </div>
            <div class="login-user">
                <p>密码</p>
                <el-input show-password v-model="user.password" type="password" class="inputref" placeholder="请输入密码" />
            </div>
            <div class="login-reg" @click="handleClick"><p>{{user.login_state}}</p></div>
            <el-button v-if="user.login_state == '注册'"  @click="signIn" :loading="user.load" class="btn login-btn" type="success" >登录</el-button>
            <el-button v-else  @click="register"  :loading="user.load" class="btn login-btn" type="success"  >注册</el-button>
        </div>
    </div>
</template>

<script setup>
import { reactive,getCurrentInstance ,toRefs} from 'vue';
import {useRouter} from 'vue-router'
    const router = useRouter()
    //getCurrentInstance 获取组件实例
    const {proxy} = getCurrentInstance()    
        let user=reactive({
        account:'',
        password:'',
        login_state:'注册',
        load:false,
    })
    
    //按钮切换
    const handleClick=()=>{
        if(user.login_state =='注册')
            user.login_state='登入'
        else
            user.login_state='注册'
    }
    //登录
    const signIn=async()=>{
        user.load=true
        const obj = {account:user.account,password:user.password}
        try{
            const res = await new proxy.$request(proxy.$urls.m().login,obj).modepost()
            console.log(res)
            if(res.status!=200){
                new proxy.$tips(res.data.msg,'warning').message_pop()
            }else{
                //跳转到相关页面
                let ids = '1'
                localStorage.setItem('token',res.data.data.token)
                localStorage.setItem('menuid',JSON.stringify(ids))
                router.push({name:'index'})
            }
            user.load=false  
        }catch (error) {
            new proxy.$tips('服务器发生错误','error').message_pop()
        }

    }
    //注册
    const  register = async()=>{
        user.load=true
        const obj = {account:user.account,password:user.password}
        try {
            const res = await new proxy.$request(proxy.$urls.m().register,obj).modepost()
            console.log(res)
            if(res.status!=200){
                new proxy.$tips(res.data.msg,'warning').message_pop()
            }else{
                user.login_state='注册'
            }
            user.load=false  
        } catch (error) {
            new proxy.$tips('服务器发生错误','error').message_pop()
        }
        
        
        
        
    }
</script>

<style scoped>
    .login-bg{
        background-image: url(/Project/Webmaster/src/image/bg1.jpg);
        background-attachment: fixed;
        background-repeat: no-repeat;
        background-size: cover;
        min-height: 100vh;
        width: 100%;
        
    }
    .login-content{
        /* 垂直居中*/
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        /* 大小、颜色*/
        width: 500px;
        height: 300px;
        background: whitesmoke;
        opacity: 0.5;
        border-radius: 15px;

    }
    .login-title{
        text-align: center;
        color: #000000;
        font-size: 30px;
        padding: 30px;
        font-family: Arial, Helvetica, sans-serif;
    }
    .login-user{
        display: flex;
        align-items: center;
        margin: 0 auto;
        width: 400px;
        height: 40px;
    }
    .login-user p{
        width: 50px;
        font-size: 16px;
        
    }
    .inputref{
        flex: 1;
        /*去除input边框 */
        border: none;
        outline: none;
        background-color: rgba(0,0,0,0);
    }
    .login-reg{
        width: 400px;
        display: flex;
        justify-content: flex-end;
        margin: 0 auto;   
    }
    .login-reg p{
        cursor: pointer;
        display: contents;
    }
    .login-btn{
        display: flex;
        justify-content: center;
        width: 100%;
        margin: 10px auto 0 auto;
        
    }
    
    .btn{
        width: 150px;
        height: 30px;
        border-radius: 12px;
        font-size: 15px;
        background-color: rgb(246, 167, 233);
        border: none;
        opacity: 0.9;
        
    }
    
</style>