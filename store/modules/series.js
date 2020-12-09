export default {
  namespaced: true,
  state() {
    return {
      series: [],
      seriesInfo: {},
      seriesHasModel: null
    }
  },


  mutations: {
    setSeries(state, payload) {
      state.series = payload;
    },
    setSeriesInfo(state, payload) {
      state.seriesInfo = payload
    },
    setSeriesHasModel(state, payload) {
      state.seriesHasModel = payload
    }
  },


  actions: {
    async syncData({state, commit}, series) {
      console.log(series);
      // Do something
      // commit('setSeries', series);
    },


    async all({state, commit}, params = null) {
      const data = [];
      const resApi = await this.$axios.$get('api/v1/series/GetListSeries?productId=1', { params });
      if (resApi.status == 200) {
        commit('setSeries', resApi.data);
      }
      // Do something
    },

    async addSeries({ state, commit }, params = null) {
      // TODO: get productId when login
      params.productId = 1;
      const resApi = await this.$axios.$post('api/v1/series/AddNewSeries', params);
      return resApi;
    },

    async editSeries({ state, commit }, params = null) {
      // TODO: get productId when login
      params.productId = 1;
      const resApi = await this.$axios.$post('api/v1/series/UpdateSeries', params);
      return resApi;
    },

    async getSeriesById({ state, commit }, seriesId = null) {
      const resApi = await this.$axios.$get(`api/v1/series/GetInfoSeries?seriesId=${seriesId}`)
      if (resApi.status == 200) {
        commit('setSeriesInfo', resApi.data);
      }
    },

    async deleteSeries({}, seriesId = null) {
      return await this.$axios.$post(`api/v1/series/DeleteSeries`, { seriesId });
    },

    async getSeriesHasListModel({ state, commit }, seriesId = null) {
      const resApi = await this.$axios.$get(`api/v1/model/getListModel?seriesId=${seriesId}`);
      if (resApi.status == 200) {
        commit('setSeriesHasModel', resApi.data);
      }
    },
    async deleteThumbnail({}, seriesId = null) {
      console.log(seriesId);
      return await this.$axios.$post(`api/v1/series/deleteThumbnail`, { seriesId });
    },
    
    async updateCameraSetting({}, params = null) {
      return await this.$axios.$post('api/v1/product/updateCamSetting', params);
    },
  },


  getters: {
    total: state => {
      // Do something
      return state.series.length;
    },
  }
}
