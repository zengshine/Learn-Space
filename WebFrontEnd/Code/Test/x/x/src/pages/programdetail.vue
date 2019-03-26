<template>
    <div>
        <headtop  v-show="!showedit" :txt="headconfs.txt" :showback="headconfs.showback" @clickback="clickback"></headtop>
        <div  v-show="!showedit" class="programdetail"  element-loading-background="rgba(0, 0, 0, 0.0)" v-if="$route.query.id">
            <div class="whitbg" v-loading="detailloading">
                <basemsg :menukey="menukey" @delete="clickback" @edit="editPro" @resubmit="showedit = true"></basemsg>
            </div>
            <div class="whitbg" v-loading="detailloading">
                <msglist></msglist>
            </div>
            <div class="whitbg">
                <recordlists></recordlists>
            </div>
        </div>
        <newprogram v-show="showedit" :showit="showedit" @goback="showedit = false" @change="changeDetail" ></newprogram>
        <div class="emptydetail" v-if="!$route.query.id">小程序不存在，请回退选择一个小程序进入</div>
    </div>
</template>
<script>
import newprogram from '../components/com/newprogram.vue'
import headtop from './../components/headers/header_top.vue'
import msglist from './../components/programdetail/msglist.vue'
import basemsg from './../components/programdetail/basemsg.vue'
import recordlists from './../components/programdetail/recordlists.vue'
import util from './../assets/js/util.js'
const Util = util.Util;
import { mapState , mapMutations, mapActions} from 'vuex'
export default {
    name: 'programdetail',
    data(){
        return {
            headconfs: {
                txt: '小程序详情',
                showback: true
            },
            menukey: this.MENU.m_mypro.key, // mypro 我的小程序详情 promanage 小程序管理详情
            detailloading: false,
            showedit: false, // 是否显示小程序详情而不是修改页面
        }
    },
    
    methods: {
        ...mapMutations('comcont',[
            'setDetailObj',
            'setDetailAttach'
        ]),
        ...mapActions('comcont', [
            'APIGetProDetail'
        ]),

        /**
         * 返回上一级
         */
        clickback(){
            if(window.history.length > 1){
                this.$router.go(-1)
            }else if(this.menukey ==  this.MENU.m_promanger.key){
                this.$router.replace(this.pathObj.p_promanger)
            }else{
                this.$router.replace(this.pathObj.p_mypro)
            }
        },
        /**
         * 显示修改对话框
         */
        editPro(){
        },
        
        /**
         * 获取小程序详情
         */
        getDetail(){
            let id = this.$route.query.id;
            if(!id || this.$route.path != this.pathObj.p_prodetail){
                return;
            }
            this.menukey = this.$route.query.key == this.MENU.m_promanger.key? this.MENU.m_promanger.key : this.MENU.m_mypro.key
            this.detailloading = true;
            this.APIGetProDetail(id).then(data => {
                let temp = data.MPItem || {};
                    let attach = data.MPAttachments && data.MPAttachments[temp.Id] || {}
                    this.detailloading = false;
                    this.setDetailObj(temp)
                    this.setDetailAttach(attach)
            }).catch(err => {
                this.detailloading = false;
                Util.handleError(err)
            })
        },
        changeDetail(obj){
            this.setDetailObj(obj)
            this.showedit = false;
        },
        initData(){
            this.getDetail();
        }
        
    },
    components: {
        headtop,
        msglist,
        basemsg,
        recordlists,
        newprogram
    },
    watch: {
        ticket(val){
            if(val){
                this.initData();
            }
        }
    },
    computed:{
        ...mapState('identity',{
            ticket: state => state.TICKET
        })
    },
    mounted(){
        this.initData();
    },
    beforeDestroy(){
        this.setDetailObj({})
        this.setDetailAttach({})
    }
}
</script>
<style lang="less" scoped>
.programdetail{
    margin: @con-margin;
    .whitbg{
        background: @white;
        border-radius: 4px;
        &+.whitbg{
            margin-top: 10px;
        }
    }
}
.emptydetail{
    text-align: center;
    font-size:@font-size1;
    color: @normal-grey4;
    padding: 150px;
}
</style>


