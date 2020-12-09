<template>
  <div>
    <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 6 }" @submit="handleSubmit">
      <div v-for="(name, index) in issueCategory.names" :key="index" >
        <a-form-item :label="name.name">
          <a-input
            :data-index="index"
            :data-name="`name-${name.locale}`"
            v-decorator="[
              `name-${name.locale}`,
              {
                initialValue: name.content,
                rules: [{ required: name.isRequired, message: $t('messValidate.requiredInputCategoryName') }]
              }]"
          >
          </a-input>
          <div class="ant-form-explain txt-danger" v-if="getError(errors, `names-${name.locale}`, false)">{{ getError(errors, `names-${name.locale}`, false) }}</div>
        </a-form-item>
      </div>
      <a-form-item label="Parent category">
        <a-tree-select
          v-model="parentId"
          :replaceFields="{
            children:'categoryChilds',
            title:'name',
            key:'categoryId',
            value: 'categoryId'
          }"
          :treeData="parentCategories"
          tree-default-expand-all
        >
        </a-tree-select>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 4 }">
        <a-button type="primary" html-type="submit" :disabled="isSubmit">{{ $t('commonText.btnSave') }}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  props: ['isEdit', 'initData'],
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'issueCategoryForm' }),
      issueCategory: this.initData,
      isSubmit: false,
      parentCategories: [],
      errors: '',
      parentId: ''
    }
  },
  async created() {
    this.parentId = this.issueCategory.parentId ? this.issueCategory.parentId : ''
    let response = await this.getListIssueCategories();
    this.parentCategories.push({
      categoryId: '',
      name: 'None'
    });
    for(let category of response.data) {
        let isDisabled = this.issueCategory.categoryId && this.issueCategory.categoryId == category.categoryId ? true : false;
        let categoryChilds = category.categoryChilds ? this.getLvl2Childs(category.categoryChilds, this.issueCategory.categoryId, isDisabled) : [];
        this.parentCategories.push({
          ..._.omit(category, ['names']),
          name: this.getContentLocale(category.names, this.getLocaleDefault(this.listLanguage)),
          disabled: isDisabled,
          categoryChilds
        });
      }
    },

  computed: {
    ...mapState({
      listLanguage: state => state.languages.listLanguage,
    }),
  },
  methods: {
    ...mapActions({
      getListIssueCategories: 'issueCategories/getListIssueCategories',
      addIssueCategory: 'issueCategories/addIssueCategory',
      updateIssueCategory: 'issueCategories/updateIssueCategory'
    }),
    handleSelectChange(value){
      this.issueCategory.parentId = value;
    },
    handleSubmit(e) {
        e.preventDefault();
        this.isSubmit = true;
        this.form.validateFields(async (err, values) => {
          if (!err) {
            let data = this.getFormData(values)
            let res = '';
            if(!this.isEdit) {
              // Add
              res = await this.addIssueCategory(data);
            } else {
              // Edit
              data.categoryId = this.issueCategory.categoryId;
              res = await this.updateIssueCategory(data);
            }
            if (res.status == 200) {
              this.$router.push('/issueCategories');
            } else {
              this.errors = res;
              this.isSubmit = false;
            }
          }
          this.isSubmit = false;
        });
      },
    getFormData(values) {
      return {
        parentId: this.parentId,
        names: this.issueCategory.names.map(name => {
          return {
            locale: name.locale,
            content: _.trim(values[`name-${name.locale}`])
          }
        }),
        savedBy: this.getUserName(this.$keycloak.token)
      }
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    getLvl2Childs(childs, categoryId = null, isDisabled){
      return childs.map(childCategory => {
        return {
          ..._.omit(childCategory, ['names', 'categoryChilds']),
          name: this.getContentLocale(childCategory.names, this.getLocaleDefault(this.listLanguage)),
          disabled: (categoryId && childCategory.categoryId == categoryId) || isDisabled ? true : false
        }
      });
    }
  }
}
</script>
