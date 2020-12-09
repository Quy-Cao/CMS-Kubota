<template>
  <div>
    <div class="background-title-page">
      <h1 class="font-28px m-0"><strong>{{ $t('errorCodes.titlePageEdit') }}</strong></h1>
      <a-breadcrumb>
        <span slot="separator" class="ic-breadcrumb"><img src="../../../assets/images/line.svg"></span>
        <a-breadcrumb-item>
          <nuxt-link to="/series"><u>{{ $t('errorCodes.titleSeries') }}</u></nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <nuxt-link :to="`/series/${errorCodeInfo.seriesId}`">
            <u>{{ getContentLocale(errorCodeInfo.seriesNames, getLocaleDefault(listLanguage)) }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <nuxt-link :to="`/errorCodes?modelId=${errorCodeInfo.modelId}`">
            <u>{{ getContentLocale(errorCodeInfo.modelNames, getLocaleDefault(listLanguage)) }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          {{ $t('errorCodes.titlePageEdit') }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="bg-white px-3 py-4 box-content">
      <Editor isEdit="true" :series-id="errorCodeInfo.seriesId" :model-id="errorCodeInfo.modelId" :init-data="dataEdit" >
      </Editor>
    </div>
  </div>
</template>
<script>
  import Editor from "~/components/error-codes/editor.vue";
  import { mapState } from "vuex";

   export default {
    middleware: ['ktcUsers'],
    layout: "default",
    components: {
      Editor
    },
    data() {
      return {
        dataEdit: null
      };
    },
    computed: {
      ...mapState({
        errorCodeInfo: state => state.errorCodes.errorCodeInfo,
        listLanguage: state => state.languages.listLanguage
      })
    },
    async fetch({ store, params, route }) {
      const { modelId } = route.query;
      await store.dispatch('errorCodes/getErrorCodeByModelId',
        {
          modelId,
          errorCodeId: params.slug
        }
      );
    },
    beforeMount() {
      this.setData();
    },
    methods: {
      setData() {
        let names = [];
        _.forEach(this.listLanguage, language => {
          const { locale, name, isRequired } = language;
          const dataName = {
            locale,
            content: this.getContentLocale(this.errorCodeInfo.names, language.locale),
            nameLG: language.name,
            isRequired
          }
          names.push(dataName);
        });
        this.dataEdit = {
          ...this.errorCodeInfo,
          names
        }
      },
    }
  }

</script>