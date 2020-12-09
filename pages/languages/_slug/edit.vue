<template>
  <div>
    <div class="background-title-page">
      <h1 class="font-28px m-0"><strong>{{ $t('languages.titlePageEdit') }}</strong></h1>
      <a-breadcrumb>
        <span slot="separator" class="ic-breadcrumb"><img src="../../../assets/images/line.svg"></span>
        <a-breadcrumb-item>
          <nuxt-link to="/languages">
            <u>{{ $t('languages.titlePage') }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          {{ $t('languages.titlePageEdit') }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="bg-white px-3 py-4 box-content">
      <Editor isEdit="true" :init-data="languageInfo">
      </Editor>
    </div>
  </div>
</template>
<script>
  import Editor from "~/components/languages/editor";
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
        languageInfo: state => state.languages.languageInfo,
      })
    },
    async fetch({ store, params, error }) {
      await store.dispatch('languages/getLanguageById', params.slug);
    },
  }
</script>
