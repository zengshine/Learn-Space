import {state} from '../states/config/index'
import { Module } from 'vuex';
import { ConfigState, RootState } from '../types';

const namespaced: boolean=true;

const config:Module<ConfigState,RootState>={
    namespaced,
    state,
}

export default config