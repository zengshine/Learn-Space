import {ActionTree} from "vuex"

const actions: ActionTree<any, any>={
    setLocation({state,commit},data){
        commit('setLocation',data)
    },
    toggleLocationModal({state,commit},data){
        commit('toggleLocationModal',data)
    }
}

export default actions