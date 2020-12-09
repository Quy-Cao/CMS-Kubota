
export default {
  namespaced: true,
  state() {
    return {
      cardInfo: {},
      diagnosisCardInfo: null,
      diagnosisCardData: {
        cardId: null,
        cardTypeId: null,
        bodyKey: "",
        isEndOfDiagnosis: 0
      }
    }
  },

  mutations: {
    setCardInfo(state, payload) {
      state.cardInfo = payload;
    },
    setDiagnosisCardInfo(state, payload) {
      state.diagnosisCardInfo = payload;
    },
    setDiagnosisCardData(state, payload) {
      state.diagnosisCardData = payload;
    }
  },

  actions: {
    async getListCards({ state, commit }, params = null) {
      const resApi = await this.$axios.$get(`api/v1/card/getListCard`, {
        params
      });
      return resApi;
    },

    async addCards({ state, commit }, params = null) {
      const resApi = await this.$axios.$post(
        "api/v1/card/addNewCard",
        params
      );
      return resApi;
    },

    async getCardById({ state, commit }, cardId = null) {
      const resApi = await this.$axios.$get(`api/v1/card/getInfoCard?cardId=${cardId}`);
      if (resApi.status == 200) {
        commit("setCardInfo", resApi.data);
      }
    },

    async editCards({ state, commit }, params = null) {
      const resApi = await this.$axios.$post(
        "api/v1/card/updateCard",
        params
      );
      return resApi;
    },

    async getInfoDiagnosisCard({ commit }, params = null) {
      const resApi = await this.$axios.$get(`api/v1/card/getInfoDiagnosisCard`, { params });
      if (resApi.status == 200) {
        commit("setDiagnosisCardInfo", resApi.data);
      }
    },

    async saveDiagnosisCard({}, params = null) {
      const resApi = await this.$axios.$post(
        "api/v1/card/updateDiagnosisCard",
        params
      );
      return resApi;
    },

    async duplicateCard({}, params = null) {
      const resApi = await this.$axios.$post(
        "api/v1/card/duplicateCard",
        params
      );
      return resApi;
    },

    async deleteCard({}, params = null) {
      const resApi = await this.$axios.$post(
        "api/v1/card/deleteCard",
        params
      );
      return resApi;
    }
  }
}
