export default {
  namespaced: true,

  actions: {
    async getListIssueCategories() {
      const resApi = await this.$axios.$get(
        `api/v1/issueCategory/getListCategory`
      );
      return resApi;
    },
    async addIssueCategory(_, params){
      const resApi = await this.$axios.$post('api/v1/issueCategory/addNewCategory', params);
      return resApi;
    },
    async deleteIssueCategory(_, params){
      const resApi = await this.$axios.$post('api/v1/issueCategory/deleteCategory', params);
      return resApi;
    },
    async getIssueCategoryInfo(_, params){
      const resApi = await this.$axios.$get('api/v1/issueCategory/getInfoCategory', { params });
      return resApi;
    },
    async updateIssueCategory(_, params){
      const resApi = await this.$axios.$post('api/v1/issueCategory/updateCategory', params);
      return resApi;
    },
    async getAllIssueCategories() {
      const resApi = await this.$axios.$get(
        `api/v1/issueCategory/getAllCategory`
      );
      return resApi;
    },
  },
};
