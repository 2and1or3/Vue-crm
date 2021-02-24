import firebase from 'firebase/app'

export default {
  state: {
    info: {}
  },
  getters: {
    info: (s) => s.info
  },
  mutations: {
    setInfo (state, info) {
      state.info = info
    },
    clearInfo (state, info) {
      state.info = {}
    }
  },
  actions: {
    async fetchInfo ({ dispatch, commit }) {
      try {
        const uid = await dispatch('getUid')
        const resp = await firebase.database().ref(`/users/${uid}/info`).once('value')
        const info = resp.val()

        commit('setInfo', info)
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async updateInfo ({ dispatch, commit, getters }, toUpdate) {
      try {
        const uid = await dispatch('getUid')
        const updateData = { ...getters.info, ...toUpdate }
        await firebase
          .database()
          .ref(`/users/${uid}/info`)
          .update(updateData)

        commit('setInfo', updateData)
      } catch (e) {
        commit('setError', e)
        throw e
      }
    }
  }
}
