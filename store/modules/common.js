export default {
  namespaced: true,
  state() {
    return {
      productId: null,
      isShow: false,
      isShowPreview: false,
      queryDataChoose: {
        pageNumber: 1
      }
    }
  },

  mutations: {
    setProductId(state, payload) {
      state.productId = payload;
    },
    setShowModal(state, payload) {
      state.isShow = payload;
    },
    setShowPreview(state, payload) {
      state.isShowPreview = payload;
    }
  },

  actions: {
    async getProductId({state, commit}, params = null) {
      const resApi = await this.$axios.$get('api/v1/product/GetProductInfo', { params });
      if (resApi.status == 200) {
        commit('setProductId', resApi.data);
      }
      // Do something
    }
  }
}
