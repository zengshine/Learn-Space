<template>
    <div>
        <template>
            <headtop  :txt="headconfs.txt" :icons="headconfs.icons"  @clickdownload="clickDownload" :loadobj="headloadings"></headtop>
            <div class="promanage">
                <toppart @search="searchInfo" :ctype="typename" ></toppart>
                <div class="tbwp" v-loading="tableloading">
                    <el-table :data="tableData" style="width: 100%" class="com-table" @row-click="clickRow">
                        <el-table-column prop="PApplyFullName" label="名称" ></el-table-column>
                        <el-table-column prop="PMerchantName" label="商户名" ></el-table-column>
                        <el-table-column prop="PBranchName" label="分行名称或总行部门名称" ></el-table-column>
                        <el-table-column prop="PUserName" label="申请人分行或机构" ></el-table-column>
                        <el-table-column prop="PMerchantType" label="商户类型" ></el-table-column>
                        <el-table-column label="状态" >
                            <template slot-scope="scope">
                                <comstate class="state" :txt="scope.row.CurrStateName" :state="scope.row.CurrStateNo"></comstate>
                            </template>
                        </el-table-column>
                        <el-table-column prop="coops" label="操作" width="120">
                            <template slot-scope="scope">
                                <i class="iconfont icon-delete" @click="deleteItem(scope.row,scope.$index)"></i>
                                <i class="iconfont icon-edit" ></i>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagewp">
                        <el-pagination class="com-pagination" @current-change="currentPage" background layout="total, prev, pager, next" :total="meta.count" :current-page.sync="meta.page" :page-size="meta.size"> </el-pagination>
                    </div>
                </div>
                
            </div>
        </template>
    </div>
</template>
<script>
import comstate from '../components/com/state.vue'
import toppart from '../components/promanage/head.vue'
import headtop from '../components/headers/header_top.vue'
import util from '../assets/js/util.js'
import { fail } from 'assert';
const Util = util.Util;
const Identity = util.Identity
import { mapState , mapMutations, mapActions} from 'vuex'
export default {
    name: 'promanage',
    data(){
        return {
            headconfs: {
                txt: '小程序列表',
                icons: [{
                    icon: 'icon-link',
                    href: '/#/?RoleType=3',
                    title: '点击跳转至填写测试商户号页面',
                    target: '_blank'
                },{
                    icon: 'icon-download',
                    emitname: 'clickdownload',
                    title: '点击下载小程序列表文件',
                    loadname: 'downloading'
                }]
            },
            headloadings: {
                downloading: false
            },
            MPAttachments: [],
            tableData:[],
            tableloading: false,
            meta: {},
            searchform: {}
            
        }
    },
    props: {
        typeno: {
            type: Number,
            default: 3
        },
        typename: {
            type: String,
            default: 'manage'
        }
    },
    methods: {
        ...mapActions('comcont', [
            'APIGetProList',
            'APIDownloadProlist',
            'APIDeletePro'
        ]),
        /**
         * 点击一行
         */
        clickRow(row, column, event){
            if(column.property == 'coops'){
                let tg = event.target;
                if(tg.className.indexOf('icon-edit') > -1){
                }else if(tg.className.indexOf('icon-delete') > -1){
                }
            }else{
                this.$router.push({path:this.pathObj.p_prodetail, query:{id:row.Id, key: this.MENU.m_promanger.key}})
            }
        },
        /**
         * 编辑一条小程序
         * @param {Object} item 小程序对象
         */
        deleteItem(item, index){
            Util.showDeleteConfirm('小程序', ()=>{
                this.APIDeletePro(item.Id).then(()=>{
                    this.getProDatas(this.meta.page)
                })
            })
        },
        /**
         * 点击下载按钮
         */
        clickDownload(){
            let isExportMPItemByFilter = false;
            if(Object.keys(this.searchform).length){
                isExportMPItemByFilter = true
            }
            this.$set(this.headloadings, 'downloading', true )
            this.APIDownloadProlist({
                isExportMPItemByFilter: isExportMPItemByFilter,
                searchform: this.searchform
            }).then(data => {
                this.$set(this.headloadings, 'downloading', false );
                location.href = this.BASEURL + data;
            }).catch(err => {
                this.$set(this.headloadings, 'downloading', false )
                Util.handleError(err)
            })
        },
        
        /**
         * 点击修改页数
         */
        currentPage(val){
            if(this.searchform &&  Object.keys(this.searchform).length){
                this.search(val)
            }else{
                this.getProDatas(val)
            }
        },
        /**
         * 通过传出来的searchform 获取 可以传送搜索的searchform
         * @param {Object} form 搜索时的搜索表单
         */
        setSearchForm(form){
            if(!form || (!form.name && !form.state && !form.apart && !form.date)){
                this.searchform = {};
            }else{
                let temp = {
                    PApplyFullName: form.name,
                    CurrStateNo: form.state,
                    PBranchName: form.apart
                    
                }
                if(form.date && form.date.length){
                    temp.StartDate = Util.formatDate(form.date[0], 'yyyy-MM-dd HH:mm:ss')
                    temp.EndDate = Util.formatDate(form.date[1], 'yyyy-MM-dd HH:mm:ss')
                }
                this.searchform = temp;
            }
        },
        /**
         * 通过搜索框搜索
         * @param {Object} form 搜索时的搜索表单
         * @param {String} type 'click' 通过点击搜索按钮的方式， 'clear' 通过清空表单的方式
         */
        searchInfo(form, type){
            this.setSearchForm(form);
            if(!form.name && !form.state && !form.apart && !form.date){
                if(type == 'clear'){
                    this.getProDatas(1);
                    return;
                }else{
                    return;
                }
            }
            this.search(1);
        },
        /**
         * 搜索链接后台动作
         * @param {Number} page 第几页
         */
        search(page){
            page = page || 1;
            this.tableloading = true;
            this.APIGetProList({
                type: this.typeno,
                pageIndex: page,
                pageCount: 10,
                ...this.searchform
            }).then(data => {
                this.MPAttachments = data.MPAttachments;
                this.tableData = data.MPList;
                this.meta = {count: data.Count, page:page, size:10}
                this.tableloading = false
            }).catch(err => {
                this.tableloading = false
                Util.handleError(err)
            })
        },
        /**
         * 获取小程序列表数据
         */
        getProDatas(pageNum){
            pageNum = pageNum || 1;
            //此处获取数据较慢,此时后台中处理数据分为两步  第一步处理完后,中间时间间隔长   第二步无时间间隔
            this.tableloading = true
            let CurUser = Identity.getIdCurUser();
            if(!CurUser){
                return;
            }
            this.APIGetProList({
                type: this.typeno,
                pageIndex: pageNum,
                pageCount: 10
            }).then(data => {
                this.MPAttachments = data.MPAttachments;
                this.tableData = data.MPList;
                this.meta = {count: data.Count, page:pageNum, size:10}
                this.tableloading = false
            }).catch(err => {
                this.tableloading = false
                Util.handleError(err)
            })
        },
        /**
         * 初始化数据
         */
        initData(CurUser){
            this.getProDatas();
            this.headconfs.icons[0].href = '/#' + this.pathObj.p_test + '?RoleType=3&OprData='+ CurUser.OprData + '&OprSign='+CurUser.OprSign
        }
    },
    components: {
        headtop,
        toppart,
        comstate
    },
    computed:{
        ...mapState('identity',{
            ticket: state => state.TICKET
        })
    },
    watch:{
        ticket(val){
            if(val){
                this.initData();
            }
        }
    },
    mounted(){
        let CurUser = Identity.getIdCurUser();
        if(CurUser){
            this.initData(CurUser);
        }else{
            this.headconfs.icons[0].href = ''
        }
        
    }
}
</script>
<style lang="less" scoped>
.promanage{
    margin: @con-margin;
    .tbwp{
        margin-top: 10px;
        width: 100%;
        background: #fff;
        border-radius: 4px;
        .iconfont{
            &+.iconfont{
                margin-left: 16px;
            }
            cursor: pointer;
            color: @normal-grey3;
            &:hover{
                color: @im-red;
            }
        }
        
    }
    
    .pagewp{
        padding: 30px 0;
    }
}
</style>
<style lang="less">
.promanage{
    .tbwp{
        td{
            cursor: pointer;
        }
    }
}
</style>



