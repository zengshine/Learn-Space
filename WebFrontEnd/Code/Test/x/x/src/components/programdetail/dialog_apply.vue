<template>
     <el-dialog @close="closeit"  class="com-dialog dialog_apply" :title="detailobj.CurrStateNo | filterTitle" :visible.sync="dialogVisible" width="40%"  >
        <div class="flex" >
            <label class="com-label">审批意见</label>
            <textarea class="com-textarea flex-1" v-model="form.OpContent"></textarea>
        </div>
        <span slot="footer" class="com-footer">
            <button class="btn size2 green" @click="submitForm" v-loading="dialoading">{{type == 'agree'? '同 意':'拒 绝'}}</button>
            <button class="btn size2 grey" @click="closeit">取 消</button>
        </span>
    </el-dialog>
</template>
<script>
// 同意/拒绝申请
import util from '../../assets/js/util.js'
const Util = util.Util
import { mapState , mapMutations, mapActions} from 'vuex'
export default {
    name: 'dialog_apply',
    data(){
        return {
            form: {
                OpContent: ''
            },
            dialoading: false,
            dialogVisible: false
        }
    },
    filters: {
        filterTitle(val){
            if(val == 11){
                return '立项申请'
            }else if(val == 21){
                return '商户号申请'
            }else if(val == 31){
                return '方案审核'
            }else if(val == 41){
                return '测试验收'
            }else if(val == 51){
                return '上线确认'
            }
        }
    },
    computed: {
        ...mapState('comcont', {
            detailobj: state => state.detailobj
        })
    },
    props: {
        type: String, //'agree','reject'
        visible: Boolean
    },
    methods: {
        ...mapMutations('comcont',[
            'setDetailObj'
        ]),
        ...mapActions('comcont', [
            'APIApprove'
        ]),
        closeit(){
            this.$emit('closeit');
        },
        /**
         * 获取下一个阶段的状态码
         */
        getNextState(){
            let nowstate = this.detailobj.CurrStateNo;
            let nextstate = 0;
            if(nowstate == 11){
                nextstate = this.type == 'agree'? 12: 13
            }else if(nowstate == 21){
                nextstate = this.type == 'agree'? 22: 23
            }else if(nowstate == 31){
                nextstate = this.type == 'agree'? 32: 33
            }else if(nowstate == 41){
                nextstate = this.type == 'agree'? 42: 43
            }else if(nowstate == 51){
                nextstate = this.type == 'agree'? 52: 53
            }
            return nextstate;
        },
        submitForm(){
            if(this.detailobj){
                if(!this.form.OpContent && this.type == 'reject'){
                    Util.showMsg('请填写拒绝理由！')
                    return;
                }
                
                let temp = {Id: this.detailobj.Id, CurrStateNo:this.getNextState()}
                this.dialoading = true;
                this.APIApprove({
                    MiniProgram: JSON.stringify(temp),
                    OpContent: this.form.OpContent
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
            }
        }
    },
    watch: {
        visible(val){
            this.dialogVisible = val;
        }
    },
    mounted(){
        this.dialogVisible = !!this.visible;
    }
}
</script>
<style lang="less" scoped>
.dialog_apply{
    .com-label{
        width: 4em;
    }
    .com-textarea{
        height: 230px;
    }
}
</style>


