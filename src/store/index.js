import Vue from 'vue'
import Vuex from 'vuex'
import decode from 'jwt-decode'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    token: null,
  },
  mutations: {
    setToken(state, token) {
      state.token = token
    },
    setUser(state, user) {
      state.user = user
    },
  },
  actions: {
    guardarToken({ commit }, token) {
      commit('setToken', token)
      commit('setUser', decode(token))
      localStorage.setItem('token', token)
    },
    autoLogin({ commit }) {
      let token = localStorage.getItem('token')
      if (token) {
        commit('setToken', token)
        commit('setUser', decode(token))
      }
      router.push({ name: 'Home' })
    },
    salir({ commit }) {
      commit('setToken', null)
      commit('setUser', null)
      localStorage.removeItem('token')
      router.push({ name: 'Login' })
    },
  },
  modules: {},
})
