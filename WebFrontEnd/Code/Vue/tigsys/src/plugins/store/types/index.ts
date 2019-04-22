import { Module } from 'vuex';

 interface ConfigState {
    isShowHeader: boolean,
    isShowFooter: boolean,
    isLoading:boolean,
    isSetLocation:boolean,
    location:any,
    UserInfo: any
}

 interface RootState {
    version: string,
    selectedMerc:any
}
export {
    ConfigState,
    RootState
}