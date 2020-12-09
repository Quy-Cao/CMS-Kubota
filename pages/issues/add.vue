<template>
  <div>
    <div class="background-title-page">
      <h1 class="m-0">
        <strong class="font-28px">{{ $t('issues.btnAdd') }}</strong>
      </h1>
      <a-breadcrumb>
        <span slot="separator" class="ic-breadcrumb"><img src="../../assets/images/line.svg"></span>
        <a-breadcrumb-item>
          <nuxt-link to="/series">
            <u>{{ $t('issues.titleSeries') }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <nuxt-link :to="`/series/${modelInfo.seriesId}`">
            <u>{{ getContentLocale(modelInfo.seriesNames, getLocaleDefault(listLanguage)) }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <nuxt-link :to="`/issues?modelId=${modelInfo.modelId}`">
            <u>{{ getContentLocale(modelInfo.names, getLocaleDefault(listLanguage)) }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('issues.btnAdd') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="bg-white px-3 py-4 box-content">
      <Editor :series-id="modelInfo.seriesId" :model-id="modelInfo.modelId" :init-data="blankData" >
      </Editor>
    </div>
  </div>
</template>
<script>
  import Editor from "~/components/issues/editor.vue";
  import { mapState } from "vuex";

  export default {
    middleware: ['ktcUsers'],
    layout: "default",
    components: {
      Editor
    },
    data() {
      return {
        blankData: {
        }
      };
    },
    computed: {
      ...mapState({
        modelInfo: state => state.models.modelInfo,
        listLanguage: state => state.languages.listLanguage
      })
    },
    async fetch({ store, params, error, route }) {
      const { modelId } = route.query;
      await store.dispatch('models/getModelById', modelId);
    },
    beforeMount() {
      this.setData();
    },
    methods: {
      setData() {
        let names = [];
        let searchNames = [];
        _.forEach(this.listLanguage, language => {
          const { locale, name, isRequired } = language;
          let dataName = {
            locale,
            content: '',
            nameLG: language.name,
            isRequired
          };
          searchNames.push({...dataName});
          names.push(dataName);
        })
        this.blankData = {
          ...this.blankData,
          names,
          searchNames,
          modelId: this.modelInfo.modelId
        }
      },
    }
  }
</script>