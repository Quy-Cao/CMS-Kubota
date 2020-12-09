<template>
  <div>
    <div class="background-title-page">
      <h1 class="font-28px m-0"><strong>{{ $t('series.titlePageAdd') }}</strong></h1>
      <a-breadcrumb>
        <span slot="separator" class="ic-breadcrumb"><img src="../../assets/images/line.svg"></span>
        <a-breadcrumb-item>
          <nuxt-link to="/series">
            <u>{{ $t('series.titleSeries') }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          {{ $t('series.titlePageAdd') }}
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
  import Editor from "~/components/series/editor.vue";
  import { mapActions, mapState } from "vuex";

  export default {
    middleware: ['ktcUsers'],
    layout: "default",
    components: {
      Editor
    },
    data() {
      return {
        blankData: {
          productId: null,
          thumbPath:null
        }
      };
    },
    computed: {
      ...mapState({
        listLanguage: state => state.languages.listLanguage
      })
    },
    beforeMount() {
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