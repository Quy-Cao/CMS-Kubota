<template>
  <div>
    <div class="background-title-page">
      <h1 class="font-28px m-0"><strong>{{ $t('buttons.btnAdd') }}</strong></h1>
      <a-breadcrumb>
        <span slot="separator" class="ic-breadcrumb"><img src="../../assets/images/line.svg"></span>
        <a-breadcrumb-item>
          <nuxt-link to="/buttons">
            <u>{{ $t('buttons.titlePage') }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          {{ $t('buttons.btnAdd') }}
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
  import Editor from "~/components/buttons/editor";
  import { mapState } from "vuex";
  export default {
    middleware: ['ktcUsers'],
    layout: "default",
    components: {
      Editor
    },
    data() {
      return {
        blankData: {},
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
          const { locale, name, isRequired } = language;
          const dataName = {
            locale,
            content: '',
            name: name,
            isRequired
          }
          names.push(dataName);
        });

        let choiceDescs = [{
          choiceOrder: 1,
          names
        }]

        this.blankData = {
          ...this.blankData,
          choiceDescs
        }
      },
    }
  }
</script>
