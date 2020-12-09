<template>
  <div>
    <div class="background-title-page">
      <h1 class="font-28px m-0"><strong>{{ $t('models.titlePageEdit') }}</strong></h1>
      <a-breadcrumb>
        <span slot="separator" class="ic-breadcrumb"><img src="../../../assets/images/line.svg"></span>
        <a-breadcrumb-item>
          <nuxt-link to="/series">
            <u>{{ $t('series.titleSeries') }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <nuxt-link :to="`/series/${modelInfo.seriesId}`">
            <u>{{ getContentLocale(modelInfo.seriesNames, getLocaleDefault(listLanguage)) }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <nuxt-link :to="`/errorCodes?modelId=${modelInfo.modelId}`">
            <u>{{ getContentLocale(modelInfo.names, getLocaleDefault(listLanguage)) }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          {{ $t('models.titlePageEdit') }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="bg-white px-3 py-4 box-content">
      <Editor isEdit="true" :init-data="modelInfo">
      </Editor>
    </div>
  </div>
</template>
<script>
  import Editor from "~/components/models/editor.vue";
  import { mapState } from "vuex";

  export default {
    middleware: ['ktcUsers'],
    layout: "default",
    components: {
      Editor
    },
    data() {
      return {

      };
    },
    computed: {
      ...mapState({
        modelInfo: state => state.models.modelInfo,
        listLanguage: state => state.languages.listLanguage
      })
    },
    async fetch({ store, params, error }) {
      await store.dispatch('models/getModelById', params.slug);
    },
  }

</script>