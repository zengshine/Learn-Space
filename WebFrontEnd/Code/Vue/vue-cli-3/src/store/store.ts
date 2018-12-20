import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";

import {RootState} from './types'

import state from "./states"

import config from './modules/config'

Vue.use(Vuex);

const store: StoreOptions<RootState>={
  state,
  modules:{
    config
  }
}

export default new Vuex.Store<RootState>(store);
