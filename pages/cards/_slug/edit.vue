<template>
  <div>
    <div class="background-title-page">
      <h1 class="font-28px m-0"><strong>{{ $t('cards.titlePageEdit') }}</strong></h1>
      <a-breadcrumb>
        <span slot="separator" class="ic-breadcrumb"><img src="../../../assets/images/line.svg"></span>
        <a-breadcrumb-item>
          <nuxt-link to="/cards"><u>{{ $t('cards.titlePage') }}</u></nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <nuxt-link :to="`/cards/${$route.params.slug}`"><u>{{ getContentLocale( cardInfo.names, getLocaleDefault(listLanguage)) }}</u></nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          {{ $t('cards.titlePageEdit') }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="d-flex justify-center align-item-center" style="min-height: 500px" v-if="$fetchState.pending">
      <a-spin size="large" />
    </div>
    <div class="bg-white px-3 py-4 box-content" v-else>
      <Editor isEdit="true" :init-data="dataEdit">
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
        dataEdit: {}
      };
    },
    computed: {
      ...mapState({
        cardInfo: state => state.cards.cardInfo,
        listLanguage: state => state.languages.listLanguage
      })
    },
    async fetch() {
      await this.$store.dispatch('cards/getCardById', this.$route.params.slug);
      await this.$store.dispatch('cardTypes/getListCardType', { locale: this.getLocaleDefault(this.listLanguage) });
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
            nameLG: name,
            isRequired
          }
          names.push({...dataName, content: this.getContentLocale(this.cardInfo.names, language.locale)});
          notes.push({...dataName, content: this.getContentLocale(this.cardInfo.notes, language.locale)});
        });

        this.dataEdit = {
          ...this.cardInfo,
          names,
          notes
        }
      },
    }
  }
</script>
