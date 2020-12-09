export default {
  namespaced: true,
  state() {
    return {
      listDisplayModel: null,
      Model3DInfo: null,
      nameDisplayModel: null,
      listColor: null,
      model3DDetail: null
    }
  },

  mutations: {
    setAllModel3D(state, payload) {
      state.listDisplayModel = payload;
    },
    setModel3DInfo(state, payload) {
      state.Model3DInfo = payload;
    },
    setModel3DDetail(state, payload) {
      state.model3DDetail = payload;
    },
    setListColor(state, payload) {
      state.listColor = payload;
    },
    setNameDisplayModel(state, payload) {
      state.nameDisplayModel = payload;
    }
  },

  actions: {
    async getListModel3D({ state, commit }, params = null) {
      const resApi = await this.$axios.$get('api/v1/displayModel/getListDisplayModel', {params});
      if (resApi.status == 200) {
        commit('setAllModel3D', resApi.data);
      }
      return resApi;
    },

    async getListPartModel({ state, commit }, params = null) {
      const resApi = await this.$axios.$get(`api/v1/displayModel/getListPartModel`, { params });
      if (resApi.status == 200) {
        commit('setModel3DInfo', resApi.data);
      }
    },

    async getListColor({ state, commit }, params = null) {
      const resApi = await this.$axios.$get('api/v1/displayModel/getListColor', params);
      if (resApi.status == 200) {
        commit('setListColor', resApi.data);
      }
    },

    async deleteModel3D({ state, commit }, displayModelId = null) {
      const resApi = await this.$axios.$post('api/v1/displayModel/deleteDisplayModel', {
        displayModelId
      });
      return resApi;
    },


    async deletePartModel({ state, commit, dispatch }, params = null) {
      const resApi = await this.$axios.$post('api/v1/displayModel/deletePartModel', params);
      if(resApi.status == 200) {
        dispatch('getModel3DDetail', params.displayModelId)
      }
      return resApi;
    },

    async addModel3D({ state, commit }, params = null) {
      const resApi = await this.$axios.$post('api/v1/displayModel/addNewDisplayModel', params);
      return resApi;
    },

    async editModel3D({ state, commit }, params = null) {
      const resApi = await this.$axios.$post('api/v1/displayModel/updateDisplayModel', params);
      return resApi;
    },

    async addModelPart({ state, commit, dispatch }, params = null) {
      const resApi = await this.$axios.$post('api/v1/displayModel/addNewPartModel', params);
      if(resApi.status == 200) {
        dispatch('getModel3DDetail', params.displayModelId)
      }
      return resApi;
    },

    async editModelPart({ state, commit, dispatch }, params = null) {
      const resApi = await this.$axios.$post('api/v1/displayModel/updatePartModel', params);
      if(resApi.status == 200) {
        dispatch('getModel3DDetail', params.displayModelId)
      }
      return resApi;
    },

    async getModel3DDetail({ state, commit }, displayModelId = null) {
      const resApi = await this.$axios.$get(`api/v1/displayModel/getInfoDisplayModel?displayModelId=${displayModelId}`);
      if (resApi.status == 200) {
        commit('setModel3DDetail', resApi.data);
      }
      return resApi;
    },

    async getInfoPartModel({ state, commit }, partModelId = null) {
      const resApi = await this.$axios.$get(`api/v1/displayModel/getInfoPartModel?partModelId=${partModelId}`);
      return resApi;
    }
  }
}
