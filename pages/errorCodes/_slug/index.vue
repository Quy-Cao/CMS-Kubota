<template>
  <div>
    <div class="mb-3">
      <div>
        <h1 class="m-0">
          <strong class="font-28px mr-3">{{ errorCodeDiagnosis.errorCode }} {{ getContentLocale(errorCodeDiagnosis.names, getLocaleDefault(listLanguage)) }}</strong>
          <span class="font-18px txt-gray">{{ getContentLocale(errorCodeDiagnosis.modelNames, getLocaleDefault(listLanguage)) }}</span>
          <nuxt-link :to="`/errorCodes/${errorCodeDiagnosis.errorCodeId}/edit?modelId=${errorCodeDiagnosis.modelId}`" class="font-14px ml-2" v-if="!$route.query.version">
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
            <nuxt-link :to="`/series/${errorCodeDiagnosis.seriesId}`">
              <u>{{ getContentLocale(errorCodeDiagnosis.seriesNames, getLocaleDefault(listLanguage)) }}</u>
            </nuxt-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            <nuxt-link :to="`/errorCodes?modelId=${errorCodeDiagnosis.modelId}${$route.query.version ? `&version=${$route.query.version}` : ''}`">
              <u>{{ getContentLocale(errorCodeDiagnosis.modelNames, getLocaleDefault(listLanguage)) }}</u>
            </nuxt-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            {{ errorCodeDiagnosis.errorCode }} {{ getContentLocale(errorCodeDiagnosis.names, getLocaleDefault(listLanguage)) }}
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </div>
    <DiagnosisFlow :typeModel="TYPE_MODELS.ERRORCODES"></DiagnosisFlow>
    <div class="mt-3" v-if="!errorCodeDiagnosis.publishVersion">
      <span @click="showConfirmDelete" style="cursor: pointer"><u class="txt-danger-bold">{{ $t('errorCodes.deleteErrorCode') }}</u></span>
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
        errorCodeDiagnosis: state => state.errorCodes.errorCodeDiagnosis
      })
    },
    async fetch({ store, params, route }) {
      const { modelId } = route.query;
      await store.dispatch('errorCodes/getErrorCodeDiagnosis',
        {
          modelId,
          errorCodeId: params.slug
        }
      );
    },
    methods: {
      ...mapActions({
        getErrorCodeDiagnosis: 'errorCodes/getErrorCodeDiagnosis',
        duplicateErrorDiagnosisFlow: 'errorCodes/duplicateErrorDiagnosisFlow',
        deleteErrorDiagnosis: 'errorCodes/deleteErrorDiagnosis'
      }),
      handleDuplicate() {
        this.$confirm({
          title: this.$t('titleFormModal.messDuplicateErrorDiagnosis'),
          onOk: async () => {
            const { errorCodeId, modelId } = this.errorCodeDiagnosis;
            const resDuplicate = await this.duplicateErrorDiagnosisFlow({ errorCodeId, modelId });
            if (resDuplicate.status == 200) {
              this.$router.push(`/errorCodes?modelId=${modelId}`);
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
          title: this.$t('titleFormModal.messDeleteErrorCode'),
          onOk: async () => {
            const { errorCodeId, modelId } = this.errorCodeDiagnosis;
            const resDelete = await this.deleteErrorDiagnosis({ errorCodeId, modelId });
            if (resDelete.status == 200) {
              this.$router.push(`/errorCodes?modelId=${modelId}`);
            } else {
              this.$warning({
                title: this.$t('titleFormModal.errorDeleteErrorCode'),
              });
            }
          }
        });
      },
    }
  }
</script>
