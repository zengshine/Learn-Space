<template>
    <div class="detail-msglist">
        <div class="tabwp">
            <div v-for="(item, key) in tabs" class="tab" :class="{active:activetype==item.key}" :key="key" @click="activetype=item.key">{{item.name}}</div>
        </div>
        <template v-for="(arr, key) in boxlist">
            <div class="msgwp" :key="key" v-show="key == activetype">
                <template v-for="(item, index) in arr">
                    <div class="msg"  :key="index">
                        <div class="title">{{item.name}}</div>
                        <div class="des" v-if="item.txt">{{item.txt}}</div>
                        <div class="des" v-if="item.callarr">
                            <template v-for="(subitem, subkey) in item.callarr">
                                <div :key="subkey">{{subitem}}</div>
                            </template>
                        </div>
                        <div class="des" v-if="item.entryarr">
                            <template v-for="(subitem, subkey) in item.entryarr">
                                <div :key="subkey">{{entrys[subitem]}}</div>
                            </template>
                        </div>
                        <div class="des" v-if="item.linkarr">
                            <template v-for="(subitem, subkey) in item.linkarr">
                                <div :key="subkey"><a :href="subitem.href">{{subitem.name}}</a></div>
                            </template>
                        </div>
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>
<script>
import util from './../../assets/js/util.js'
const Util = util.Util;
import { mapState , mapActions} from 'vuex'
export default {
    name: 'detailmsglist',
    computed: {
        ...mapState('comcont', {
            detailobj: state => state.detailobj,
            attachment: state => state.attachment
        })
    },
    data(){
        return {
            tabs:[{
                key:'base',
                name: '小程序基本信息'
            },{
                key:'coop',
                name: '支付合作商信息'
            },{
                key:'test',
                name: '测试参数信息'
            },{
                key:'prod',
                name: '生产参数信息'
            }],
            activetype:'base',
            msgboxes: {
                base: {
                    PMerchantName: '商户名',
                    PBranchName: '开发分行或机构',
                    PMerchantType: '商户类别',
                    PUserBranch: '申请人分行或机构',
                    PBranchDept: '总行所属部门',
                    Sort: '小程序分类',
                    F_O_S: '小程序标签', //FirstLabel,OtherLabel,SelfLabel
                    PUserName: '申请人',
                    PUserNo: '申请人ID',
                    PUserBranch: '申请人分行',
                    SDocumentId: '需求文档',//link
                    SAttach: '其它附件'//link
                },
                coop: {
                    IsPayBusiness: '支付合作商户信息',// 是/否
                    PayBusinessName: '支付合作商户全名',
                    PayBusinessShortName:'支付合作商户简称',
                    PayBusinessLicence: '支付合作商户营业执照号码',
                    BusinessMerchantNo: '商户一网通内场景支付商户号'
                },
                test: {
                    MTestUrl: '测试地址',
                    TTestMerchantNo: '测试商户号',
                    TTestMerchantPw: '测试商户秘钥',
                    TTestMerchantInfo: '测试秘钥补充说明',
                    TTestAccount: '测试账号',
                    TDemoUrl: '演示地址',
                    testCases: '测试用例'
                },
                prod: {
                    MIsNetcomPayment: '一网通支付',  // 是/否
                    STopbar: '使用默认导航栏(TopBar)',// 是/否
                    MCallInterface: '调用接口',  // arr
                    RMerchantNo: '正式商户号',
                    RMerchantPw: '正式商户秘钥',
                    SDesc: '应用描述',
                    RApplyHome: '小程序页面链接', //link
                    MIsAllowAllBank: '全行通用且展示在热门小程序',// 是/否
                    RIsShowHome: '展示在首页宫格及小程序专区',// 展示/不展示
                    SDesc: '应用描述',
                    MApplyEntryType: '申请入口' //arr
                }
            },
            boxlist: {},
            entrys: {} // 入口选项
        }
    },
    watch: {
        detailobj(obj){
            // this.setList(obj);
            this.setBoxMsgLisg(obj)
        }
    },
    methods: {
        ...mapActions('comcont', [
            'APIGetParams'
        ]),
        /**
         * 配置入口选项
         * @return {Array}
         */
        getEntrys(){
            this.APIGetParams(2001).then(arr => {
                for(let i = 0, len = arr.length; i < len; i++){
                    let item = arr[i];
                    this.entrys[item.RealValue] = item.ShowName
                }
            }).catch(err => {
                Util.handleError(err)
            })
        },
        /**
         * 配置列表信息
         * @param {Object} 小程序详细信息
         */
        setBoxMsgLisg(obj){
            if(!obj || !obj.Id){
                return;
            }
            
            for(let key in this.msgboxes){ // key == base|coop|test|prod
                let temparr = []
                let tempobj = this.msgboxes[key];
                for(let tempk in tempobj){
                    let item = {
                        name: tempobj[tempk]
                    }
                    if(/^((IsPayBusiness)|(MIsNetcomPayment)|(STopbar)|(MIsAllowAllBank))$/.test(tempk)){
                        item.txt = obj[tempk] && '是' || '否'
                    }else if(tempk == 'RIsShowHome'){
                        item.txt = obj[tempk] && '展示' || '不展示'
                    }else if(tempk == 'MCallInterface'){    
                        //调用接口数组
                        item.callarr = [];
                        try{
                            item.callarr = JSON.parse(obj[tempk])
                        }catch(e){
                            item.callarr = [obj[tempk]]
                        }
                    }else if(tempk == 'MApplyEntryType'){
                        // 申请入口 数组
                        item.entryarr = obj[tempk] &&  obj[tempk].split(',') || []
                    }else if(/^((SDocumentId)|(SAttach)|(testCases))$/.test(tempk)){
                        // 方案附件 和测试用例数组
                        let files = this.attachment[tempk]
                        item.linkarr = files && files.map(subitem => {
                            return {
                                name: subitem.ShowName,
                                href: util.BASEURL + '/api/files?id=' + subitem.Id
                            }
                        }) || []
                    }else{
                        item.txt = obj[tempk];
                    }
                    temparr.push(item);
                }
                // 如果不是4的倍数，则补齐，为了虚线
                let num = temparr.length % 4;
                num = 4 - num;
                if(num != 4 && temparr.length > 4){
                    for(let i = 0; i < num; i++){
                        temparr.push({name:'', txt: ''})
                    }
                }
                this.$set(this.boxlist, key, temparr);
            }
        },
        /**
         * 配置列表信息
         * @param {Object} 小程序详细信息
         */
        setList(obj){
            if(!obj || !obj.Id){
                return;
            }
            let tempobj = {};
            let str = ''+ obj.CurrStateNo;
            if(/^1/.test(str)){
                tempobj = {...this.obj_11};
                if(obj.PBranchNo != 999){
                    delete tempobj['PBranchDept']
                }
            }else if(str == '21' || str == '23'){
                tempobj = {...this.obj_11, ...this.obj_21};
            }else if(str == '22'){
                tempobj = {...this.obj_11, ...this.obj_21, ...this.obj_22};
            }else if(str == '24'){
                tempobj = {...this.obj_11, ...this.obj_21, ...this.obj_22, ...this.obj_24};
            }else if(/^3/.test(str)){
                tempobj = {...this.obj_11, ...this.obj_21, ...this.obj_22, ...this.obj_24, ...this.obj_31};
            }else if(/^4/.test(str)){
                tempobj = {...this.obj_11, ...this.obj_21, ...this.obj_22, ...this.obj_24, ...this.obj_31, ...this.obj_41};
            }else if(/^5/.test(str)){
                tempobj = {...this.obj_11, ...this.obj_21, ...this.obj_22, ...this.obj_24, ...this.obj_31, ...this.obj_41, ...this.obj_51};
            }
            let temparr = []
            
            for(let key in tempobj){
                let item = {
                    name: tempobj[key]
                }
                if(/^((MIsNetcomPayment)|(STopbar)|(MIsAllowAllBank))$/.test(key)){
                    item.txt = obj[key] && '是' || '否'
                }else if(key == 'RIsSearch'){
                    item.txt = obj[key] && '可搜索' || '不可搜索'
                }else if(key == 'RIsShowHome'){
                    item.txt = obj[key] && '展示' || '不展示'
                }else if(key == 'MCallInterface'){    
                    //调用接口数组
                    item.callarr = [];
                    try{
                        item.callarr = JSON.parse(obj[key])
                    }catch(e){
                        item.callarr = [obj[key]]
                    }
                }else if(key == 'MApplyEntryType'){
                    // 申请入口 数组
                    item.entryarr = obj[key] &&  obj[key].split(',') || []
                }else if(/^((schemaAttachments)|(testCases))$/.test(key)){
                    // 方案附件 和测试用例数组
                    let files = this.attachment[key]
                    item.linkarr = files.map(subitem => {
                        return {
                            name: subitem.ShowName,
                            href: util.BASEURL + '/api/files?id=' + subitem.Id
                        }
                    })
                }else{
                    item.txt = obj[key];
                }
                temparr.push(item);
            }
            // 如果不是4的倍数，则补齐，为了虚线
            let num = temparr.length % 4;
            num = 4 - num;
            if(num != 4 && temparr.length > 4){
                for(let i = 0; i < num; i++){
                    temparr.push({name:'', txt: ''})
                }
            }
            this.list = temparr;
        }
    },
    mounted(){
        // this.obj_11 = {
        //     PMerchantName: '商户名',
        //     PBranchName: '分行名称或总行部门名称',
        //     PBranchNo: '所在分行或总行部门编号',
        //     PBranchDept: '总行所属部门',
        //     PMerchantType: '商户类别',
        //     PUserName: '申请人',
        //     PUserNo: '申请人ID',
        //     PUserBranch: '申请人分行',
        // };
        // this.obj_21 =  {
            // MTestUrl: '测试地址',
            // MIsNetcomPayment: '一网通支付',
            // STopbar: '使用默认导航栏(TopBar)',
            // MCallInterface: '调用接口',
        // };
        // this.obj_22 =  {
        //     RMerchantNo: '正式商户号',
        //     RMerchantPw: '正式商户秘钥',
        // };
        // this.obj_24 =  {
        //     TTestMerchantInfo: '测试秘钥补充说明',
        //     TTestMerchantNo: '测试商户号',
        //     TTestMerchantPw: '测试商户秘钥',
        // };
        this.obj_31 =  {
            // SDesc: '应用描述',
            schemaAttachments: '方案附件',
        };
        // this.obj_41 =  {
        //     TTestAccount: '测试账号',
        //     TDemoUrl: '演示地址',
        //     testCases: '测试用例',
        // };
        this.obj_51 =  {
            RIsSearch: '可被搜索',
            // MIsAllowAllBank: '全行通用且展示在热门小程序',
            // MApplyEntryType: '申请入口',
            // RIsShowHome: '展示在首页宫格及小程序专区',
            MTags: '分类标签',
            // RApplyHome: '小程序页面链接',
        };
        //配置入口选项
        this.getEntrys();
        //配置列表信息
        // this.setList(this.detailobj);
        this.setBoxMsgLisg(this.detailobj)
    }
}
</script>
<style lang="less" scoped>
.detail-msglist{
    
    .msgwp{
        .flex;
        flex-wrap: wrap;
    }
    .msg{
        width: 25%;
        box-sizing: border-box;
        padding: 26px 2%;
        text-align: center;
        &:nth-of-type(n+5){
            border-top: 1px dashed @border-color;
        }
        &:nth-of-type(4n+1){
            padding-left: 6%;
        }
        &:nth-of-type(4n+4){
            padding-right: 6%;
        }
    }
    .title{
        font-size: @font-size3;
        font-weight:400;
        color:@title-c;
        line-height:22px;
    }
    .des{
        font-size:@font-size4;
        font-weight:400;
        color:@normal-grey2;
        line-height:20px;
        margin-top: 10px;
    }
    .tabwp{
        .flex;
        width: 100%;
        .tab{
            box-sizing: border-box;
            width: 25%;
            border-top: 4px solid @light-bg-hover;
            background: @light-bg-hover;
            padding: 16px 2%;
            font-size: @font-size18;
            font-weight: bold;
            text-align: center;
            color: @im-grey;
            cursor: pointer;
            &:nth-of-type(n+5){
                border-top: 1px dashed @border-color;
            }
            &:nth-of-type(4n+1){
                padding-left: 6%;
            }
            &:nth-of-type(4n+4){
                padding-right: 6%;
            }
            .transition(background, 0.3s, ease);
            &.active{
                background: @white;
                border-color: @im-green;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
                color: @im-green;
            }
        }
        &:after{
            content:'';
            clear: both;
        }
    }
}
</style>


