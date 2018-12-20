import { RouteConfig } from 'vue-router';

//component
const Home = (r: any) =>
    (require as any).ensure([], () => r(require('../views/Home'), 'Home')); 
const Swiper = (r: any) =>
    (require as any).ensure([], () => r(require('../views/Swiper'), 'Swiper')); 

//routes
const routes = [
    {
        name: 'index',
        path: "/",
        component: Home
    },
    {
        name: 'swiper',
        path: "/swiper",
        component: Swiper
    },
]

export default routes