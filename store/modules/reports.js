export default {
  namespaced: true,
  state() {
    return {
      allModel: [],
      allErrorCode: [],
      allIssue: [],
      reportDetail: {},
      listProblems: [],
      listSteps: [],
			actionType: '',
			showConfirmation:  true
    }
  },

  mutations: {
    setAllModel(state, payload) {
      state.allModel = payload;
    },
    setAllErrorCode(state, payload) {
      state.allErrorCode = payload;
    },
    setAllIssue(state, payload) {
      state.allIssue = payload;
    },
    setReportDetail(state, payload) {
      state.reportDetail = payload;
    },
    setListProblems(state, payload) {
      state.listProblems = payload;
    },
    setListSteps(state, payload) {
      state.listSteps = payload;
    },
    setActionType(state, payload) {
      state.actionType = payload;
		},
		setShowConfirmation(state, payload) {
      state.showConfirmation = payload;
    }
  },

  actions: {
    async getListReports({ state, commit }, params = null) {
      const resApi = await this.$axios.$get(`api/v1/diagnosisSession/getListReport`, {params});
      return resApi;
    },
    async getAllModel({ state, commit }, params = null) {
      const resApi = await this.$axios.$get("api/v1/model/getAllModel", { params });
      if (resApi.status == 200) {
        commit("setAllModel", resApi.data);
      }
    },

    async getAllErrorCode({ state, commit }, params = null) {
      const resApi = await this.$axios.$get(`api/v1/errorDiagnosis/getAllErrorDiagnosis?modelId=${params}`);
      if (resApi.status == 200) {
        commit("setAllErrorCode", resApi.data);
      }
    },

    async getAllIssue({ state, commit }, params = null) {
      const resApi = await this.$axios.$get(`api/v1/issueDiagnosis/getAllIssueDiagnosis?modelId=${params}`);
      if (resApi.status == 200) {
        commit("setAllIssue", resApi.data);
      }
    },

    async getListAdvanceSearch({ state, commit }, params = null) {
      const resApi = await this.$axios.$get(`api/v1/diagnosisSession/searchReport`, {params});
      return resApi;
    },
    async getListProblems({ commit }, params) {
      const resApi = await this.$axios.$get(
        'api/v1/feedback/getListProblem', { params }
      );
      if(resApi.status == 200) {
        commit('setListProblems', resApi.data);
      }
    },
    async getReportDetail({ commit }, params) {
      const resApi = await this.$axios.$get('api/v1/diagnosisSession/getReportDetail', { params });
      if(resApi.status == 200) {
        commit('setReportDetail', resApi.data);
      }
    },
    async createNewBranch(_, params) {
      const resApi = await this.$axios.$post('api/v1/diagnosisSession/addNewBranchForDiagnosisStep', params);
      return resApi;
    },
    async deleteBranch(_, params) {
      const resApi = await this.$axios.$post('api/v1/diagnosisSession/deleteBranchForDiagnosisStep', params);
      return resApi;
    },
    async getListSteps({ commit }, params) {
      const resApi = await this.$axios.$get('api/v1/diagnosisSession/GetListFlowStep', { params });
      if(resApi.status == 200) {
        commit('setListSteps', resApi.data)
      }
    },
    changeActionType({ commit }, params) {
      commit('setActionType', params);
		},
		displayConfirmation({ commit }, params) {
			commit('setShowConfirmation', params);
		}
  }
}
