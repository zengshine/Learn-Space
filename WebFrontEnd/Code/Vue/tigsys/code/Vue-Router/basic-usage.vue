<template>
    <div id="app">
    <p>
      <router-link to="/foo">Go to Foo</router-link>
      <router-link to="/bar">Go to Bar</router-link>
    </p>
    <!-- component matched by the route will render here -->
    <router-view></router-view>
    <router-view name="foo"></router-view>
    <router-view name="bar"></router-view>
  </div>
</template>

<script>
// 0. call `Vue.use(VueRouter)`.

Vue.use(VueRouter);
// 1. Define route components.
const Foo = { template: "<div>foo</div>" };
const Bar = { template: "<div>bar</div>" };
const Home = { template: "<div>home</div>" };
// 2. Define some routes

const routes = [
  { path: "/home", component: Home, alias: "/index" },
  { path: "/foo", component: Foo },
  { path: "/bar", component: Bar },
  { path: "/redirect", redirect: "/home" },
  {
    path: "/multi",
    components: {
      default: Home,
      foo: Foo,
      bar: Bar
    }
  }
];

// 3. Create the router instance and pass the `routes` option

const router = new VueRouter({
  routes, // short for `routes: routes`
  scrollBehavior(to, from, savedPosition) {
    const targetPosition = computePosition(); // 计算期望滚动到哪个的位置
    // 锚点滚动
    // targetPositon {
    //   selector: to.hash,
    // }
    //异步滚动
    // return new Promise((resolve, reject) => {
    //   resolve({ x: 0, y: 0 })
    // })
    return targetPosition;
  }
});

router.beforEach((to, from, next) => {
  console.log("beforEach");
  next();
});

// 4. Create and mount the root instance.

const app = new Vue({
  router
}).$mount("#app");
</script>
