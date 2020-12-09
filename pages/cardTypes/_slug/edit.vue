<template>
  <div>
    <div class="background-title-page">
      <h1 class="font-28px m-0"><strong>{{ $t('cardTypes.titlePageEdit') }}</strong></h1>
      <a-breadcrumb>
        <span slot="separator" class="ic-breadcrumb"><img src="../../../assets/images/line.svg"></span>
        <a-breadcrumb-item>
          <nuxt-link to="/cardTypes"><u>{{ $t('cardTypes.titlePage') }}</u></nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          {{ $t('cardTypes.titlePageEdit') }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="bg-white px-3 py-4 box-content">
      <Editor isEdit="true" :init-data="dataEdit">
      </Editor>
    </div>
  </div>
</template>
<script>
  import Editor from "~/components/cardTypes/editor";
  import { mapState } from "vuex";

  export default {
    middleware: ['ktcUsers'],
    layout: "default",
    components: {
      Editor
    },
    data() {
      return {
        dataEdit: {}
      };
    },
    computed: {
      ...mapState({
        cardTypeInfo: state => state.cardTypes.cardTypeInfo,
        listLanguage: state => state.languages.listLanguage
      })
    },
    async fetch({ store, params, error }) {
      await store.dispatch('cardTypes/getCardTypeById', params.slug);
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
            content: this.getContentLocale(this.cardTypeInfo.names, language.locale),
            nameLG: name,
            isRequired
          }
          names.push(dataName);
        });
        this.dataEdit = {
          ...this.cardTypeInfo,
          names,
          isEndOfDiagnosis: this.cardTypeInfo.isEndOfDiagnosis ? true : false
        }
      },
    }
  }

</script>
