import {state} from '../states/config'
import actions from '../actions/config'
import  mutations from '../mutations/config'
import { Module } from 'vuex';
import { ConfigState, RootState } from '../types';

const namespaced: boolean=true;

const config:Module<ConfigState,RootState>={
    namespaced,
    state,
    actions,
    mutations
}

export default config