<template>
<footer class="app-footer">
<article class="foot-bar">
    <nav>
        <ul class="bar-item-ct flex-row">
            <li v-for="item in barList" :key=item.name class="bar-item  bar-height flex-column flex-center px">
                <div>
                    <span><i class="fa" :class="[item.icon]"></i></span>                   
                </div>
                <div><span>{{item.name}}</span></div>
            </li>
        </ul>
    </nav>
</article>
</footer>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class vHeader extends Vue {
    private barList?:Array<object>[];
    data () {
        return {
           barList:[
               {name:"Home",icon:"fa-home"},
               {name:"Android",icon:"fa-address-card"},              
               {name:"Discover",icon:"fa-compass"},
               {name:"Me",icon:"fa-user"},
            ] 
        }
    }
}
</script>
<style lang="scss" scoped>
.app-footer {
  bottom: 0;
  left: 0;
  right: 0;
  background: #f9f9f9;
}
.bar-item-ct {
  justify-content: space-between;
}
.bar-item {
  flex: 1 1 auto;
  .fa {
    font-size: 20px;
    margin-bottom: 3px;
  }
}
</style>
