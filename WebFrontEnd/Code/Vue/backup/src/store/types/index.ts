import { Module } from 'vuex';

export interface ConfigState {
    isShowHeader: boolean,
    isShowFooter: boolean,
    UserInfo: any
}

export interface RootState {
    version: string
}