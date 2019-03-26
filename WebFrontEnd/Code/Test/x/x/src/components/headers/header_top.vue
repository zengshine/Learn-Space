<template>
    <div class="header_top">
        <span class="title"><i class="iconfont icon-returnbtn" v-if="showback" @click="clickback"></i>{{txt}}</span>
        <div  class="addbtn">
            <template v-for="(item, index) in icons">
                <a v-loading="loadobj && item.loadname && loadobj[item.loadname]" class="ic" :href="item.href" :target="item.target" v-if="item.href" :title="item.title" :key="index"><i class="iconfont" :class="item.icon"></i></a>
                <i v-loading="loadobj && item.loadname && loadobj[item.loadname]" v-if="!item.href" :title="item.title" class="ic iconfont"  :class="item.icon" @click="clickFn(item)" :key="index"></i>
            </template>
        </div>
    </div>
</template>
<script>
export default {
    name: 'header_top',
    data(){
        return {
            title: ''
        }
    },
    props: {
        loadobj: Object,
        txt: String,
        icons: Array, // icon 数组，包括传递出去的名字
        showback: Boolean //是否有返回按钮
    },
    methods: {
        // 点击其他按钮
        clickFn(item){
            this.$emit(item.emitname)
        },
        // 点击返回按钮
        clickback(){
            this.$emit('clickback')
        }
    }
}
</script>
<style lang="less" scoped>
.header_top{
    background:#fff;
    height: 70px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    z-index: 90;
    overflow: hidden;
    box-sizing: border-box;
    line-height: 70px;
    padding-left: 240px;
    .title{
        margin-left: 30px;
        font-size: @font-size2;
    }
    .addbtn{
        position: absolute;
        right: 30px;
        height: 70px;
        top: 0;
        line-height: 70px;
        cursor: pointer;
        .ic+.ic{
            margin-left: 26px;
        }
    }
    .iconfont{
        color: @normal-grey1;
        font-size: @icon-size1;
        &:hover{
            color: @im-green;
        }
    }
    .icon-returnbtn{
        font-size: 20px;
        height: 70px;
        display: inline-block;
        width: 28px;
        cursor: pointer;
    }
}
</style>


