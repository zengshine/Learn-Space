<template>
     <el-dialog  class="com-dialog dialog_apply_4" title="提交测试" :visible.sync="dialogVisible" width="50%"  @close="closeit" >
         <div>
             <div class="flex">
                 <label for="" class="com-label">测试账号</label>
                 <input class="com-txt flex-1" :class="{err:this.err.MTestUrl}" v-model="form.MTestUrl">
             </div>
             <div class="flex">
                 <label for="" class="com-label apply_2_label"><span class="com-star">*</span>演示地址</label>
                 <div class="flex-1"><textarea class="com-textarea"></textarea>
                    <div class="com-tip">在小程序专区展示给客户看，25字以内</div>
                 </div>
             </div>
             <div class="flex">
                 <label for="" class="com-label apply_2_label">测试用例</label>
                 <el-switch v-model="form.STopbar" ></el-switch>
             </div>
         </div>
        <span slot="footer" class="com-footer">
            <button class="btn size2 green" @click="submitForm" v-loading="dialoading">提交</button>
            <button class="btn size2 grey" @click="closeit">取 消</button>
        </span>
    </el-dialog>
</template>
<script>
// 提交测试
import util from '../../assets/js/util.js'
const Util = util.Util
const Identity = util.Identity
const Reg = util.Reg
import { mapState , mapMutations, mapActions} from 'vuex'
export default {
    name: 'dialog_apply_4',
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
            this.listloading = true;
            this.APIGetParams(2002).then(data => {
                this.listloading = false;
                this.checkForm = data;
            }).catch(err => {
                this.listloading = false;
                Util.handleError(err)
            })
        },
        submitForm() {
            
            this.err = {};
            let temp = {
                Id: this.detailobj.Id,
                CurrStateNo: 41
            }
            let str = Identity.getIdUserStr();
            if(!str){
                return;
            }
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
                // this.setInitData();
            }
        }
    },
    mounted(){
        // this.setInitData();
    }
}
</script>
<style lang="less" scoped>
.dialog_apply_4{
    .com-label{
        width: 5em;
    }
    .apply_2_label{
        line-height: 20px;
    }
    .flex+.flex{
        margin-top: 30px;
    }
    
}
</style>


