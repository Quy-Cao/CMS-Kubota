<template>
  <div>
    <div class="background-title-page">
      <h1 class="font-28px m-0">
        <strong>{{ $t('buttons.titlePageEdit') }}</strong>
      </h1>
      <a-breadcrumb>
        <span slot="separator" class="ic-breadcrumb">
          <img src="../../../assets/images/line.svg" />
        </span>
        <a-breadcrumb-item>
          <nuxt-link to="/buttons">
            <u>{{ $t('buttons.titlePage') }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('buttons.titlePageEdit') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="bg-white px-3 py-4 box-content">
      <Editor isEdit="true" :init-data="dataEdit"></Editor>
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
      dataEdit: {}
    };
  },
  computed: {
    ...mapState({
      buttonInfo: state => state.buttons.buttonInfo,
      listLanguage: state => state.languages.listLanguage
    })
  },
  async fetch({ store, params, error }) {
    await store.dispatch("buttons/getButtonById", params.slug);
  },
  beforeMount() {
    this.setData();
  },
  methods: {
    setData() {
      let choiceDescs = this.buttonInfo.choiceDescs.map(_choiceDescs => {
        let _names = _choiceDescs.names;
        _names = this.listLanguage.reduce((arrNames, currentLang) => {
          let _findName = _names.find(it => it.locale === currentLang.locale);
          return _findName
            ? [...arrNames, { ...currentLang, ..._findName, name: currentLang.name }]
            : [
                ...arrNames,
                {
                  ...currentLang,
                  content: ""
                }
            ];
        }, []);
        return {
          ..._choiceDescs,
          names: _names
        };
      });

      this.dataEdit = {
        ...this.dataEdit,
        choiceCode: this.buttonInfo.choiceCode,
        choiceDescs: [...choiceDescs]
      };
    }
  }
};
</script>
