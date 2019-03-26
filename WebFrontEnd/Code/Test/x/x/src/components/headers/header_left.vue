<template>
    <div class="header_left">
        <div class="title">小程序管理平台</div>
        <div class="userwp">
            <img class="userimg" :src="userimg" alt="">
            <div class="username">{{username}}</div>
        </div>
        <ul class="list" >
            <template v-for="(item, key) in list">
                <li  :key="key" v-if="isExistInTheRole(item.roles)"  >
                    <a href="javascript:void(0)" @click="toLink($event, item)" :class="{active: ck == item.key, child_active: pk == item.key, open:item.open}">
                        <i class="iconfont" :class="item.icon" v-if="item.icon"></i>
                        <span>{{item.name}}</span>
                        <i class="iconfont icon-arrow_down" v-if="item.children && item.children.length"></i>
                        <span class="notread n_1" v-if="waitcount && item.children && item.children.length && !item.open">{{waitcount}}</span>
                    </a>
                    <transition name="el-zoom-in-top">
                    <ul class="sublist"  v-if="item.children && item.children.length" v-show="item.open">
                        <li class="js-subitem"  v-for="(subitem, subkey) in item.children" :key="subkey" >
                            <a href="javascript:void(0)"  @click="toLink($event, subitem)" :class="subitem.key == ck? 'active':''">
                                <i class="iconfont" :class="subitem.icon" v-if="subitem.icon"></i>
                                <span>{{subitem.name}}</span>
                                <span class="notread " v-if="waitcount && item.open">{{waitcount}}</span>
                            </a>
                        </li>
                    </ul>
                    </transition>
                </li>
            </template>
            
        </ul>
        <div class="btnwp">
            <i class="iconfont icon-close1"></i>
            <i class="iconfont icon-setting"></i>
        </div>
    </div>
</template>
<script>
import { mapState} from 'vuex'
import util from './../../assets/js/util.js'
import defautlimg from './../../assets/images/userimg.png'
const Identity = util.Identity;
export default {
    name: 'header_left',
    data(){
        return {
            userimg: defautlimg,
            username: '',
            list: [this.MENU.m_mypro, {...this.MENU.m_promanger, open: true, children: [this.MENU.m_waitapp]}, this.MENU.m_assistapp],
            ck: '',
            pk: ''
        }
    },
    computed:{
        ...mapState('comcont', {
            waitcount: state => state.waitcount,
            loginstate: state => state.loginstate
        }),
        ...mapState('identity', {
            ROLETYPE: state => state.ROLETYPE
        })
    },
    methods: {
        /**
         * 判断在这个身份下是否存在
         * @param {Array} arr允许的身份
         */
        isExistInTheRole(arr){
            for(let i = 0, len = arr.length; i < len; i++){
                if(arr[i] == this.ROLETYPE){
                    return true;
                }
            }
            return false;
        },
        /**
         * 跳转到某个key 对应的页面
         * @param {Event}
         */
        toLink(e, item){
            let tg = e.target;
            if(/icon-arrow_down/.test(tg.className)){
                this.$set(item, 'open', !item.open);
                return;
            }else if(item.topath != this.$route.path){
                this.$router.push({path:item.topath})
            }
        },
        /**
         * 设置 this.pk
         */
        setPathMsg(){
            let path = this.$route.path;
            let key = this.$route.query.key;
            for(let i = 0, len = this.list.length; i < len; i++){
                let item = this.list[i];
                if(path == item.topath || path == item.repath || key == item.key){
                    this.ck = item.key;
                    this.pk = '';
                    return;
                }else if(item.children && item.children.length){
                    for(let j = 0, jlen = item.children.length; j < jlen; j++){
                        let subitem = item.children[j];
                        if(path == subitem.topath || key == subitem.key){
                            this.ck = subitem.key;
                            this.pk = item.key;
                            return;
                        }
                    }
                }
            }
        },
        getPK(ck){
            for(let i = 0, len = this.list.length; i < len; i++){
                let item = this.list[i];
                if(item.key == ck){
                    return ''
                }else if(item.children && item.children.length){
                    for(let j = 0, jlen = item.children.length; j < jlen; j++){
                        let subitem = item.children[j];
                        if(subitem.key == ck){
                            return item.key;
                        }
                    }
                }
            }
            return '';
        },
        initConfs(){
            //roletype:0为用户,1为管理者,2为协助审批,3为测试商户号填写
            let cur = Identity.getIdCurUser();
            if(!cur){
                return;
            }
            this.username = cur.NAME;
        }
    },
    watch: {
        ROLETYPE(val){
            this.setPathMsg()
        },
        loginstate(val){
            if(val == 'success'){
                this.setPathMsg()
            }
        },
        $route(to){
            this.setPathMsg()
        }
    },
    mounted(){
        this.initConfs()
        this.setPathMsg()
    }
}
</script>

<style lang="less" scoped>
.header_left{
    width:240px;
    background: @dark-bg;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    overflow: hidden;
    .title{
        width: 100%;
        height: 70px;
        line-height: 70px;
        text-align: center;
        font-size: @font-size1;
        font-weight:400;
        color: @white;
        background: @dark-bg1;
        box-sizing: border-box;
    }
    .userwp{
        margin-top: 60px;
        text-align: center;

    }
    .userimg{
        display: inline-block;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        vertical-align: top;
    }
    .username{
        font-size: @font-size2;
        font-weight:400;
        color: @normal-grey4;
        margin-top: 14px;
    }
    .list{
        margin-top: 60px;
        li{
            position: relative;
            font-size: 0;
            line-height: 0;
        }
        a{
            display: block;
            font-size: @font-size3;
            font-weight:400;
            color: @normal-grey4;
            line-height: 60px;
            height:60px;
            padding-left: 80px;
            border-left: 6px solid transparent;
            position: relative;
            text-align: left;
            &:hover{
                background:@dark-obg;
                border-left-color: @dark-obg;
            }
            &.active{
                background:@dark-obg;
                border-left-color: @im-green;
                color: @white;
                i{
                    color: @im-green;
                }
            }
            &.child_active{
                color: @white;
                i{
                    color: @im-green;
                }
            }
            &.open{
                .icon-arrow_down{
                    .transform(rotate(180deg));
                }
            }
            
            .iconfont{
                position: absolute;
                font-size: @font-size1;
                left: 48px;
                top: 0;
            }
            .iconfont.icon-arrow_down{
                left: auto;
                width: 30px;
                right: 15px;
                color: @normal-grey3;
                text-align: center;
                font-size: @font-size3;
                .transition(transform, 0.3s, ease)
            }
        }
        .notread {
            width: 18px;
            height: 18px;
            background: #FF554F;
            color: #fff;
            font-size: 12px;
            position: absolute;
            right: 20px;
            display: inline-block;
            top: 50%;
            margin-top: -9px;
            text-align: center;
            line-height: 18px;
            border-radius: 50%;
            &.n_1{
                right: 46px;
            }
        }
    }
    .btnwp{
        position: absolute;
        bottom: 30px;
        left: 0;
        text-align: center;
        width: 100%;
        box-sizing: border-box;
        i{  
            cursor: pointer;
            color: @dark-ic;
            font-size: @font-size2;
            &+i{
                margin-left: 30px;
            }
        }
    }
}
</style>

