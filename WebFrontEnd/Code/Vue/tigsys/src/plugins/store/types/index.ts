import { Module } from 'vuex';

export interface ConfigState {
    isShowHeader: boolean,
    isShowFooter: boolean,
    isLoading:boolean,
    isSetLocation:boolean,
    location:any,
    UserInfo: any
}

export interface RootState {
    version: string,
    selectedMerc:any
}