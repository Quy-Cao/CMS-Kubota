<template>
  <div>
    <a-form-model ref="issues" :model="issues" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }" >
      <a-form-model-item
        :label="$t('issues.lableModel')"
        prop="modelId"
        :rules="{
          required: true,
          message: $t('messValidate.requiredSelectModel'),
          trigger: 'change',
        }"
        :wrapper-col="{ span: 8 }"
      >
        <a-select
          v-model="issues.modelId"
          :placeholder="$t('messValidate.requiredSelectModel')"
        >
          <a-select-option v-for="model in models" :key="model.modelId">
            {{ getContentLocale(model.names, getLocaleDefault(listLanguage)) }}
          </a-select-option>
        </a-select>
        <div class="ant-form-explain txt-danger" v-if="getError(errors, 'modelId', false)">{{ getError(errors, 'modelId', false) }}</div>
      </a-form-model-item>
      <!-- Select category -->

        <a-row >
          <a-col :span="12">
            <a-form-model-item
              :label="$t('issues.lableCategory')"
              prop="categoryId"
              :rules="{
                required: true,
                message: $t('messValidate.requiredSelectCategoty'),
                trigger: 'change',
              }"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }"
            >
              <a-tree-select
                v-model="issues.categoryId"
                :replaceFields="{
                  children:'categoryChilds',
                  title:'name',
                  key:'categoryId',
                  value: 'categoryId'
                }"
                :treeData="categories"
                tree-default-expand-all
                :placeholder="$t('messValidate.requiredSelectCategoty')"
              >
              </a-tree-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <nuxt-link to="/issueCategories/add" class="ml-3">
              <u>Add category</u>
            </nuxt-link>
          </a-col>
        </a-row>
        <div class="ant-form-explain txt-danger" v-if="getError(errors, 'categoryId', false)">{{ getError(errors, 'categoryId', false) }}</div>
      <!-- Names languages -->
      <div v-for="(name, index) in issues.names" :key="index" >
        <a-form-model-item
          :label="name.nameLG"
          :prop="'names.' + index + '.content'"
          :rules="{
            required: name.isRequired ? true : false,
            message: $t('messValidate.requiredIssueName'),
            trigger: 'change',
          }"
        >
          <a-input
            @change="handleChangeInput(`name-${name.locale}`)"
            v-model="name.content"
          >
          </a-input>
          <div class="ant-form-explain txt-danger" v-if="getError(errors, `name-${name.locale}`, false)">{{ getError(errors, `name-${name.locale}`, false) }}</div>
        </a-form-model-item>
      </div>

      <p class="font-18px font-weight-bold">{{ $t('issues.txtSearchForm') }}</p>
      <!-- Search Name languages -->
      <div v-for="(nameSearch, index) in issues.searchNames" :key="nameSearch.locale" >
        <a-form-model-item
          :label="nameSearch.nameLG"
          :prop="'searchNames.' + index + '.content'"
          :rules="[
          {
            validator: validateKeywordsInput,
            trigger: 'change'
          }]"
        >
          <a-input
            @change="handleChangeInput(`name-${nameSearch.locale}`)"
            v-model="nameSearch.content"
          >
          </a-input>
          <div class="ant-form-explain txt-danger" v-if="getError(errors, `name-${nameSearch.locale}`, false)">{{ getError(errors, `name-${nameSearch.locale}`, false) }}</div>
        </a-form-model-item>
      </div>
      <!-- Button Save -->
      <a-row >
          <a-col :span="4">
          </a-col>
          <a-col :span="12">
            <a-form-model-item>
              <a-button type="primary" html-type="submit" :disabled="isSubmit || (issues.publishVersion && isEdit)" @click="handleSubmit">{{ isEdit ? $t('commonText.btnSave') : $t('commonText.btnContinue') }}</a-button>
            </a-form-model-item>
          </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>
<script>
  import { mapActions, mapState } from 'vuex';
  import { IS_DRAFT } from '~/plugins/constant.js';
  import XRegExp from 'xregexp';
  export default {
    props: ['isEdit', 'initData', 'seriesId', 'modelId'],
    data() {
      return {
        errors: {},
        isSubmit: false,
        models: {},
        categories: [],
        issues: this.initData
      };
    },
    computed: {
      ...mapState({
        seriesHasModel: state => state.series.seriesHasModel,
        listLanguage: state => state.languages.listLanguage,
      })
    },
    created() {
      this.init();
    },
    methods: {
      ...mapActions({
        addIssue: 'issues/addIssue',
        editIssue: 'issues/editIssue',
        getSeriesHasListModel: 'series/getSeriesHasListModel',
        getListCategory: 'issueCategories/getListIssueCategories'
      }),
      async init() {
        await this.getSeriesHasListModel(this.seriesId);
        this.models = this.seriesHasModel.models;
        const res = await this.getListCategory();
        this.categories = res.data.map(category => {
          let categoryChilds = category.categoryChilds ? this.getLvl2Childs(category.categoryChilds) : [];
          return {
            ..._.omit(category, ['names']),
            name: this.getContentLocale(category.names, this.getLocaleDefault(this.listLanguage)),
            categoryChilds
          };
        });
      },
      handleSubmit() {
        this.isSubmit = true;
        this.$refs.issues.validate(async valid => {
          if (valid) {
            this.issues = {
              ...this.issues,
              savedBy: this.getUserName(this.$keycloak.token)
            }
            if(!this.isEdit) {
              const issueAdd = {
                ...this.issues,
                isDraft: IS_DRAFT.UNPUBLISH.id
              }
              const resAdd = await this.addIssue(issueAdd);
              if (resAdd.status == 200) {
                this.$router.push(`/issues/${resAdd.data.iCategoryId}`);
              } else {
                this.errors = resAdd;
              }
            } else {
              const resEdit = await this.editIssue(this.issues);
              if (resEdit.status == 200) {
                this.$router.push(`/issues/${this.issues.iCategoryId}`);
              } else {
                this.errors = resEdit;
              }
            }
          }
          this.isSubmit = false;
        });
      },
      handleChangeInput(nameField) {
        this.getError(this.errors, nameField, true);
      },
      getLvl2Childs(childs){
        return childs.map(childCategory => {
          const categoryChilds = childCategory.categoryChilds ? this.getLvl3Childs(childCategory.categoryChilds) : []
          return {
            ..._.omit(childCategory, ['names', 'categoryChilds']),
            name: this.getContentLocale(childCategory.names, this.getLocaleDefault(this.listLanguage)),
            categoryChilds
          }
        });
      },
      getLvl3Childs(childs){
        return childs.map(childCategory => {
          return {
            ..._.omit(childCategory, ['names', 'categoryChilds']),
            name: this.getContentLocale(childCategory.names, this.getLocaleDefault(this.listLanguage)),
          }
        });
      },
      validateKeywordsInput(rule, value, callback){
        // regex for characters of multi-languages
        const regex = XRegExp('^[\\p{L}\\p{N}]+(?:,[\\p{L}\\p{N}]*)*$');
        if(value && !regex.test(value)){
          callback(new Error(this.$t('messValidate.commaSeparatedKeywords')));
        }
        callback();
      }
    },
  };
</script>
