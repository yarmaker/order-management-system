import axios from "axios";
import { Base64 } from "js-base64"
import { ElMessageBox } from 'element-plus'



//axios配置
let instance = axios.create({
    responseType:"json",
    headers:{'Content-Type':'application/json'}
})

//base64加密
const baseFun=()=>{
    const token = localStorage.getItem('token')
    const base64 = Base64.encode(token+':')
    return 'Basic '+base64
}

//请求拦截器，在axios发送请求前给每一个接口携带TOKEN进行胜负校验
instance.interceptors.request.use(
    req=>{
        let token = localStorage.getItem('token')
        if(token){
            req.headers.Authorization = baseFun()
        }
        return req
    },
    err=>{
        return Promise.reject(err)
    }
)

//响应拦截
instance.interceptors.response.use(
    response=>{
        return response
    },
    error=>{
        if(error.response){
            let ERRS = error.response.status
            let MSG = error.response.data.msg
            let errdata = ERRS == 401 ? MSG : '服务器发生错误'
            switch(ERRS){
                case 401 :
                //没有访问权限
                ElMessageBox.alert(errdata,'提示',{
                    confirmButtonText: '确认',
                    type:"error"
                })
                .then(res=>{
                    window.location.href='/'
                })
                .catch(err=>{
                    window.location.href='/' 
                })
                break;
            }
        }
        return Promise.reject(error.response.data)     
        //返回接口错误信息
    }
)

export default instance