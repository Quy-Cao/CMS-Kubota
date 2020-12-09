<template>
  <div>
    <div class="background-title-page">
      <h1 class="font-28px m-0"><strong>{{ $t('issueCategories.btnAdd') }}</strong></h1>
      <a-breadcrumb>
        <span slot="separator" class="ic-breadcrumb"><img src="../../assets/images/line.svg"></span>
        <a-breadcrumb-item>
          <nuxt-link to="/issueCategories">
            <u>{{ $t('issueCategories.titlePage') }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          {{ $t('issueCategories.btnAdd') }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="bg-white px-3 py-4 box-content">
      <Editor :isEdit="false" :initData="initFormData">
      </Editor>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Editor from '~/components/issueCategories/editor';
export default {
  middleware: ['ktcUsers'],
  layout: 'default',
  components: {
    Editor
  },
  data() {
    return {
      initFormData : {
        parentId: '',
        names: []
      }
    }
  },
  async created() {
    this.initFormData.names = this.listLanguage.map(language => {
      return {
        ..._.omit(language,['isDefault']),
        content: ''
      }
    })
  },
  computed: {
    ...mapState({
      listLanguage: state => state.languages.listLanguage
    })
  },
  methods: {
  },
};
</script>
