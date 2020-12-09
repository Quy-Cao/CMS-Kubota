export default {
  namespaced: true,
  state() {
    return {
      modelInfo: null,
      totalModelsOfSeries: 0,
      diagnosisModelData: {
        instructionNames: [],
        flowStep: null
      },
      stepId: 1,
      featureStepId: 1,
      choiceOrder: null,
      isReplace: false,
    }
  },

  mutations: {
    setModelInfo(state, payload) {
      state.modelInfo = payload;
    },
    setTotalModelsOfSeries(state, payload) {
      state.totalModelsOfSeries = payload;
    },
    setDiagnosisModelData(state, payload) {
      state.diagnosisModelData = payload;
    },
    setStepId(state, payload) {
      state.stepId = payload
    },
    setFeatureStepId(state, payload) {
      state.featureStepId = payload
    },
    setChoiceOder(state, payload) {
      state.choiceOrder = payload
    },
    setIsReplace(state, payload) {
      state.isReplace = payload
    }
  },

  actions: {
    async addModel({ state, commit }, params = null) {
      const resApi = await this.$axios.$post('api/v1/model/AddNewModel', params);
      return resApi;
    },
    async editModel({ state, commit }, params = null) {
      const resApi = await this.$axios.$post('api/v1/model/UpdateModel', params);
      return resApi;
    },
    async getModelById({ state, commit }, modelId = null) {
      const resApi = await this.$axios.$get(`api/v1/model/GetInfoModel?modelId=${modelId}`)
      if (resApi.status == 200) {
        commit('setModelInfo', resApi.data);
      }
    },
    async deleteModel({}, modelId = null) {
      return await this.$axios.$post(`api/v1/model/deleteModel`, { modelId });
    },
    async countModelsOfSeries({commit}, seriesId = null) {
      const resApi = await this.$axios.$get(`api/v1/model/getTotalModel?seriesId=${seriesId}`);
      if (resApi.status == 200) {
        commit('setTotalModelsOfSeries', resApi.data.totalModel);
      }
    },
    
    async getBlobSasUri() {
      const resApi = await this.$axios.$get('api/v1/model/getBlobSasUri')
      return resApi;
    },
  }
}
