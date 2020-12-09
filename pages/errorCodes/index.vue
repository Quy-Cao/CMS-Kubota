<template>
  <div>
    <div class="background-title-page d-flex">
      <div style="flex-grow: 1">
        <h1 class="m-0">
          <strong class="font-28px mr-3">{{ getContentLocale(modelInfo.names, getLocaleDefault(listLanguage)) }}</strong>
          <span class="font-18px txt-gray">{{ getContentLocale(modelInfo.distributorNames, getLocaleDefault(listLanguage)) }}</span>
          <nuxt-link :to="`/models/${modelInfo.modelId}/edit`" class="font-14px ml-2" v-if="!$route.query.version">
            <u>{{ $t('errorCodes.linkEdit') }}</u>
          </nuxt-link>
        </h1>
        <a-breadcrumb>
          <span slot="separator" class="ic-breadcrumb"><img src="../../assets/images/line.svg"></span>
          <a-breadcrumb-item>
            <nuxt-link to="/series"><u>{{ $t('errorCodes.titleSeries') }}</u></nuxt-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            <nuxt-link :to="`/series/${modelInfo.seriesId}`"><u>{{ getContentLocale(modelInfo.seriesNames, getLocaleDefault(listLanguage)) }}</u></nuxt-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            {{ getContentLocale(modelInfo.names, getLocaleDefault(listLanguage)) }}
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      <div>
        <span class="font-weight-bold mr-1">{{ $t('errorCodes.txtLatestVersion') }}: {{ maxVersion.maxVersion }}</span>
        <nuxt-link :to="`/versions?modelId=${modelInfo.modelId}`">
          <u>{{ $t('errorCodes.txtManageVersion') }}</u>
        </nuxt-link>
      </div>
    </div>
    <div class="bg-white px-3 py-4 box-content">
      <a-tabs :default-active-key="TYPE_MODELS.ERRORCODES" @change="handleChangeTab">
        <a-tab-pane :key="TYPE_MODELS.ERRORCODES" :tab="$t('errorCodes.tabErrorCodes')">
          <list-model :columns="columns" :types="types" :listLanguage="listLanguage" :modelInfo="modelInfo"/>
        </a-tab-pane>
        <a-tab-pane :key="TYPE_MODELS.ISSUES" :tab="$t('errorCodes.tabIssues')">

        </a-tab-pane>
      </a-tabs>
    </div>
    <div class="mt-3">
      <span @click="showConfirmDelete" style="cursor: pointer" v-if="!$route.query.version"><u class="txt-danger-bold">{{ $t('errorCodes.DeleteModel') }}</u></span>
    </div>
  </div>
</template>
<script>
  import { mapState, mapActions } from "vuex";
  import { TYPE_MODELS } from "~/plugins/constant.js";
  import { getStatusName } from "~/plugins/utils.js";
  import listModel from '~/components/models/listModel.vue';
  export default {
    middleware: ['ktcUsers'],
    layout: "default",
    components: {
      listModel
    },
    data() {
      const columns = [
        {
          title: this.$t('errorCodes.titleErrorCode'),
          dataIndex: 'nameModel',
          key: 'nameModel',
          scopedSlots: { customRender: 'nameModel' },
        },
        {
          title: this.$t('errorCodes.titleErrorName') ,
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'name' },
          width: '25%'
        },
        {
          title: this.$t('errorCodes.titleStatus')  ,
          dataIndex: 'isDraft',
          key: 'isDraft',
          scopedSlots: { customRender: 'isDraft' },
          width: '200px'
        },
        {
          title: this.$t('listModel.txtSavedBy')  ,
          dataIndex: 'savedBy',
          key: 'savedBy',
          scopedSlots: { customRender: 'savedBy' },
          width: '15%'
        },
        {
          title: this.$t('listModel.txtPublishVersion')  ,
          dataIndex: 'publishVersion',
          key: 'publishVersion',
          scopedSlots: { customRender: 'publishVersion' },
          width: '10%'
        },
        {
          title: '',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          width: '50px'
        },
      ]
      return {
        columns,
        TYPE_MODELS,
        types: TYPE_MODELS.ERRORCODES
      };
    },
    computed: {
      ...mapState({
        modelInfo: state => state.models.modelInfo,
        listLanguage: state => state.languages.listLanguage,
        maxVersion: state => state.versions.maxVersion,
      })
    },
    async fetch({ store, params, route }) {
      const { modelId } = route.query;
      await store.dispatch('models/getModelById', modelId);
      await store.dispatch('versions/getMaxVersion', modelId);
    },
    methods: {
      ...mapActions({
        deleteModel: 'models/deleteModel',
      }),
      showConfirmDelete() {
        this.$confirm({
          title: this.$t('titleFormModal.titleConfirmDelete'),
          onOk: async () => {
            const resDelete = await this.deleteModel(this.modelInfo.modelId);
            if (resDelete.status == 200) {
              this.$router.push(`/series/${this.modelInfo.seriesId}`);
            } else {
              this.$warning({
                title: this.$t('titleFormModal.titleWarningDelete'),
              });
            }
          }
        });
      },
      handleChangeTab(key) {
        if(key == TYPE_MODELS.ERRORCODES) {
          this.$router.push(`/errorCodes?modelId=${this.modelInfo.modelId}${this.$route.query.version ? `&version=${this.$route.query.version}` : ''}`)
        } else {
          this.$router.push(`/issues?modelId=${this.modelInfo.modelId}${this.$route.query.version ? `&version=${this.$route.query.version}` : ''}`)
        }
      }
    }
  }
</script>