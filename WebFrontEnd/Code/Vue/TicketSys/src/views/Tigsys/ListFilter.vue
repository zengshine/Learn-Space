<template>
      <div class="c-filter-ct">
      <div :class="{'filter-fixed':isFixedFilter}" :style="{top:headerHeight+'px'}" v-outsideClick:isFilterListVisible class="c-filter z-3 p-h-32 flex-row-nowrap flex-v-center flex-h-between h-84">
      <div class="c-filter-item flex flex-v-center" :class="{'selected':isFilterListVisible&&selectedFilterType==type,'flex-h-center':index>0&&index<Object.keys(options).length-1,'flex-h-end':index==Object.keys(options).length-1}" @click="onFilterClick(type)"  v-for="(type,index) in Object.keys(options)" :key="index">
          <span class="filter-type-name text-ellipsis">
            {{filterRes[type].name}}
          </span>
          <svg class="svgIcon fs-28 c-filter-caret" :class="{'rotate180 selected':isFilterListVisible&&selectedFilterType==type}">
            <use xlink:href="#iconxialajiantou1"></use>
          </svg>
      </div>     
    </div>
    <transition name="slide-up">
    <div class="c-filterlist z-2" v-show="isFilterListVisible">
        <ul class="filterlist-ct">
          <li v-for="(item,index) in filterItemList" @click="selectFilterItem(item)" :key="index" class="filterlist-item" :class="{'selected':item.name==filterRes[selectedFilterType].name}">{{item.name}}</li>
        </ul>
    </div>
    </transition> 
    <div class="s-modal backdrop" v-show="isFilterListVisible"></div>
    </div>
</template>
<style lang="scss" scoped>
.c-filter {
  font-size: 28px;
  border-bottom: 0.5px solid rgba(221, 221, 221, 0.85);
  .c-filter-item{
    height: 100%;
    flex: 1 0 auto;
    max-width: 33.3%   
  }
  .filter-type-name{
    display: block;
    max-width: calc( 100% - 35px);
  }
  .c-filter-caret{
    width:20px;
    height:20px;
    color:rgba(153,153,153,1);
    vertical-align: middle;
    margin: 0;
    margin-left: 6px;
  }
  &.filter-fixed{
    position: fixed;
    width: 100%;
    background: #fff;
    box-sizing: border-box;
  }
}
.c-filterlist{
  position: fixed;
  top:188px;
  left: 0;
  right: 0;
}
.filterlist-ct{
  height: 750px;
  background: #fff;
  padding: 42px 32px 0 32px;
  overflow: auto;
}
.filterlist-item{
  line-height: 72px;
}
.selected{
  color: #FF5C3B !important;
}
.s-modal{
  position: fixed;
  top:0px;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
<script lang="ts">
import { Component, Vue, Prop,Model } from "vue-property-decorator";
import { debug } from 'util';

@Component({})
export default class Ticket extends Vue {
  @Prop({default:false}) isFixedFilter!: boolean;
  @Prop() headerHeight!: number;
  @Prop({type:Object,default:{}}) options
  @Model('change',{type:Object,default:()=>{
    return {}
  }}) filterRes;
  filterItemList:Array<string>=[]
  selectedFilterType:string=""
  isFilterListVisible:boolean=false;
  data() {
    return {
    };
  }
  created() {}
  mounted() {
  }
  onFilterClick(type){
    this.isFilterListVisible=true
    this.selectedFilterType=type
    this.filterItemList=this.options[type].data
    this.$emit('clickFilter')
  }
  selectFilterItem(filterItem){
    let filterResTemp=Object.assign({},this.filterRes)
    filterResTemp.type=this.selectedFilterType
    filterResTemp[this.selectedFilterType]=filterItem
    this.$emit('change',filterResTemp)
  }
}
</script>
