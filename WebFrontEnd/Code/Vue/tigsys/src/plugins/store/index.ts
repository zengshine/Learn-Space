import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";

import {RootState} from './types'

import state from "./states/root"
import actions from "./actions/root"
import mutations from "./mutations/root"
import config from './modules/config'

Vue.use(Vuex);

const store: StoreOptions<RootState>={
  state,
  actions,
  mutations,
  modules:{
    config
  }
}

export default new Vuex.Store<RootState>(store);
