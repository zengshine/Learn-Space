import {ActionTree} from "vuex"

const actions: ActionTree<any, any>={
    setSelectedMerc({state,commit},data){
        commit('selectedMerc',data)
    },
}

export default actions