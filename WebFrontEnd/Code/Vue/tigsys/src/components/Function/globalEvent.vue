<script lang="ts">
import { Component, Vue, Prop,Model } from "vue-property-decorator";
import { Indicator,MessageBox} from 'mint-ui';
import { State, Action, Getter, namespace } from "vuex-class";
import { ConfigState } from "@/plugins/store/types";
import {cmblsJSExecutor} from "@/static/js/cmbsdk/executor.ts"
import { delimiter } from 'path';
const configModuleNS=namespace("config");
@Component({
  components: {
  }
})
export default class Detial extends Vue {
  functional:boolean=true
  @configModuleNS.State('isLoading') isLoading;
  private vbus:any
  render(h) {}
  data() {
    return {
    };
  }
  created() {
      let vm=this
      window.vbus=new Vue()
      //显示加载框
      window.vbus.$on('global.loading',(params={
      spinnerType: 'fading-circle'
      })=>{
        Indicator.open(params)
        })
      //关闭加载框
      window.vbus.$on('global.loaded',()=>{
        Indicator.close()
      })
      //提示框
      window.vbus.$on('global.message',(params)=>{
        let defaultParams={title:"提示"}
        Object.assign(defaultParams,params)
        MessageBox(defaultParams)
      })
      window.vbus.$on('executeCmbInterface',(command)=>{
        cmblsJSExecutor(command)
      }) 
  }
  mounted() {
  }
}
</script>
