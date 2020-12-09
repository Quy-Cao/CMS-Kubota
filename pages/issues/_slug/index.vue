<template>
  <div>
    <div class="mb-3">
      <div>
        <h1 class="m-0">
          <strong class="font-28px mr-3">{{ getContentLocale(issueDiagnosis.names, getLocaleDefault(listLanguage)) }}</strong>
          <span class="font-18px txt-gray">{{ getContentLocale(issueDiagnosis.modelNames, getLocaleDefault(listLanguage)) }}</span>
          <nuxt-link :to="`/issues/${issueDiagnosis.iCategoryId}/edit`" class="font-14px ml-2" v-if="!$route.query.version">
            <u>{{ $t('commonText.actionEdit') }}</u>
          </nuxt-link>
          <a class="font-14px ml-2" @click="handleDuplicate" v-if="!$route.query.version"><u>{{ $t('commonText.actionDuplicate') }}</u></a>
        </h1>
        <a-breadcrumb>
          <span slot="separator" class="ic-breadcrumb"><img src="../../../assets/images/line.svg"></span>
          <a-breadcrumb-item>
            <nuxt-link to="/series"><u>Series</u></nuxt-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            <nuxt-link :to="`/series/${issueDiagnosis.seriesId}`">
              <u>{{ getContentLocale(issueDiagnosis.seriesNames, getLocaleDefault(listLanguage)) }}</u>
            </nuxt-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            <nuxt-link :to="`/issues?modelId=${issueDiagnosis.modelId}${$route.query.version ? `&version=${$route.query.version}` : ''}`">
              <u>{{ getContentLocale(issueDiagnosis.modelNames, getLocaleDefault(listLanguage)) }}</u>
            </nuxt-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            {{ getContentLocale(issueDiagnosis.names, getLocaleDefault(listLanguage)) }}
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </div>
    <DiagnosisFlow :typeModel="TYPE_MODELS.ISSUES"></DiagnosisFlow>
    <div class="mt-3" v-if="!issueDiagnosis.publishVersion">
      <span @click="showConfirmDelete" style="cursor: pointer"><u class="txt-danger-bold">{{ $t('issues.deleteIssue') }}</u></span>
    </div>
  </div>
</template>
<script>
  import { mapActions, mapState, mapMutations } from "vuex";
  import DiagnosisFlow from "~/components/models/diagnosisFlow";
  import { TYPE_MODELS } from "~/plugins/constant";

  export default {
    middleware: ['ktcUsers'],
    components: {
      DiagnosisFlow,
    },
    data() {
      return {
        TYPE_MODELS
      }
    },
    computed: {
      ...mapState({
        listLanguage: state => state.languages.listLanguage,
        issueDiagnosis: state => state.issues.issueDiagnosis
      })
    },
    async fetch({ store, params, route }) {
      const { modelId } = route.query;
      await store.dispatch('issues/getIssueDiagnosis', params.slug);
    },
    methods: {
      ...mapActions({
        getIssueDiagnosis: 'issues/getIsueDiagnosis',
        duplicateIssueDiagnosisFlow: 'issues/duplicateIssueDiagnosisFlow',
        deleteIssueDiagnosis: 'issues/deleteIssueDiagnosis'
      }),
      handleDuplicate() {
        this.$confirm({
          title: this.$t('titleFormModal.messDuplicateIssueDiagnosis'),
          onOk: async () => {
            const { iCategoryId, modelId } = this.issueDiagnosis;
            const resDuplicate = await this.duplicateIssueDiagnosisFlow({ iCategoryId });
            if (resDuplicate.status == 200) {
              this.$router.push(`/issues?modelId=${modelId}`);
            } else {
              this.$warning({
                title: this.$t('titleFormModal.errorDuplicate'),
              });
            }
          }
        });
      },
      showConfirmDelete() {
        this.$confirm({
          title: this.$t('titleFormModal.messDeleteIssue'),
          onOk: async () => {
            const { iCategoryId, modelId } = this.issueDiagnosis;
            const resDelete = await this.deleteIssueDiagnosis({ iCategoryId });
            if (resDelete.status == 200) {
              this.$router.push(`/issues?modelId=${modelId}`);
            } else {
              this.$warning({
                title: this.$t('titleFormModal.errorDeleteIssue'),
              });
            }
          }
        });
      }
    }
  }
</script>
