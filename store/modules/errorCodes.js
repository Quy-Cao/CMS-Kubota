export default {
  namespaced: true,
  state() {
    return {
      errorCodeInfo: null,
      errorCodeDiagnosis: null
    }
  },

  mutations: {
    setErrorCodeInfo(state, payload) {
      state.errorCodeInfo = payload;
    },
    setErrorCodeDiagnosis(state, payload) {
      state.errorCodeDiagnosis = payload;
    }
  },

  actions: {
    async addErrorCode({ state }, params = null) {
      const resApi = await this.$axios.$post('api/v1/errorDiagnosis/addNewErrorDiagnosis', params);
      return resApi;
    },
    async getListErrorCodes({ state, commit }, params = null) {
      const resApi = await this.$axios.$get(`api/v1/errorDiagnosis/getListErrorDiagnosis`, {params});
      return resApi;
    },
    async editErrorCode({ state, commit }, params = null) {
      const resApi = await this.$axios.$post('api/v1/errorDiagnosis/updateErrorDiagnosis', params);
      return resApi;
    },
    async getErrorCodeByModelId({ state, commit }, params = null) {
      const { modelId, errorCodeId } = params;
      const resApi = await this.$axios.$get(`api/v1/errorDiagnosis/getInfoErrorDiagnosis?modelId=${modelId}&errorCodeId=${errorCodeId}`)
      if (resApi.status == 200) {
        commit('setErrorCodeInfo', resApi.data);
      }
    },
    async changeErrorStatus({}, params = null) {
      const resApi = await this.$axios.$post('api/v1/errorDiagnosis/changeErrorDiagnosisStatus', params);
      return resApi;
    },
    async copyErrorsToOtherModel({}, params = null) {
      const resApi = await this.$axios.$post('api/v1/errorDiagnosis/copyErrorDiagnosis', params);
      return resApi;
    },
    async getErrorCodeDiagnosis({ state, commit }, params = null) {
      const { modelId, errorCodeId } = params;
      const resApi = await this.$axios.$get(`api/v1/errorDiagnosis/getDiagnosisFlow?modelId=${modelId}&errorCodeId=${errorCodeId}`)
      if (resApi.status == 200) {
        commit('setErrorCodeDiagnosis', resApi.data);
      }
    },
    async updateErrorDiagnosisFlow({}, params = null) {
      const resApi = await this.$axios.$post('api/v1/errorDiagnosis/updateErrorDiagnosisFlow', params);
      return resApi;
    },
    async duplicateErrorDiagnosisFlow({}, params = null) {
      const resApi = await this.$axios.$post(`api/v1/errorDiagnosis/duplicateErrorDiagnosisFlow`, params);
      return resApi;
    },
    async deleteErrorDiagnosis({}, params = null) {
      return await this.$axios.$post(`api/v1/errorDiagnosis/deleteErrorDiagnosis`, params);
    },
  }
}
