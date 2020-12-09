<template>
  <div>
    <div class="background-title-page">
      <h1 class="font-28px m-0"><strong>{{ $t('issueCategories.btnEdit') }}</strong></h1>
      <a-breadcrumb>
        <span slot="separator" class="ic-breadcrumb"><img src="../../../assets/images/line.svg"></span>
        <a-breadcrumb-item>
          <nuxt-link to="/issueCategories">
            <u>{{ $t('issueCategories.titlePage') }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          {{ $t('issueCategories.btnEdit') }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="bg-white px-3 py-4 box-content">
      <Editor :isEdit="true" :initData="initFormData" v-if="isCreated">
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
      },
      isCreated: false
    }
  },
  async created() {
    const res = await this.getIssueCategoryInfo({ categoryId: this.$route.params.slug });
    const issueCategory = res.data;
    this.initFormData = {
      ...issueCategory,
      names: this.listLanguage.map((language, index) => {
      return {
        ..._.omit(language,['isDefault']),
        content: this.getContentLocale(issueCategory.names, language.locale)
        }
      })
     };
     this.isCreated = true;
  },
  computed: {
    ...mapState({
      listLanguage: state => state.languages.listLanguage
    })
  },
  methods: {
    ...mapActions({
      getIssueCategoryInfo: 'issueCategories/getIssueCategoryInfo'
    }),
  },
};
</script>
