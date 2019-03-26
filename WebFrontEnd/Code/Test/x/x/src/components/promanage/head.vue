<template>
    <div class="promanage-head">
        <div class="line">
            <div class="col col1"><label class="com-label" >名称</label>
                <div class="inputwp" :class="form.name ? '':'hasicon'">
                    <input type="text"  class="com-txt"   v-model="form.name" @keyup="keyupFn" placeholder="请输入名称搜索">   
                    <i class="iconfont icon-search" ></i>
                </div>
            </div>
            <div class="col col2"><label class="com-label">开发分行或机构</label>
                <div class="inputwp"  :class="form.apart ? '':'hasicon'">
                    <input type="text" class="com-txt"   v-model="form.apart" @keyup="keyupFn" placeholder="请输入分行名称或总行部门名称">   
                    <i class="iconfont icon-search" ></i>
                </div>
            </div>
        </div>
        <div class="line">
            <div class="col col1"><label class="com-label">状态</label>
                <el-select v-model="form.state" @clear="searchInfo('clear')"  placeholder="请选择状态" class="com-elsel" :clearable="true" >
                    <el-option v-for="(item, key) in confs" :key="key" :label="item" :value="key"> </el-option>
                </el-select>
            </div>
            <div class="col col2"><label class="com-label">创建时间</label>
            <el-date-picker v-model="form.date"   format="yyyy-MM-dd"  class="com-eldatepicker"  type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker></div>
            <div class="col col3"><button class="btn size3 green" @click="searchInfo">搜索</button></div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'promanagehead',
    data(){
        return {
            form: {
                name: '', // 名称
                apart: '', //开发分行或机构
                state: '',//状态
                date: '', //创建时间
            },
            confs: []
        }
    },
    props: {
        ctype: String
    },
    watch:{
        
        'form.date'(val){
            if(!val || !val.length){
                this.searchInfo('clear')
            }
        }
    },
    methods: {
        searchInfo(type){
            this.$emit('search', this.form, type || 'click')
        },
        keyupFn(e){
            let code = e.keyCode || e.which
            if(code == 13){
                this.searchInfo('search')
            }else if(code == 8 && !this.form.name){
                this.searchInfo('clear')
            }
        }
    },
    mounted() {
        if(this.ctype == 'wait' || this.ctype == 'assist'){
            let temp = {}
            for(let key in this.StateConf){
                if(/1$/.test(key)){
                    temp[key] = this.StateConf[key]
                }
            }
            this.confs = temp;
        }else{
            this.confs = this.StateConf;
        }
    }
}
</script>
<style lang="less" scoped>
.promanage-head{
    padding: 40px;
    background: #fff;
    border-radius: 4px;
    .line{
        &+.line{
            margin-top: 20px;
        }
        &:after{
            content: '';
            display: block;
            clear: both;
        }
    }
    .col {
        float: left;
        width: 19.75%;
        box-sizing: content-box;
        position: relative;
        .flex;
        &+.col{
            margin-left: 6%;
        }
    }
    .com-label{
        position: absolute;
        left: 0;
        top: 0;
        padding-right: 10px;
        box-sizing: border-box;
    }
    .col1{
        padding-left: 42px;
        .com-label{
            width: 42px;
        }
    }
    .col2{
        padding-left: 122px;
        .com-label{
            width: 122px;
        }
    }
    .col.col3{
        margin-left: 7.4%;
    }
    .inputwp{
        width: 100%;
        position: relative;
        .com-txt{
            position: relative;
            z-index: 20;
            background: transparent;
        }
        .icon-search{
            font-size: 14px;
            position: absolute;
            left: 10px;
            line-height: 40px;
            top: 0;
            color: @normal-grey4;
            z-index: 10;
            opacity: 0;
        }
        &.hasicon{
            .com-txt{
                padding: 0 30px;
            }
            .icon-search{
                opacity: 1;
            }
        }
    }
    
    
}
</style>


