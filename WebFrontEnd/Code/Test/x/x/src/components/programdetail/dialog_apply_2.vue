<template>
     <el-dialog  class="com-dialog dialog_apply_2" title="申请商户号" :visible.sync="dialogVisible" width="50%"  @close="closeit">
         <div>
             <div class="flex">
                 <label for="" class="com-label">测试地址</label>
                 <input class="com-txt flex-1" :class="{err:this.err.MTestUrl}" v-model="form.MTestUrl">
             </div>
             <div class="flex">
                 <label for="" class="com-label apply_2_label">一网通支付</label>
                 <el-switch v-model="form.MIsNetcomPayment" ></el-switch>
             </div>
             <div class="flex">
                 <label for="" class="com-label apply_2_label">使用默认导航栏(TopBar)</label>
                 <el-switch v-model="form.STopbar" ></el-switch>
             </div>
             <div class="flex">
                 <label for="" class="com-label apply_2_label">调用接口</label>
                 <div v-loading="listloading" class="flex-1">
                     <el-checkbox-group v-model="form.MCallInterface">
                        <el-checkbox v-for="(item,index) in checkForm" :key="index" :label="item.ShowName"
                                    size="medium"></el-checkbox>
                    </el-checkbox-group>
                 </div>
             </div>
             <div class="flex" v-if="detailobj.CurrStateNo == 23">
                 <label for="" class="com-label">修改说明</label>
                 <textarea class="com-textarea flex-1"  v-model="form.PDesc"></textarea>
             </div>
         </div>
        <span slot="footer" class="com-footer">
            <button class="btn size2 green" @click="submitForm" v-loading="dialoading">提交</button>
            <button class="btn size2 grey" @click="closeit">取 消</button>
        </span>
    </el-dialog>
</template>
<script>
// 同意/拒绝申请
import util from '../../assets/js/util.js'

const Util = util.Util
const Identity = util.Identity
const Reg = util.Reg
import { mapState , mapMutations, mapActions} from 'vuex'
export default {
    name: 'dialog_apply_2',
    data(){
        return {
            form: {
                Id: '',
                MTestUrl: '',
                MIsNetcomPayment: false,
                STopbar: false,
                MCallInterface: [],
                PDesc: ''
            },
            err: {

            },
            checkForm: [],
            listloading: false, // 调用接口列表获取等待
            dialoading: false,
            dialogVisible: false
        }
    },
    computed: {
        ...mapState('comcont', {
            detailobj: state => state.detailobj
        })
    },
    props: {
        visible: Boolean
    },
    methods: {
        ...mapMutations('comcont',[
            'setDetailObj'
        ]),
        ...mapActions('comcont', [
            'APIApprove',
            'APIGetParams'
        ]),

        closeit(){
            this.$emit('closeit');
        },
        /**
         * 获取调用接口列表
         */
        getList(){
            this.listloading = true;
            this.APIGetParams(2002).then(data => {
                this.listloading = false;
                this.checkForm = data;
            }).catch(err => {
                this.listloading = false;
                Util.handleError(err)
            })
        },
        /**
         * 设置初始form 值
         */
        setInitData(){
            let o = this.detailobj || {}
            let arr = [];
            try{
                arr = JSON.parse(o['MCallInterface']);
            }catch(e){
                arr = []
            }
            this.form = {
                Id: this.detailobj.Id,
                MTestUrl: o['MTestUrl'] || '',
                MIsNetcomPayment: o['MIsNetcomPayment'] && true || false,
                STopbar: o['STopbar'] && true || false,
                MCallInterface: arr,
                PDesc: o['PDesc'] || ''
            }
        },
        submitForm() {
            this.$set(this.form, 'MTestUrl', this.form.MTestUrl.replace(/(^\s+)|(\s+$)/g,''))
            if(!this.form.MTestUrl){
                this.$set(this.err, 'MTestUrl', true);
                Util.showMsg('请填写测试地址！')
                return;
            }else if(!Reg.url.test(this.form.MTestUrl)){
                this.$set(this.err, 'MTestUrl', true);
                Util.showMsg('请填写正确的测试地址！')
                return;
            }
            this.err = {};
            let temp = {
                Id: this.form.Id,
                MTestUrl: this.form.MTestUrl,
                MCallInterface: JSON.stringify(this.form.MCallInterface),
                MIsNetcomPayment: this.form.MIsNetcomPayment && 1 || 0,
                STopbar: this.form.STopbar && 1 || 0,
                CurrStateNo: 21
            }
            let str = Identity.getIdUserStr();
            if(!str){
                return;
            }
            this.dialoading = true;
            this.APIApprove({
                MiniProgram:JSON.stringify(temp),
                CurUser: str
            }).then(res => {
                this.dialoading = false;
                Util.showMsg('保存成功','success');
                this.setDetailObj(res)
                this.closeit();
            }).catch(err => {
                this.dialoading = false;
                if(err.Message){
                    Util.showMsg(err.Message,'error');
                }else{
                    Util.showMsg('提交失败，请刷新重试', 'error')
                }
            })
        },
    },
    watch: {
        visible(val){
            this.dialogVisible = val;
            if(val){
                this.setInitData();
            }
        }
    },
    mounted(){
        this.setInitData();
        this.getList();
    }
}
</script>
<style lang="less" scoped>
.dialog_apply_2{
    .com-label{
        width: 11em;
    }
    .apply_2_label{
        line-height: 20px;
    }
    .flex+.flex{
        margin-top: 30px;
    }
    
}
</style>


