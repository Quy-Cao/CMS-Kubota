export default {
  namespaced: true,
  state() {
    return {
      fileState: null,
      mediaInfo: null
    }
  },

  mutations: {
    setFileState(state, payload) {
      state.fileState = payload;
    },
    setMediaInfo(state, payload) {
      state.mediaInfo = payload;
    }
  },

  actions: {
    async addMedia({}, params = null) {
      const resApi = await this.$axios.$post('api/v1/diagnosisImage/addNewDiagnosisImage', params);
      return resApi;
    },

    async editMedia({}, params = null) {
      const resApi = await this.$axios.$post('api/v1/diagnosisImage/updateDiagnosisImage', params);
      return resApi;
    },

    async getListMedia({ state, commit }, params = null) {
      const resApi = await this.$axios.$get('api/v1/diagnosisImage/getListDiagnosisImage', { params });
      return resApi;
    },

    async deleteMedia({ state, commit }, imageId = null) {
      const resApi = await this.$axios.$post(`api/v1/diagnosisImage/deleteDiagnosisImage`, {
        imageId
      });
      return resApi;
    },

    async getMediaInfo({commit}, imageId = null) {
      const resApi = await this.$axios.$get(`api/v1/diagnosisImage/getInfoDiagnosisImage?imageId=${imageId}`);
      if (resApi.status == 200) {
        commit('setMediaInfo', resApi.data);
      }
    }
  }
}
