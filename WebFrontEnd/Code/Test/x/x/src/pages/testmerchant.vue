<template>

    <div class="testmerchant">
        <div class="title">
            <div class="cont">填写测试商户号</div>
        </div>
        <div class="body">
            <div class="cont" v-loading="getloading" v-if="form">
                <div class="flex">
                    <label class="com-label">应用名称</label>
                    <div class="com-value">{{form.PApplyFullName}}</div>
                </div>
                <div class="flex line">
                    <label class="com-label">商户名</label>
                    <div class="com-value">{{form.PMerchantName}}</div>
                </div>
                <div class="flex line">
                    <label class="com-label">商户类别</label>
                    <div class="com-value">{{form.PMerchantType}}</div>
                </div>
                <div class="flex line">
                    <label class="com-label">申请人</label>
                    <div class="com-value">{{form.PUserName}}</div>
                </div>
                <div class="flex line">
                    <label class="com-label">申请人分行</label>
                    <div class="com-value">{{form.PUserBranch}}</div>
                </div>
                <div class="flex line">
                    <label class="com-label">调用接口</label>
                    <div class="com-value">{{form.MCallInterface && form.MCallInterface.replace(/(^\[)|(\]$)/g,'').replace(/"/g,'').replace(/,/g,'/') || ''}}</div>
                </div>
                <div class="flex line">
                    <label class="com-label">测试地址</label>
                    <div class="com-value">{{form.MTestUrl}}</div>
                </div>
                <div class="flex line">
                    <label class="com-label">是否申请一网通支付</label>
                    <div class="com-value">{{form.MIsNetcomPayment? '是':'否'}}</div>
                </div>
                <div class="flex line">
                    <label class="com-label">是否默认topbar</label>
                    <div class="com-value">{{form.STopbar? '是':'否'}}</div>
                </div>
                <div class="flex line1">
                    <label class="com-label">测试商户号</label>
                    <input class="com-txt flex-1" :class="{err:this.err.TTestMerchantNo}" v-model="form.TTestMerchantNo">
                </div>
                <div class="flex line2">
                    <label class="com-label">测试秘钥</label>
                    <input class="com-txt flex-1" :class="{err:this.err.TTestMerchantPw}" v-model="form.TTestMerchantPw">
                </div>
                <div class="flex line2">
                    <label class="com-label">补充说明</label>
                    <textarea class="com-textarea flex-1" :class="{err:this.err.TTestMerchantInfo}"  v-model="form.TTestMerchantInfo"></textarea>
                </div>
                <div class="flex line2">
                    <label class="com-label"></label>
                    <div v-loading="sendloading"><button class="btn size1 green" @click="submitInfo">提交</button></div>
                </div>
            </div>
            <div class="cont" v-if="!form">
                <div class="notform" >没有需要填写测试商户号的小程序</div>
            </div>
            
        </div>
    </div>
</template>
<script>
import util from '../assets/js/util.js';
const Util = util.Util;
const Identity = util.Identity;
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
    name: 'testmerchant',
    data(){
        return {
            // form: {
            //     Id: '',
            //     PApplyFullName: '',//应用名称
            //     PMerchantName: '', //商户名
            //     PMerchantType: '', //商户类别
            //     PUserName: '',  //申请人
            //     PUserBranch: '',//申请人分行或机构
            //     MCallInterface: '', //调用接口
            //     MTestUrl: '', //测试地址
            //     MIsNetcomPayment: '', //是否一网通
            //     STopbar: '', //使用默认导航栏
            //     TTestMerchantNo: '', // 测试商户号
            //     TTestMerchantPw: '', //测试秘钥
            //     TTestMerchantInfo: '' // 测试补充说明
            // },
            form: null,
            err: {},
            list:[], // 待填写的小程序列表
            getloading: false, // 获取数据等待
            sendloading: false
        }
    },
    methods: {
        ...mapActions('comcont', [
            'APIApprove',
            'APIGetWaitProDetail'
        ]),
        /**
         * 验证表单
         */
        varify(){
            this.err = {};
            if(!this.form.TTestMerchantNo){
                Util.showMsg('请填写测试商户号','error')
                this.err['TTestMerchantNo'] = true;
                return false;
            }else if(!this.form.TTestMerchantPw){
                Util.showMsg('请填写测试秘钥','error')
                this.err['TTestMerchantPw'] = true;
                return false;
            }else if(!this.form.TTestMerchantInfo){
                Util.showMsg('请填写测试补充说明','error')
                this.err['TTestMerchantInfo'] = true;
                return false;
            }
            if(this.form.TTestMerchantPw.length!=8){
                Util.showMsg('请填写测试补充说明','error')
                this.err['TTestMerchantPw'] = true;
                return false;
            }
            return true;
        },
        /**
         * 提交表单
         */
        submitInfo(){
            if(this.varify()){
                
                let str = Identity.getIdUserStr();
                if(!str){
                    return;
                }
                let temp = {
                    Id: this.form.Id,
                    TTestMerchantNo: this.form.TTestMerchantNo,
                    TTestMerchantPw: this.form.TTestMerchantPw,
                    TTestMerchantInfo: this.form.TTestMerchantInfo,
                    CurrStateNo: 24
                }
                this.sendloading = true;
                this.APIApprove({
                    MiniProgram: JSON.stringify(temp),
                    CurUser: str
                }).then(res => {
                    this.sendloading = false;
                    Util.showMsg('提交成功', 'success')
                    this.setFormData();
                }).catch(err => {
                    this.sendloading = false;
                    if(err.Message){
                        Util.showMsg(err.Message,'error');
                    }else{
                        Util.showMsg('提交失败，请刷新重试', 'error')
                    }
                })
            }
        },
        /**
         * 获取待填写的小程序
         */
        getPro(){
            this.getloading = true;
            let Id = this.$route.query.Id;
            this.APIGetWaitProDetail().then(data => {
                let temp = [];
                if(Id){
                    for(var i=0;i<data.length;i++){
                        if(data[i].Id == Id){
                            temp.push(data[i])
                            break;
                        }
                    }
                }else{
                    for(var j=0;j<data.length;j++){
                        temp.push(data[j])
                    }
                }
                this.list = temp;
                this.getloading = false;
                this.setFormData();
            }).catch(err => {
                this.getloading = false;
                Util.handleError(err)
            })
        },
        setFormData(){
            if(this.list && this.list.length){
                let obj = this.list.shift();
                obj.TTestMerchantPw = 'cmbtest1'
                this.form = obj;
            }else{
                this.form = null;
            }
        },
    },
    computed:{
        ...mapState('identity',{
            ticket: state => state.TICKET
        })
    },
    watch:{
        ticket(val){
            if(val){
                this.getPro();
            }
        }
    },
    mounted(){
        this.getPro();
    }
}
</script>
<style lang="less" scoped>
.testmerchant{
    padding-top: 100px;
    box-sizing: border-box;
    min-height: 100vh;
    background: @light-bg;
    .title{
        height: 70px;
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        background: @white;
        .cont{
            width: 98%;
            max-width: 1200px;
            font-size:@font-size2;
            font-weight:400;
            color:@im-grey;
            line-height:70px;
            margin: 0 auto;
        }
    }
    .body{
        width: 98%;
        max-width: 1200px;
        margin: 0 auto;
        box-sizing: border-box;
        min-height: calc(100vh - 140px);
        background: @white;
        .cont{
            
            padding: 50px 16.5%;
        }
        .com-label{
            width: 9em;
        }
        .line{
            margin-top: 5px;
        }
        .line2{
            margin-top: 30px;
        }
        .line1{
            margin-top: 15px;
        }
    }
    .notform{
        padding: 100px 0;
        color: @normal-grey3;
        font-size: @font-size2;
        text-align: center;
    }
}
</style>


