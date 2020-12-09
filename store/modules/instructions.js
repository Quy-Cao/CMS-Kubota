export default {
  namespaced: true,
  state() {
    return {
      instructionInfo: {}
    }
  },

  mutations: {
    setInstructionInfo(state, payload) {
      state.instructionInfo = payload
    }
  },

  actions: {
    async getListInstructions({ state, commit }, params = null) {
      const resApi = await this.$axios.$get('api/v1/instruction/getListInstruction', {params});
      return resApi;
    },

    async addInstruction({ state, commit }, params = null) {
      const resApi = await this.$axios.$post(
        "api/v1/instruction/addNewInstruction",
        params
      );
      return resApi;
    },

    async deleteInstruction({ state, commit }, instructionId = null) {
      const resApi = await this.$axios.$post(`api/v1/instruction/deleteInstruction`, {
        instructionId
      });
      return resApi;
    },

    async getInstructionById({ state, commit }, instructionId = null) {
      const resApi = await this.$axios.$get(
        `api/v1/instruction/getInfoInstruction?instructionId=${instructionId}`
      );
      if (resApi.status == 200) {
        commit("setInstructionInfo", resApi.data);
      }
    },

    async editInstruction({ state, commit }, params = null) {
      const resApi = await this.$axios.$post(
        "api/v1/instruction/updateInstruction",
        params
      );

      return resApi;
    }
  }
}
