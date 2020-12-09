<template>
  <div>
    <div class="background-title-page">
      <h1 class="font-28px m-0"><strong>{{ $t('issues.titlePageEdit') }}</strong></h1>
      <a-breadcrumb>
        <span slot="separator" class="ic-breadcrumb"><img src="../../../assets/images/line.svg"></span>
        <a-breadcrumb-item>
          <nuxt-link to="/series">
            <u>{{ $t('issues.titleSeries') }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <nuxt-link :to="`/series/${issueInfo.seriesId}`">
            <u>{{ getContentLocale(issueInfo.seriesNames, getLocaleDefault(listLanguage)) }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <nuxt-link :to="`/issues?modelId=${issueInfo.modelId}`">
            <u>{{ getContentLocale(issueInfo.modelNames, getLocaleDefault(listLanguage)) }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          {{ $t('issues.titlePageEdit') }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="bg-white px-3 py-4 box-content">
      <Editor isEdit="true" :series-id="issueInfo.seriesId" :model-id="issueInfo.modelId" :init-data="dataEdit" >
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
        dataEdit: null
      };
    },
    computed: {
      ...mapState({
        issueInfo: state => state.issues.issueInfo,
        listLanguage: state => state.languages.listLanguage
      })
    },
    async fetch({ store, params, route }) {
      await store.dispatch('issues/getIssueByModelId',
        {
          iCategoryId: params.slug
        }
      );
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
          const dataName = {
            locale,
            nameLG: language.name,
            isRequired
          }
          names.push({...dataName, content: this.getContentLocale(this.issueInfo.names, language.locale)});
          searchNames.push({...dataName, content: this.getContentLocale(this.issueInfo.searchNames, language.locale),});
        });
        this.dataEdit = {
          ...this.issueInfo,
          names,
          searchNames
        }
      },
    }
  }

</script>