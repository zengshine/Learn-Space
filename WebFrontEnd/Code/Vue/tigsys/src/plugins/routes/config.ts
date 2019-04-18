//routes
import Home from '@/views/Home.vue'
const Detail =()=>import('@/views/Tigsys/Detail.vue')
// import Detail from '@/views/Tigsys/Detail.vue'
const Location =()=>import('@/views/Tigsys/Location.vue')
const Mapnav =()=>import('@/views/Tigsys/Mapnav.vue')
const routes = [
    {
        name: 'index',
        path: "/",
        component: Home
    },
    {
        name: 'detail',
        path: "/detail",
        component: Detail
    },
    {
        name: 'location',
        path: "/location",
        component: Location
    },
    {
        name: 'mapnav',
        path: "/mapnav",
        component: Mapnav
    },
]

export default routes