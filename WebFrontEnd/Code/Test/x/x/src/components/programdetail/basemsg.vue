<template>
    <div class="detail-basemsg">
        <div class="left"><img :src="img" alt=""></div>
        <div class="ml152">
            <div><span class="name" v-if="detailobj.PApplyFirstName">{{detailobj.PApplyFullName}} ({{detailobj.PApplyFirstName}})</span>
            <comstate class="state" :txt="detailobj.CurrStateName" :state="detailobj.CurrStateNo"></comstate>
            <span class="icon-btnwp" v-if="menukey == MENU.m_promanger.key">
                <i class="iconfont icon-edit" @click ="editPro"></i>
                <i class="iconfont icon-delete" @click="deletePro"></i>
            </span>
            </div>

            <div class="path">{{detailobj.PUserBranch}}</div>
            <div class="type">{{detailobj.PMerchantType}}</div>
            <div class="des" v-if="detailobj.PDesc"><span  v-if="changeinfo">方案或需求介绍: </span>{{detailobj.PDesc}}</div>
            <div class="des" v-if="changeinfo">修改说明: {{changeinfo}}</div>
            <div class="btnwp" v-if="menukey == MENU.m_promanger.key">
                <button class="btn size4 green" v-if="/^((11)|(21)|(31)|(41)|(51))$/.test(detailobj.CurrStateNo + '')" @click="coopApply('agree')">同意申请</button>
                <button class="btn size4 red" v-if="/^((11)|(21)|(31)|(41)|(51))$/.test(detailobj.CurrStateNo + '')" @click="coopApply('reject')">拒绝申请</button>
                <button class="btn size4 blue" v-if="/^((11)|(21)|(31)|(41)|(51))$/.test(detailobj.CurrStateNo + '')">转发</button>
            </div>
            <div class="btnwp" v-else>
                <button class="btn size4 green" v-if="detailobj.CurrStateNo == 13" @click="reSubmit">重新提交</button>
                <button class="btn size4 green" v-if="/^((12)|(23))$/.test(detailobj.CurrStateNo + '')" @click="openApply2">{{detailobj.CurrStateNo == 12? '申请商户号':'重新提交'}}</button>
                <button class="btn size4 green" v-if="/^((24)|(33))$/.test(detailobj.CurrStateNo + '')" @click="apply3.visible = true">{{detailobj.CurrStateNo == 24? '提交方案':'重新提交'}}</button>
                <button class="btn size4 green" v-if="/^((32)|(43))$/.test(detailobj.CurrStateNo + '')" @click="apply4.visible = true">{{detailobj.CurrStateNo == 32? '提交测试':'重新提交'}}</button>
                <button class="btn size4 green" v-if="/^((42)|(53))$/.test(detailobj.CurrStateNo + '')" @click="apply5.visible = true">{{detailobj.CurrStateNo == 42? '提交上线':'重新提交'}}</button>
            </div>
        </div>
        <!-- 立项申请中/商户号申请中/方案审核中 -->
        <dialogapply :type="apply.type" :visible="apply.visible" @closeit="closeApply"></dialogapply>
        <!-- 提交商户号申请 -->
        <dialogapply2  :visible="apply2.visible" @closeit="closeApply2"></dialogapply2>
        <!-- 提交方案 -->
        <dialogapply3  :visible="apply3.visible" @closeit="apply3.visible = false"></dialogapply3>
        <!-- 提交测试 -->
        <dialogapply4  :visible="apply4.visible" @closeit="apply4.visible = false"></dialogapply4>
        <!-- 提交上线 -->
        <dialogapply5  :visible="apply5.visible" @closeit="apply5.visible = false"></dialogapply5>
    </div>
</template>
<script>
import defaultimg from './../../assets/images/Image1.png'

import util from './../../assets/js/util.js'
const Util = util.Util;
import comstate from '../../components/com/state.vue'
import dialogapply from './dialog_apply.vue'
import dialogapply2 from './dialog_apply_2.vue'
import dialogapply3 from './dialog_apply_3.vue'
import dialogapply4 from './dialog_apply_4.vue'
import dialogapply5 from './dialog_apply_5.vue'
import { mapState , mapActions} from 'vuex'
export default {
    name: 'detailbasemsg',
    props: {
        menukey: String
    },
    data(){
        return {
            apply: { //操作申请(同意/拒绝)
                type: '',
                visible: false
            },
            apply2: { //商户号申请
                visible: false
            },
            apply3: { // 提交方案
                visible: false
            },
            apply4: {//提交测试
                visible: false
            },
            apply5: {//提交上线
                visible: false
            },
            img: defaultimg
        }
    },
    methods: {
        ...mapActions('comcont',[
            'APIDeletePro'
        ]),
        /**
         * 删除小程序
         */
        deletePro(){
            Util.showDeleteConfirm('小程序',()=>{
                this.APIDeletePro(this.detailobj.Id).then(data=>{
                    this.$emit('delete')
                }).catch(err=>{
                    Util.handleError(err);
                })
            })
        },
        /**
         * 编辑小程序
         */
        editPro(){
            this.$emit('edit')
        },
        /**
         * 关闭申请窗口
         */
        closeApply(){
            this.$set(this.apply, 'visible', false)
        },
        
        /**
         * 操作申请(同意/拒绝)
         * @param {String} type agree 同意， reject 拒绝， send 转发 
         */
        coopApply(type){
            this.apply = {
                type: type,
                visible: true
            }
        },
        /**
         * 打开商户号申请窗口
         */
        openApply2(){
            this.$set(this.apply2, 'visible', true)
        },
         /**
         * 关闭商户号申请窗口
         */
        closeApply2(){
            this.$set(this.apply2, 'visible', false)
        },
        /**
         * 操作申请(转发)
         * @param {String} type 
         */
        coopApply1(){
            this.apply1 = {
                tostate: state,
                visible: true
            }
        },
        /**
         * 点击重新提交
         */
        reSubmit(){
            this.$emit('resubmit')
        }
    },
    computed: {
        ...mapState('comcont', {
            detailobj: state => state.detailobj,
            attachment: state => state.attachment
        }),
        changeinfo(){
            let no = this.detailobj.CurrStateNo;
            let str = '';
            if (no == 11 || no == 12 || no == 13) {
                str = this.detailobj.PChangeInfo
            } else if (no == 21 || no == 22 || no == 23 || no == 24) {
                str = this.detailobj.MChangeInfo
            } else if (no == 31 || no == 32 || no == 33) {
                str = this.detailobj.SChangInfo
            } else if (no == 41 || no == 42 || no == 43) {
                str = this.detailobj.TChangeInfo
            } else if (no == 51 || no == 52 || no == 53 || no == 54) {
                str = this.detailobj.RChangeInfo
            }
            if(Object.prototype.toString.call(str) == '[object String]'){
                str = str.replace(/(^\s+)|(\s+$)/g,'')
            }
            return str;
        }
    },
    watch: {
        detailobj(){
            let attach = this.attachment;
            let id = attach && attach.icon2 && attach.icon2.id || attach && attach.icon && attach.icon.id || 0;
            let src = ''
            if(id){
                src = util.BASEURL + '/api/files?id=' + id
            }
            this.img = src || defaultimg;
        }
    },
    components: {
        comstate,
        dialogapply,
        dialogapply2,
        dialogapply3,
        dialogapply4,
        dialogapply5
    }
}
</script>
<style lang="less" scoped>
.detail-basemsg{
    padding: 40px;
    img{
        width: 130px;
        margin-right: 22px;
    }
    &>.left{
        float: left;
    }
    .ml152{
        margin-left: 152px;
    }
    .name{
        font-size:@font-size1;
        font-weight:400;
        color:@im-grey;
        line-height:30px;
        margin-right: 94px;
    }
    
    .icon-btnwp{
        margin-left: 94px;
        .iconfont{
            font-size: @font-size3;
            color: @normal-grey3;
            cursor: pointer;
            &:hover{
                color: @im-green;
            }
        }
        .iconfont+.iconfont{
            margin-left: 20px;
        }
        
    }
    .path{
        font-size:@font-size4;
        font-weight:400;
        color:@im-grey;
        line-height:20px;
        margin-top: 15px;
    }
    .type{
        font-size:@font-size4;
        font-weight:400;
        color:@im-grey;
        line-height:20px;
        margin-top: 4px;
    }
    .des{
        font-size:@font-size4;
        font-weight:400;
        color:@normal-grey3;
        line-height:20px;
        margin-top: 6px;
    }
    .btnwp{
        margin-top: 30px;
        .btn+.btn{
            margin-left: 10px;
        }
    }
    &:after{
        content: '';
        display: block;
        clear: both;
    }
}
</style>


