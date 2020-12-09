export default {
  namespaced: true,
  state() {
    return {
      listLanguage: null,
      languageInfo: {}
    };
  },

  mutations: {
    setLanguage(state, payload) {
      state.listLanguage = payload;
    },
    setLanguageInfo(state, payload) {
      state.languageInfo = payload;
    }
  },

  actions: {
    async syncData({ state, commit }, languages) {
      console.log(languages);
    },

    async getListLanguage({ state, commit }, params = null) {
      const resApi = await this.$axios.$get("api/v1/language/getListLanguage", { params });
      if (resApi.status == 200) {
        commit("setLanguage", resApi.data);
      }
    },

    async deleteLanguage({ state, commit, dispatch }, locale = null) {
      const resApi = await this.$axios.$post(`api/v1/language/deleteLanguage`, { locale });
      if (resApi.status == 200) {
        await dispatch('getListLanguage');
      }
      return resApi;
    },

    async addLanguage({ state, commit, dispatch }, params = null) {
      const resApi = await this.$axios.$post("api/v1/language/addNewLanguage",params);
      if (resApi.status == 200) {
        await dispatch('getListLanguage');
      }
      return resApi;
    },

    async getLanguageById({ state, commit }, locale = null) {
      const resApi = await this.$axios.$get(`api/v1/language/getInfoLanguage?locale=${locale}`);
      if (resApi.status == 200) {
        commit("setLanguageInfo", resApi.data);
      }
    },

    async editLanguage({ state, commit, dispatch }, params = null) {
      const resApi = await this.$axios.$post("api/v1/language/updateLanguage",params);
      if (resApi.status == 200) {
        await dispatch('getListLanguage');
      }
      return resApi;
    }
  },
};
