import firebase from 'firebase/app'

export default {
  actions: {
    async fetchWastewaterReceivers({commit, dispatch}) {
      try {
        const uid = await dispatch('getUid')
        const wastewaterReceivers = (await firebase.database().ref(`/users/${uid}/wastewaterreceivers`).once('value')).val() || {}
        return Object.keys(wastewaterReceivers).map(key => ({...wastewaterReceivers[key], id: key}))
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async fetchWastewaterReceiverById({commit, dispatch}, id) {
      try {
        const uid = await dispatch('getUid')
        const wastewaterReceiver = (await firebase.database().ref(`/users/${uid}/wastewaterreceivers`).child(id).once('value')).val() || {}
        return {...wastewaterReceiver, id}
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async updateWastewaterReceiver({commit, dispatch}, {wastewaterReceiverName, wastewaterReceiverType, wastewaterReceiverDetail, id}) {
      try {
        const uid = await dispatch('getUid')
        await firebase.database().ref(`/users/${uid}/wastewaterreceivers`).child(id).update({wastewaterReceiverName, wastewaterReceiverType, wastewaterReceiverDetail})
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async createWastewaterReceiver({commit, dispatch}, {wastewaterReceiverName, wastewaterReceiverType, wastewaterReceiverDetail}) {
      try {
        const uid = await dispatch('getUid')
        const wastewaterReceiver = await firebase.database().ref(`/users/${uid}/waterconsumers`).push({wastewaterReceiverName, wastewaterReceiverType, wastewaterReceiverDetail})
        return {wastewaterReceiverName, wastewaterReceiverType, wastewaterReceiverDetail, id: wastewaterReceiver.key}
      } catch (e) {
        commit('setError', e)
        throw e
      }
    }
  }
}