<template>
  <div>
    <div class="background-title-page">
      <h1 class="font-28px m-0"><strong>{{ $t('models.titlePageAdd') }}</strong></h1>
      <a-breadcrumb>
        <span slot="separator" class="ic-breadcrumb"><img src="../../assets/images/line.svg"></span>
        <a-breadcrumb-item>
          <nuxt-link to="/series">
            <u>{{ $t('models.titleSeries') }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <nuxt-link :to="`/series/${seriesInfo.seriesId}`">
            <u>{{ getContentLocale(seriesInfo.names, getLocaleDefault(listLanguage)) }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          {{ $t('models.titlePageAdd') }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="bg-white px-3 py-4 box-content">
      <Editor :init-data="blankData">
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
        blankData: {
          seriesId: null,
          productId: null,
          distributorId: null,
          trackingPath: '',
          trackingConfigLeftPath: '',
          trackingConfigRightPath: ''
        }
      };
    },
    computed: {
      ...mapState({
        seriesInfo: state => state.series.seriesInfo,
        listLanguage: state => state.languages.listLanguage
      })
    },
    async fetch({ store, params, route }) {
      const { seriesId } = route.query;
      await store.dispatch('series/getSeriesById', seriesId);
    },
    mounted() {
      this.setData();
    },
    methods: {
      setData() {
        let names = [];
        _.forEach(this.listLanguage, language => {
          const name = {
            locale: language.locale,
            content: ''
          }
          names.push(name);
        })
        this.blankData = {
          ...this.blankData,
          names
        }
      },
    }
  }

</script>
