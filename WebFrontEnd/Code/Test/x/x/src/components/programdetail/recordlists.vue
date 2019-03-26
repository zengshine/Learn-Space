<template>
    <div class="detail-recordlist">
        <div class="chart">
            <div class="round" :class="{state1:stateobj.s1 == 1, state2:stateobj.s1 == 2}">立项申请</div>
            <i class="iconfont icon-arrow"></i>
            <div class="round" :class="{state1:stateobj.s2 == 1, state2:stateobj.s2 == 2}">商户号申请</div>
            <i class="iconfont icon-arrow"></i>
            <div class="round" :class="{state1:stateobj.s3 == 1, state2:stateobj.s3 == 2}">方案审核</div>
            <i class="iconfont icon-arrow"></i>
            <div class="round" :class="{state1:stateobj.s4 == 1, state2:stateobj.s4 == 2}">测试验收</div>
            <i class="iconfont icon-arrow"></i>
            <div class="round" :class="{state1:stateobj.s5 == 1, state2:stateobj.s5 == 2}">发布上线</div>
        </div>
        <div class="tb">
            <div class="title-line">
                <div class="col">时间</div>
                <div class="col">姓名</div>
                <div class="col">项目申请流程</div>
            </div>
            <div class="line" :class="'line'+key" v-for="(item, key) in records" :key="key">
                <div class="col">{{item.time}}</div>
                <div class="col">{{item.name}}</div>
                <div class="col">{{item.operation}}</div>
            </div>
            <div class="empty" v-show="!records.length" v-loading="recordsloading"><span v-show="!recordsloading" >暂无数据</span></div>
        </div>
    </div>
</template>
<script>
import util from './../../assets/js/util.js'
const Util = util.Util;
import { mapState, mapActions } from 'vuex'
export default {
    name: 'detailrecordlist',
    data(){
        return {
            records: [], //审批记录
            recordsloading: false,
            stateobj: { // 0 表示还未到该阶段，1表示处理中 ，2 表示处理完成
                s1: 0,
                s2: 0,
                s3: 0,
                s4: 0,
                s5: 0
            }
        }
    },
    computed: {
        ...mapState('comcont', {
            detailobj: state => state.detailobj
        })
    },
    methods: {
        ...mapActions('comcont', [
            'APIGetRecords'
        ]),
        /**
         * 获取审批记录
         */
        getRecords(){
            let id = this.$route.query && this.$route.query.id;
            if(!id){
                return;
            }
            this.recordsloading = true;
            this.APIGetRecords(id).then(arr => {
                this.recordsloading = false;
                this.records = arr.map(item => {
                    return {
                        time: Util.getLocalFromUTC(item.CreateDate),
                        name: item.Name,
                        operation: item.Operation
                    }
                })
            }).catch(err => {
                this.recordsloading = false;
                Util.handleError(err);
            })
        },
        /**
         * 设置stateobj
         */
        setStateObj(){
            let CurrStateNo = this.detailobj.CurrStateNo + '';
            if(!CurrStateNo){
                return;
            }
            let temp = {
                s1: 0,
                s2: 0,
                s3: 0,
                s4: 0,
                s5: 0
            }
            if(/^1/.test(CurrStateNo)){
                temp.s1 = CurrStateNo == '12'? 2: 1
            }else if(/^2/.test(CurrStateNo)){
                temp.s1 = 2
                temp.s2 = CurrStateNo == '24'? 2: 1
            }else if(/^3/.test(CurrStateNo)){
                temp.s1 = 2
                temp.s2 = 2
                temp.s3 = CurrStateNo == '32'? 2: 1
            }else if(/^4/.test(CurrStateNo)){
                temp.s1 = 2
                temp.s2 = 2
                temp.s3 = 2
                temp.s4 = CurrStateNo == '42'? 2: 1
            }else if(/^5/.test(CurrStateNo)){
                temp.s1 = 2
                temp.s2 = 2
                temp.s3 = 2
                temp.s4 = 2
                temp.s5 = CurrStateNo == '52'? 2: 1
            }
            this.stateobj = temp;
        }
    },
    watch: {
        $route(){
            this.getRecords();
        },
        detailobj(){
            this.setStateObj();
        }
    },
    mounted(){
        this.getRecords();
        this.setStateObj();
    }
    
}
</script>
<style lang="less" scoped>
.detail-recordlist{
        
    overflow-x: auto;
    padding: 40px 0;
    .chart{
        padding-left: 14.5%;
        margin-left: -50px;
        box-sizing: border-box;
        &::after{
            content: '';
            display: block;
            clear: both;
        }
    }
    .icon-arrow{
        line-height: 100px;
        float: left;
        font-size: 63px;
        color: @im-green;
        margin-right: 18px;
    }
    .round{
        width: 100px;
        height: 100px;
        line-height: 100px;
        border-radius: 50%;
        box-sizing: border-box;
        text-align: center;
        font-size:@font-size3;
        font-weight:400;
        color:@im-grey;
        border: 2px solid #bbb;
        margin-right: 18px;
        float: left;
        &.state1{
            border: 3px solid @im-green;
        }
        &.state2{
            border: 3px solid @im-green;
            background: @im-green;
            color: #fff;
        }
    }
    .tb{
        box-sizing: border-box;
    }
    .line{
        padding: 14px 0;
        color: @normal-grey1;
        border-top: 1px dashed @border-color;
        &.line0{
            border-top: none;
        }
        &:after{
            content: '';
            display: block;
            clear: both;
        }
        
    }
    .title-line{
        padding-bottom: 16px;
        border-bottom: 1px dashed @border-color;
        font-size:@font-size3;
        font-weight:400;
        color:@im-grey;
        line-height:22px;
        margin-top: 40px;

        &:after{
            content: '';
            display: block;
            clear: both;
        }
    }
    
    .col{
        width: 25%;
        float: left;
        text-align: center;
        box-sizing: border-box;
        padding: 0 2%;
        &:nth-of-type(1){
            padding-left: 6%;
        }
    }
    .empty{
        text-align: center;
        font-size:@font-size1;
        color: @normal-grey4;
        padding: 50px;
    }
}
</style>


