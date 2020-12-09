<template>
  <div>
    <div class="background-title-page">
      <h1 class="font-28px m-0"><strong>{{ $t('series.titlePageEdit') }}</strong></h1>
      <a-breadcrumb>
        <span slot="separator" class="ic-breadcrumb"><img src="../../../assets/images/line.svg"></span>
        <a-breadcrumb-item>
          <nuxt-link to="/series">
            <u>{{ $t('series.titleSeries') }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <nuxt-link :to="`/series/${seriesInfo.seriesId}`">
            <u>{{ getContentLocale(seriesInfo.names, getLocaleDefault(listLanguage)) }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          {{ $t('series.titlePageEdit') }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="bg-white px-3 py-4 box-content">
      <Editor isEdit="true" :init-data="seriesInfo">
      </Editor>
    </div>
  </div>
</template>
<script>
  import Editor from "~/components/series/editor.vue";
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
        seriesInfo: state => state.series.seriesInfo,
        listLanguage: state => state.languages.listLanguage
      })
    },
    async fetch({ store, params, error }) {
      await store.dispatch('series/getSeriesById', params.slug);
    },
  }

</script>