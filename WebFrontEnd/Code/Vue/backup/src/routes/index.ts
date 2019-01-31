//routes
const routes = [
    {
        name: 'index',
        path: "/",
        component: () =>
            import('@/views/Swiper/Swiper.vue')
    },
    {
        name: 'swiper',
        path: "/swiper",
        component: () =>
            import('@/views/Swiper/Swiper.vue')
    },
]

export default routes