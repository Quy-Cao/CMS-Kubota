export default {
  namespaced: true,
  state() {
    return {
      distributors: null,
      distributorInfo: {}
    }
  },
  
  mutations: {
    setDistributors(state, payload) {
      state.distributors = payload;
    },
    setDistributorInfo(state, payload) {
      state.distributorInfo = payload;
    }
  },
  
  actions: { 
    async syncData({state, commit}, distributors) {
      console.log(distributors);
    },
    async getListDistributors({state, commit}, params = null) {
      const resApi = await this.$axios.$get('api/v1/distributor/GetListDistributor', { params });
      if (resApi.status == 200) {
        commit('setDistributors', resApi.data);
      }
    },
    async deleteDistributor({ state, commit }, distributorId = null) {
      const resApi = await this.$axios.$post(`api/v1/distributor/deleteDistributor`, {
        distributorId
      });
      return resApi;
    },
    async addDistributor({ state, commit }, params = null) {
      const resApi = await this.$axios.$post(
        "api/v1/distributor/addNewDistributor",
        params
      );
      return resApi;
    },
    async getDistributorById({ state, commit }, distributorId = null) {
      const resApi = await this.$axios.$get(
        `api/v1/distributor/getInfoDistributor?id=${distributorId}`
      );
      if (resApi.status == 200) {
        commit("setDistributorInfo", resApi.data);
      }
    },
    async editDistributor({ state, commit }, params = null) {
      const resApi = await this.$axios.$post(
        "api/v1/distributor/updateDistributor",
        params
      );
      return resApi;
    }
  }
}
