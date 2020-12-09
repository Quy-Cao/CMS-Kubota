<template>
  <div class="container">
    <div class="background-title-page">
      <h1 class="font-28px">
        <strong>{{ $t("issueCategories.titlePage") }}</strong>
      </h1>
    </div>
    <div class="p-2 pb-5 bg-white box-content">
      <p class="txt-right">
        <nuxt-link to="/issueCategories/add">
          <a-button type="primary">
            <span class="font-weight-bold">{{
              $t("issueCategories.btnAdd")
            }}</span>
          </a-button>
        </nuxt-link>
      </p>
      <a-table
        :columns="columns"
        :data-source="data"
        :defaultExpandAllRows="true"
        :pagination="false"
        childrenColumnName="categoryChilds"
        rowKey="categoryId"
        v-if="isCreated"
        class="table-action"
      >
        <span slot="names" class="font-weight-bold" slot-scope="names">{{
          getContentLocale(names, getLocaleDefault(listLanguage))
        }}</span>
        <span slot="savedBy" class="font-16px" slot-scope="text" >{{ text }}</span>
        <div slot="action" class="txt-right pr-3" slot-scope="action">
          <nuxt-link :to="`/issueCategories/${action.categoryId}/edit`">
            <u>{{ $t("commonText.actionEdit") }}</u>
          </nuxt-link>
          <a
            class="ml-4 txt-danger-bold"
            @click="showConfirmDeleteCategory(action.categoryId)"
          >
            <u>{{ $t("commonText.actionDelete") }}</u>
          </a>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import store from '~/store';
import { Button } from 'ant-design-vue';
import { mapState, mapActions } from 'vuex';

export default {
  middleware: ['ktcUsers'],
  layout: 'default',
  data() {
    return {
      columns: [
        {
          title: this.$t('issueCategories.tableTitle'),
          dataIndex: 'names',
          key: 'names',
          scopedSlots: { customRender: 'names' },
        },
        {
          title: this.$t('listModel.txtSavedBy') ,
          dataIndex: 'savedBy',
          key: 'savedBy',
          scopedSlots: { customRender: 'savedBy' },
          width: '200px'
        },
        {
          key: 'action',
          scopedSlots: { customRender: 'action' },
          width: '150px',
        },
      ],
      data: [],
      isCreated: false
    };
  },
  async created() {
    const response = await this.getListIssueCategories();
    this.data = response.data;
    this.isCreated = true;
  },
  computed: {
    ...mapState({
      listLanguage: (state) => state.languages.listLanguage,
    }),
  },
  methods: {
    ...mapActions({
      getListIssueCategories: 'issueCategories/getListIssueCategories',
      deleleIssueCategory: 'issueCategories/deleteIssueCategory'
    }),
    showConfirmDeleteCategory(categoryId) {
      this.$confirm({
        title: this.$t('issueCategories.deleteConfirm'),
        onOk: async () => {
          let resDelete = await this.deleleIssueCategory({ categoryId });
          if (resDelete.status == 200) {
            const response = await this.getListIssueCategories();
            this.data = response.data;
          } else {
            this.$warning({
              title: this.$t('issueCategories.deleteFail'),
            });
          }
        },
      });
    },
  },
};
</script>
