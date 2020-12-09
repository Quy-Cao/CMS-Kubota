export default {
  namespaced: true,
  state() {
    return {
      categories: [],
      issueInfo: {},
      issueDiagnosis: null
    }
  },

  mutations: {
    setIssues(state, payload) {
      state.categories = payload;
    },
    setIssueInfo(state, payload) {
      state.issueInfo = payload;
    },
    setIssueDiagnosis(state, payload) {
      state.issueDiagnosis = payload;
    }
  },

  actions: {
    async getListCategory({ state, commit }, params = null) {
      const resApi = await this.$axios.$get('api/v1/issueCategory/getListCategory');
      if (resApi.status == 200) {
        commit('setIssues', resApi.data);
      }
    },

    async getListIssues({ state, commit }, params = null) {
      const resApi = await this.$axios.$get('api/v1/issueDiagnosis/getListIssueDiagnosis', { params });
      return resApi;
    },

    async addIssue({ state }, params = null) {
      const resApi = await this.$axios.$post('api/v1/issueDiagnosis/addNewIssueDiagnosis', params);
      return resApi;
    },

    async getIssueByModelId({ state, commit }, params = null) {
      const resApi = await this.$axios.$get(`api/v1/issueDiagnosis/getInfoIssueDiagnosis?iCatetoryId=${params.iCategoryId}`)
      if (resApi.status == 200) {
        commit('setIssueInfo', resApi.data);
      }
    },

    async editIssue({ state, commit }, params = null) {
      const resApi = await this.$axios.$post('api/v1/issueDiagnosis/updateIssueDiagnosis', params);
      return resApi;
    },

    async changeIssueStatus({}, params = null) {
      const resApi = await this.$axios.$post('api/v1/issueDiagnosis/changeIssueDiagnosisStatus', params);
      return resApi;
    },

    async copyIssueToOtherModel({}, params = null) {
      const resApi = await this.$axios.$post('api/v1/issueDiagnosis/copyIssueDiagnosisFlow', params);
      return resApi;
    },
    async getIssueDiagnosis({ state, commit }, iCategoryId = null) {
      const resApi = await this.$axios.$get(`api/v1/issueDiagnosis/getIssueDiagnosisFlow?iCatetoryId=${iCategoryId}`)
      if (resApi.status == 200) {
        commit('setIssueDiagnosis', resApi.data);
      }
    },
    async updateIssueDiagnosisFlow({}, params = null) {
      const resApi = await this.$axios.$post('api/v1/issueDiagnosis/updateIssueDiagnosisFlow', params);
      return resApi;
    },
    async duplicateIssueDiagnosisFlow({}, params = null) {
      const resApi = await this.$axios.$post(`api/v1/issueDiagnosis/duplicateIssueDiagnosisFlow`, params);
      return resApi;
    },
    async deleteIssueDiagnosis({}, params = null) {
      return await this.$axios.$post(`api/v1/issueDiagnosis/deleteIssueDiagnosis`, params);
    }
  }
}
