<template>
  <div>
    <div class="background-title-page">
      <h1 class="font-28px m-0"><strong>{{ $t('instructions.titlePageEdit') }}</strong></h1>
      <a-breadcrumb>
        <span slot="separator" class="ic-breadcrumb"><img src="../../../assets/images/line.svg"></span>
        <a-breadcrumb-item>
          <nuxt-link to="/instructions">
            <u>{{ $t('instructions.titlePage') }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          {{ $t('instructions.titlePageEdit') }}
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
  import Editor from "~/components/instructions/editor";
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
        instructionInfo: state => state.instructions.instructionInfo,
        listLanguage: state => state.languages.listLanguage
      })
    },
    async fetch({ store, params, error }) {
      await store.dispatch('instructions/getInstructionById', params.slug);
    },
    beforeMount() {
      this.setData();
    },
    methods: {
      setData() {
        let names = [];
        _.forEach(this.listLanguage, language => {
          const { name, locale, isRequired } = language
          const dataName = {
            locale,
            isRequired,
            content: this.getContentLocale(this.instructionInfo.names, language.locale),
            nameLG: name
          }
          names.push(dataName);
        });
        this.dataEdit = {
          ...this.instructionInfo,
          names
        }
      },
    }
  }

</script>
