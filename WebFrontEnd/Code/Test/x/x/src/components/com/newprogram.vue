<template>
    <div>
        <headtop :txt="headtxt" ></headtop>
        <form action=""  class="newprogram">
            <div class="formrow">
                <label class="com-label"><span class="star">*</span>应用名称</label>
                <div class="txtwp">
                    <input type="text" class="com-txt" :class="{err:err.PApplyFullName}" v-model="form.PApplyFullName" placeholder="请输入应用名称">
                    <div class="com-tip">展示给客户看,简单易懂,6个字以内。如仅限本地区使用，应在名称中体现地区，如“北京交通罚没”</div>
                </div>
                
            </div>
            <div class="formrow">
                <label class="com-label">名称首字母</label>
                <div class="txtwp">
                    <input type="text" class="com-txt" v-model="form.PApplyFirstName" disabled>
                    <div class="com-tip">名称每个字的首字母小写。如“北京交通罚没”写“bjjtfm”</div>
                </div>
            </div>
            <div class="formrow">
                <label class="com-label"><span class="star">*</span>商户名</label>
                <div class="txtwp">
                    <input type="text" class="com-txt" :class="{err:err.PMerchantName}" v-model="form.PMerchantName" placeholder="请输入商户名">
                    <div class="com-tip">如果是分行自行开发,填写分行名;如果是外部商户开发,填写商户名称</div>
                </div>
            </div>
            <div class="formrow">
                <label class="com-label"><span class="star">*</span>分行名称或总行部门名称</label>
                <div class="txtwp" v-loading="pbranchloading">
                <el-select v-model="pbranchno" placeholder="请选择部门名称" class="com-elsel" :class="{err:err.PBranchNo}">
                    <el-option v-for="item in pbranchlist" :key="item.Id" :label="item.ShowName" :value="item.Id"> </el-option>
                </el-select>
                </div>
            </div>
            <div class="formrow" v-if="pbranchno == 900999" >
                <label class="com-label"><span class="star">*</span>所在总行部门名称</label>
                <div class="txtwp"><input type="text" class="com-txt" v-model="form.PBranchDept"  :class="{err:err.PBranchDept}" placeholder="请输入所在总行部门名称"></div>
            </div>
            <div class="formrow">
                <label class="com-label"><span class="star">*</span>商户类别</label>
                <div class="txtwp">
                <el-select v-model="form.PMerchantType" placeholder="请选择商户类别" class="com-elsel" :class="{err:err.PMerchantType}" >
                    <el-option v-for="item in options" :key="item" :label="item" :value="item"> </el-option>
                </el-select>
                <div class="com-tip">行内：分行自行开发，可以传送客户信息；行外：外部商户开发，不传送客户信息，如要传送手机号，需要单独申请</div>
                </div>
            </div>
            <div class="formrow">
                <label class="com-label">申请人</label>
                <div class="txtwp"><input type="text" class="com-txt" disabled :value="form.PUserName"></div>
            </div>
            <div class="formrow">
                <label class="com-label">申请人ID</label>
                <div class="txtwp"><input type="text" class="com-txt" disabled :value="form.PUserNo"></div>
            </div>
            <div class="formrow">
                <label class="com-label">申请人分行或机构</label>
                <div class="txtwp"><input type="text" class="com-txt" disabled :value="form.PUserBranch"></div>
            </div>
            <div class="formrow">
                <label class="com-label"><span class="star">*</span>方案或需求介绍</label>
                <div class="txtwp">
                    <textarea name="" id="" cols="30" rows="10" class="com-textarea" :class="{err:err.PDesc}" v-model="form.PDesc" placeholder="请输入方案或需求介绍"></textarea>
                    <div class="com-tip">介绍本小程序需求的申请背景、基本功能、适用客户群体和场景</div>
                </div>
            </div>
            <div class="formrow" v-if="form.CurrStateNo == 13">
                <label class="com-label">修改说明</label>
                <div class="txtwp">
                    <textarea name="" id="" cols="30" rows="10" class="com-textarea" v-model="form.PChangeInfo"  placeholder="请输入修改说明"></textarea>
                    <div class="com-tip">介绍本小程序需求的申请背景、基本功能、适用客户群体和场景</div>
                </div>
            </div>
            <div class="btnwp" v-loading="submitloading">
                <button class="btn size1 green" @click="submitapply">提交申请</button>
                <button class="btn size1 grey" @click="closeadd">取消</button>
            </div>
        </form>
    </div>
</template>
<script>
import PinYin from '../../assets/js/pinyin.js'
import headtop from '../../components/headers/header_top.vue'
import util from '../../assets/js/util.js'
const Util = util.Util
const Identity = util.Identity

import { mapState , mapMutations, mapActions} from 'vuex'
export default {
    name: 'newprogram',
    data(){
        return {
            headtxt: '新小程序申请',
            options:['行内商户','行外商户','行外+手机号'],
            form: {
                Id: '',
                PApplyFullName: '',  //中文名
                PApplyFirstName: '',  // 中文首字符
                PMerchantName: '', //商户名
                PBranchNo: '', // 分行总行部分id
                PBranchName: '', //分行总行部门名称
                PBranchDept:'', // 选总行时候的名称
                PMerchantType: '', //商户类别
                PUserName: '',  //申请人
                PUserNo: '', //申请人ID
                PUserBranch: '',//申请人分行或机构
                PDesc: '',//方案或需求介绍
                PChangeInfo: '', // 修改说明
                CurrStateNo: '', // 当前申请状态 编号（进入状态： 0：新增, 13:立项不通过）（保存：11：立项申请中）
                CurrStateName: '', 
            },
            pbranchno: '',
            pbranchlist:[], //分行总行部门名称列表
            pbranchloading: false, // 获取分行总行部门名称列表数据等待
            err: {}, // 是不能提交申请的错误项
            submitloading: false
        }
    },
    computed: {
        ...mapState('comcont', {
            detailobj: state => state.detailobj
        })
    },
    methods: {
        ...mapActions('comcont', [
            'APIApprove',
            'APIGetParams'
        ]),
        /**
         * 获取发送的信息
         * @return {Object}
         */
        getSendObj(){
            let temp = {}
            for(let key in this.form){
                let originstr = this.form[key]
                if(Object.prototype.toString.call(originstr) == '[object String]'){
                    let str = originstr.replace(/(^\s+)|(\s+$)/g,'');
                    if(originstr != str){
                        this.$set(this.form, key, str);
                    }
                    temp[key] = str;
                }else{
                    temp[key] = originstr;
                }
            }
            temp['CurrStateNo'] = 11;
            temp['CurrStateName'] = this.StateConf[11];
            temp['IsAdminUpdate'] = true;
            if(!temp.Id){
                delete temp.Id
            }
            return temp;
        },
        /**
         * 根据分行总行id 设置 name和no
         */
        setPBranchMsg(){
            for(let i = 0, len = this.pbranchlist.length; i < len; i++){
                let item = this.pbranchlist[i];
                if(item.Id == this.pbranchno){
                    this.$set(this.form, 'PBranchNo', this.pbranchno - 900000);
                    this.$set(this.form, 'PBranchName', item.ShowName)
                    return;
                }
            }
        },
        /**
         * 判断是否符合传递要求
         */
        varify(){ 
            this.err = {};
            for(let key in this.form){
                if(key == 'PChangeInfo' || key == 'Id' || key == 'CurrStateNo' || key == 'CurrStateName'){
                    continue;
                }else if(!this.form[key] && (key != 'PBranchDept' || key == 'PBranchDept' && this.pbranchno == 900999)){
                    Util.showMsg('表单必填项不可留空！')
                    this.err[key] = true;
                    return false;
                }
            }
            if(this.form.PDesc.length < 100){
                Util.showMsg('方案或需求介绍不可以小于100个字！')
                this.err['PDesc'] = true;
                return false;
            }
            if(this.form['PApplyFullName'].length > 6){
                Util.showMsg('应用名称不可以大于6个字！')
                this.err['PApplyFullName'] = true;
                return false;
            }
            return true;
        },
        /**
         * 点击提交申请按钮
         */
        submitapply(e){
            e.preventDefault();
            
            let str = Identity.getIdUserStr();
            if(!str){
                return;
            }
            this.setPBranchMsg();//根据分行总行id 设置 name 和no
            if(this.varify()){
                let obj = this.getSendObj();
                this.submitloading = true;
                this.APIApprove({
                    MiniProgram: JSON.stringify(obj),
                    CurUser: str
                }).then(res => {
                    this.submitloading = false
                    Util.showMsg('申请成功', 'success')
                    this.$emit('change', res);
                }).catch(err => {
                    this.submitloading = false
                    if(err.Message){
                        Util.showMsg(err.Message,'error');
                    }else{
                        Util.showMsg('提交失败，请刷新重试', 'error')
                    }
                })
            }
        },
        
        /**
         * 点击取消按钮，回到我的
         */
        closeadd(e){
            if(e){
                e.preventDefault();
            }
            this.$emit('goback')
        },
        /**
         * 根据传入的小程序详细信息设置初始form
         */
        setInitForm(){
            let temp = this.detailobj || {}
            let tempobj = {};
            for(let key in this.form){
                tempobj[key] = temp[key] || ''
            }
            tempobj['PUserName'] = this.CurUser.NAME || '';
            tempobj['PUserNo'] = this.CurUser.USID || '';
            tempobj['PUserBranch'] = this.CurUser.PATH || '';
            this.pbranchno =tempobj.PBranchNo? Number(tempobj.PBranchNo) + 900000 : '';
            this.form = tempobj;
            if(tempobj.Id){
                this.headtxt = '重新提交小程序'
            }
        },
        getApartList(){
            this.pbranchloading = true;
            this.APIGetParams(9000).then(data => {
                this.pbranchloading = false;
                this.pbranchlist = data;
            }).catch(err => {
                this.pbranchloading = false;
                Util.handleError(err)
            })
        }
    },
    components: {
        headtop
    },
    watch: {
        'form.PApplyFullName'(val){
            this.$set(this.form, 'PApplyFirstName', PinYin.getFirstCharacter(val, "", false))
        },
        detailobj(){
            this.setInitForm();
        },
        showit(val){
            if(val){
                this.CurUser = Identity.getIdCurUser();
                this.getApartList(); //获取总行分行部门名称选项数据
                this.setInitForm()
            }
        }
    },
    props: {
        showit:Boolean
    },
    mounted(){
        this.CurUser = Identity.getIdCurUser();
        if(this.CurUser){
            this.getApartList(); //获取总行分行部门名称选项数据
            this.setInitForm()
        }
    }
}
</script>

<style lang="less" scoped>
    .newprogram{
        background: @white;
        margin: @con-margin;
        padding: 40px;
        .formrow{
            .com-label{
                width: 12.5em;
            }
            .com-elsel{
                max-width: 650px;
            }
        }
        .btnwp{
            padding-left: 12.5em;
            margin-left: 10px;
            margin-top: 26px;
            .btn+.btn{
                margin-left: 20px;
            }
        }
    }
</style>

