<template>
    <span class="com-state" :class="{'red':state%10==3,'green':state==12||
                state==24||state==32||state==42||state==52,
                'blue':state==22||state==54}">{{txt}}</span>
</template>
<script>
export default {
    name: 'state',
    props: {
        txt: String,
        state: Number
    }
}
</script>
<style lang="less" scoped>
.com-state{
    color:@normal-grey1;
    &.red{
        color: @im-red;
    }
    &.blue{
        color: @im-blue;
    }
    &.green{
        color: @im-green;
    }
}
</style>

