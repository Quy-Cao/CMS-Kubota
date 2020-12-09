export default {
  namespaced: true,
  state() {
    return {
      buttonInfo: {}
    }
  },

  mutations: {
    setButtonInfo(state, payload) {
      state.buttonInfo = {...payload}
    }
  },

  actions: {
    async getListButtons({ state, commit }, params = null) {
      const resApi = await this.$axios.$get('api/v1/choiceDesc/getListChoiceDesc', { params });
      return resApi;
    },
    
    async deleteButtons({ state, commit }, choiceCode = null) {
      const resApi = await this.$axios.$post(`api/v1/choiceDesc/deleteChoiceDesc`, {
        choiceCode
      });
      return resApi;
    },
    
    async addButtons({ state, commit }, params = null) {
      const resApi = await this.$axios.$post(
        "api/v1/choiceDesc/addNewChoiceDesc",
        params
      );
      return resApi;
    },

    async getButtonById({ state, commit }, choiceCode = null) {
      const resApi = await this.$axios.$get(`api/v1/choiceDesc/getInfoChoiceDesc?choiceCode=${choiceCode}`);
      if (resApi.status == 200) {
        commit("setButtonInfo", resApi.data);
      }
    },

    async editButtons({ state, commit }, params = null) {
      const resApi = await this.$axios.$post(
        "api/v1/choiceDesc/updateChoiceDesc",
        params
      );
      return resApi;
    }
  }
}
