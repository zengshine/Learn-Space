export default {
    setLocation(state,data){
        localStorage.setItem('location',JSON.stringify(data))
        state.location=data
    },
    toggleLocationModal(state,data){
        state.isSetLocation=data
    }
}