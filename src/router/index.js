import {createRouter,createWebHashHistory} from 'vue-router'


const routes = [
    {
        path:'/',
        name:'login',
        component:()=>import('../page/login/index.vue')
    },
    {
        path:'/index',
        name:'index',
        component:()=>import('../page/index/index.vue'),
        redirect:'/data',
        //二级路由
        children:[
            {   //用户列表
                path:'/userpage',
                name:'userpage',
                component:()=>import('../page/user-page/index.vue')
            },
            {   //订单管理
                path:'/order',
                name:'order',
                component:()=>import('../page/order/index.vue')
            },
            {   //菜品管理
                path:'/dishes',
                name:'dishes',
                component:()=>import('../page/dishes/index.vue')
            },
            {   //菜品管理:上传菜品
                path:'/upload',
                name:'upload',
                component:()=>import('../page/dishes-upload/index.vue')
            },
            {   //员工详情
                path:'/role',
                name:'role',
                component:()=>import('../page/role-manage/index.vue')
            },
            {   //数据分析
                path:'/data',
                name:'data',
                component:()=>import('../page/data-analysis/index.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
