<template>
  <div>
    <div class="background-title-page">
      <h1 class="font-28px m-0"><strong>{{ $t('cards.btnAdd') }}</strong></h1>
      <a-breadcrumb>
        <span slot="separator" class="ic-breadcrumb"><img src="../../assets/images/line.svg"></span>
        <a-breadcrumb-item>
          <nuxt-link to="/cards">
            <u>{{ $t('cards.titlePage') }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          {{ $t('cards.btnAdd') }}
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
  import Editor from "~/components/cards/editor";
  import { mapState } from "vuex";
  export default {
    middleware: ['ktcUsers'],
    layout: "default",
    components: {
      Editor
    },
    data() {
      return {
        blankData: {}
      };
    },
    computed: {
      ...mapState({
        listLanguage: state => state.languages.listLanguage
      })
    },
    async fetch() {
      await this.$store.dispatch('cardTypes/getListCardType', { locale: this.getLocaleDefault(this.listLanguage) });
    },
    beforeMount() {
      this.setData();
    },
    methods: {
      setData() {
        let names = [];
        let notes = [];
        _.forEach(this.listLanguage, language => {
          const { locale, name, isRequired } = language;
          const dataName = {
            locale,
            content: '',
            nameLG: name,
            isRequired
          }
          names.push(dataName);
          notes.push({...dataName});
        })
        this.blankData = {
          ...this.blankData,
          names,
          notes,
          cardTypeId: null,
          canEdit: true
        }
      },
    }
  }
</script>
