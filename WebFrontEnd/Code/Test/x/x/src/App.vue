<template>
  <div id="app" v-loading="loginstate=='init'">
    <template >
      <headerleft v-if="$route.path != '/user/login' && $route.path != pathObj.p_test && ROLETYPE != 3" ></headerleft>
      <div class="container" v-if="$route.path != '/user/login' && $route.path != pathObj.p_test && ROLETYPE != 3" >
        <router-view ></router-view>
      </div>
    </template>
    <div class="container1"  v-if="$route.path == pathObj.p_test && ROLETYPE == 3">
      <router-view ></router-view>
    </div>
    <div v-show="loginstate == 'fail'" class="emptytip">用户未授权或授权超时，请刷新重试或返回互联网运营平台入口重新访问</div>
    <div v-if="$route.path == pathObj.p_test && ROLETYPE != 3 || $route.path != pathObj.p_test && ROLETYPE == 3" class="emptytip">请填写正确的路由</div>
  </div>
</template>

<script>
import headerleft from './components/headers/header_left.vue'
import { mapState , mapActions} from 'vuex'
export default {
  name: 'app',
  computed:{
    ...mapState('comcont', {
      loginstate: state => state.loginstate
    }),
    ...mapState('identity', {
      ROLETYPE: state => state.ROLETYPE,
      TICKET: state => state.TICKET
    })

  },
  watch: {
    TICKET(val){
      this.setWaitCount();
    }
  },
  mounted(){
    this.setWaitCount();
  },
  methods: {
    ...mapActions('comcont', [
      'setWaitCount'
    ])
  },
  components: {
    headerleft,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.container{
  width: 100%;
  height: 100vh;
  padding-left: 240px;
  padding-top: 70px;
  background:rgba(244,246,249,1);
  box-sizing: border-box;
  overflow: auto;
}
.emptytip{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: fixed;
  left: 0;
  top: 0;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding-bottom: 200px;
  font-size: 22px;
  color: #aaa;
  text-align: center;
  background: #fff;
}
</style>

