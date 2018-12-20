import { Module } from 'vuex';

export interface ConfigState{
    isShowHeader:boolean,
    isShowFooter:boolean
}

export interface RootState {
    version:string
}