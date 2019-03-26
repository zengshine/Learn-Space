import Vue from 'vue'
import Vuex from 'vuex'
import comcont from './modules/comcont'
import identity from './modules/identity'

import 'es6-promise/auto'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        comcont,
        identity
    }
})