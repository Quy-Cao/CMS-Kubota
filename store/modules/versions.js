export default {
  namespaced: true,
  state() {
    return {
      maxVersion: {},
      listVersion: null,
    }
  },


  mutations: {
    setMaxVersion(state, payload) {
      state.maxVersion = payload;
    },
    setListVersion(state, payload) {
      state.listVersion = payload;
    }
  },


  actions: {
    async getMaxVersion({state, commit}, params = null) {
      const resApi = await this.$axios.$get(`api/v1/version/getMaxVersions?modelId=${params}`);
      if (resApi.status == 200) {
        commit('setMaxVersion', resApi.data);
      }
    },
    async getListVersion({state, commit}, params = null) {
      const resApi = await this.$axios.$get(`api/v1/version/getListVersions?modelId=${params}`);
      if (resApi.status == 200) {
        commit('setListVersion', resApi.data);
      }
    },
    async getAddNewVersion({state, commit}, params = null) {
      const resApi = await this.$axios.$post("api/v1/version/addNewVersion", params);
      return resApi;
    },

    async getCurrentVersion({}, modelId = null) {
      const resApi = await this.$axios.$get(`api/v1/version/getCurrentVersionData?modelId=${modelId}`);
      return resApi;
    }
  },
}
