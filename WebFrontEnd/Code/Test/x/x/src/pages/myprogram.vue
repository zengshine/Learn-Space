<template>
    <div>
        <template>
            <headtop  v-show="showpage" :txt="headconfs.txt" :icons="headconfs.icons" @clickbtn="addItem"></headtop>
            <div  v-show="showpage" class="programwp list-row" v-loading="listloading" element-loading-background="rgba(0, 0, 0, 0.0)">
                <template v-if="list && list.length" >
                    <div class="list-col" v-for="(item, index) in list" :key="index" >
                        <div class="item" @click="todetail(item, index)">
                            <img :src="item.img" class="itemimg">
                            <div class="itemname">{{item.name}}</div>
                            <div class="itemstatus"><comstate :state="item.statusno" :txt="item.status"></comstate></div>
                        </div>
                    </div>
                </template>
                <div class="list-col">
                    <div class="itemempty" @click="addItem">
                        <i class="iconfont icon-add2"></i>
                    </div>
                </div>
            </div>
        </template>
        <newprogram v-show="!showpage" :showit="!showpage" @goback="backToMypro" @change="changeList"></newprogram>
    </div>
</template>
<script>
import newprogram from '../components/com/newprogram.vue'
import comstate from '../components/com/state.vue'
import headtop from '../components/headers/header_top.vue'
import defaultimg from './../assets/images/Image1.png'
import util from '../assets/js/util.js'
const Util = util.Util;
const Identity = util.Identity;
import { mapState, mapActions} from 'vuex'
export default {
    name: 'myprogram',
    data(){
        return {
            headconfs: {
                txt: '我的小程序',
                icons: [{icon:'icon-add1',emitname:'clickbtn'}]
            },
            showpage: true, // 是否显示我的小程序而不是新增页面
            list: [],
            imglist: [], // 对应每个小程序的图片
            listloading: false,
            originlist: []// 获取到的列表
        }
    },
    methods: {
        ...mapActions('comcont', [
            'APIGetProList'
        ]),
        /**
         * 到小程序详情页面
         */
        todetail(item, index){
            this.$router.push({path:this.pathObj.p_prodetail, query:{id:item.id, key:this.MENU.m_mypro.key}})
        },
        /**
         * 添加我的小程序
         */
        addItem(){
            this.showpage = false;
        },
        changeList(item){
            this.list.push({
                id: item.Id,
                status: item.CurrStateName,
                statusno: item.CurrStateNo,
                name: item.PApplyFullName,
                img: defaultimg
            })
            this.backToMypro();
        },
        /**
         * 回到我的小程序列表页面
         */
        backToMypro(form){
            this.showpage = true;
        },
        getList(){
            let self = this;
            
            let CurUser = Identity.getIdCurUser();
            if(!CurUser){
                return;
            }
            this.listloading = true;
            this.APIGetProList({
                type: 0,
            }).then(data => {
                this.MPAttachments = data.MPAttachments;
                let MPList = data.MPList || [];
                let MPAttachments = data.MPAttachments || {}
                let arr = [];
                this.imglist = [];
                for(let i = 0, len = MPList.length; i < len; i++){
                    let item = MPList[i];
                    let src = ''
                    let attach = MPAttachments[item.id];
                    let id = attach && attach.icon2 && attach.icon2.id || attach && attach.icon && attach.icon.id || 0;
                    if(id){
                        src = this.BASEURL + '/api/files?id=' + id
                    }
                    arr.push({
                        id: item.Id,
                        status: item.CurrStateName,
                        statusno: item.CurrStateNo,
                        name: item.PApplyFullName,
                        img: src || defaultimg
                    })
                }
                this.originlist = MPList;
                this.list = arr;
                this.listloading = false;
            }).catch(err => {
                this.listloading = false;
                Util.handleError(err)
            })
            // get({
            //     url: "/api/miniprogram?userId=" + CurUser.USID + '&type=0',
            
        }
    },
    computed:{
        ...mapState('identity',{
            ticket: state => state.TICKET
        })
    },
    components: {
        headtop,
        comstate,
        newprogram
    },
    watch:{
        ticket(val){
            if(val){
                this.getList();
            }
        }
    },
    mounted(){
        this.getList();
    }
}
</script>
<style lang="less" scoped>
.programwp{
    margin: @con-margin;
    .item{
        text-align: center;
        border-radius:4px;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 5px 1px rgba(31,82,81,0.04);
        border-radius:4px;
        height: 330px;
        box-sizing: border-box;
        overflow: hidden;
        cursor: pointer;
        .flex-center;
        .flex-v;
    }
    .itemempty{
        border: 1px solid @normal-grey4;
        height: 330px;
        line-height: 330px;
        text-align: center;
        padding: 0;
        box-sizing: border-box;
        cursor: pointer;
        .icon-add2{
            font-size: 60px;
            color: @normal-grey4;
        }
        &:hover{
            border-color: @im-red;
            .icon-add2{
                color: @im-red;
            }
        }
    }
    
    .itemimg{
        width: 50%;
        max-width: 130px;
    }
    .itemname{
        margin-top: 20px;
        margin-bottom: 16px;
        height: 20px;
        line-height: 20px;
        overflow: hidden;
        font-size:16px;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-weight:400;
        color:@im-grey;
    }
    .itemstatus{
        overflow: hidden;
        font-size:16px;
        text-overflow:ellipsis;
        white-space:nowrap;
        height: 20px;
        line-height: 20px;
        margin-bottom: 10px;;
        font-weight:400;
        color:@normal-grey1;
        &.red{
            color: @im-red;
        }
        &.blue{
            color: @im-blue;
        }
        &.green{
            color: @im-green;
        }
    }
}
@media (max-width: 980px){
    .programwp{
        .itemempty{
            height: 280px;
            line-height: 280px;
        }
        .item{
            height: 280px;
        }
    }
}
@media (min-width: 980px){
    .programwp{
        .itemempty{
            height: 280px;
            line-height: 280px;
        }
        .item{
            height: 280px;
        }
    }
}
@media (min-width: 1200px){
    .programwp{
        .itemempty{
            height: 300px;
            line-height: 300px;
        }
        .item{
            height: 300px;
        }
    }
}
@media (min-width: 1280px){
    .programwp{
        .itemempty{
            height: 280px;
            line-height: 280px;
        }
        .item{
            height: 280px;
        }
    }
}
@media (min-width: 1440px){
    .programwp{
        .itemempty{
            height: 300px;
            line-height: 300px;
        }
        .item{
            height: 300px;
            
        }
    }
}

@media (min-width: 1560px){
    .programwp{
        .itemempty{
            height: 330px;
            line-height: 330px;
        }
        .item{
            height: 330px;
        }
    }
}
</style>


