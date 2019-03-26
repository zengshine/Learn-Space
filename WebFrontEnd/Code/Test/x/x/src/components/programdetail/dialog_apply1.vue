<template>
     <el-dialog @close="closeit" class="com-dialog dialog_apply" title="立项申请" :visible.sync="dialogVisible" width="40%"  >
        <div class="flex" >
            <label class="com-label">审批意见</label>
            <textarea class="com-textarea flex-1" v-model="form.OpContent"></textarea>
        </div>
        <span slot="footer" class="com-footer">
            <button class="btn size2 green" @click="submitForm" v-loading="dialoading">同 意</button>
            <button class="btn size2 grey" @click="closeit">取 消</button>
        </span>
    </el-dialog>
</template>
<script>
// 同意/拒绝申请
import util from '../../assets/js/util.js'
const Util = util.Util
import { mapState , mapActions} from 'vuex'
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
    computed: {
        ...mapState('comcont', {
            detailobj: state => state.detailobj
        })
    },
    props: {
        state: Number,
        visible: Boolean
    },
    methods: {
        ...mapActions('comcont', [
            'APIApprove'
        ]),
        closeit(){
            this.$emit('closeit');
        },
        submitForm(){
            if(this.detailobj){
                let temp = {...this.detailobj, CurrStateNo:this.state}
                this.dialoading = true;
                this.APIApprove({
                    MiniProgram: JSON.stringify(temp),
                    OpContent: this.form.OpContent
                }).then(res => {
                    this.dialoading = false;
                    Util.showMsg('保存成功','success');
                    this.$emit('change', res)
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


