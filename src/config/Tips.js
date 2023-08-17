import { ElMessage } from 'element-plus'
// 公共弹窗
const tips = class{
    constructor(message,type='success'){
        this.message=message
        this.type=type
    }

    message_pop=()=>{
        ElMessage({
            message: this.message,
            type: this.type,
            duration:1500
        })
    }

}
export default tips