export default {
  namespaced: true,
  state() {
    return {
      cardTypes: [],
      cardTypeInfo: null
    };
  },

  mutations: {
    setCardType(state, payload) {
      state.cardTypes = payload;
    },
    setCardTypeInfo(state, payload) {
      state.cardTypeInfo = payload;
    }
  },

  actions: {
    async syncData({ state, commit }, cardType) {
      console.log(cardType);
    },
    async getListCardType({ state, commit }, params = null) {
      const resApi = await this.$axios.$get("api/v1/cardType/getListCardType", {
        params
      });
      if (resApi.status == 200) {
        commit("setCardType", resApi.data);
      }
      // Do something
    },
    async deleteCardType({ state, commit }, cardTypeId = null) {
      const resApi = await this.$axios.$post(`api/v1/cardType/deleteCardType`, {
        cardTypeId
      });
      return resApi;
    },
    async addCardType({ state, commit }, params = null) {
      const resApi = await this.$axios.$post(
        "api/v1/cardType/addNewCardType",
        params
      );
      return resApi;
    },
    async getCardTypeById({ state, commit }, cardTypeId = null) {
      const resApi = await this.$axios.$get(
        `api/v1/cardType/getInfoCardType?cardTypeId=${cardTypeId}`
      );
      if (resApi.status == 200) {
        commit("setCardTypeInfo", resApi.data);
      }
    },
    async editCardType({ state, commit }, params = null) {
      const resApi = await this.$axios.$post(
        "api/v1/cardType/updateCardType",
        params
      );

      return resApi;
    }
  },

  getters: {
    total: state => {
      // Do something
      return state.cardTypes.length;
    }
  }
};
