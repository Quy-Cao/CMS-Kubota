<template>
  <div>
    <a-form-model ref="errorCode" :model="errorCode" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }" >
      <a-form-model-item
        :label="$t('errorCodes.titleErrorCode')"
        prop="errorCode"
        :rules="[{
          required: true,
          message: $t('messValidate.requiredErorCode'),
          trigger: 'change',
        },
        {
          pattern: /^[A-Za-z0-9]{1,10}$/, 
          message: $t('messValidate.requiredErrorCodeLength')
        }]"
      >
        <a-input
          @change="handleChangeInput('errorCode')"
          v-model="errorCode.errorCode"
        />
        <div class="ant-form-explain txt-danger" v-if="getError(errors, 'errorCode', false)">{{ getError(errors, 'errorCode', false) }}</div>
      </a-form-model-item>
      <a-form-model-item
        :label="$t('errorCodes.lableModel')"
        prop="modelId"
        :rules="{
          required: true,
          message: $t('messValidate.requiredSelectModel'),
          trigger: 'blur',
        }"
      >
        <a-select
          v-model="errorCode.modelId"
          :placeholder="$t('messValidate.requiredSelectModel')"
        >
          <a-select-option v-for="model in models" :key="model.modelId">
            {{ getContentLocale(model.names, getLocaleDefault(listLanguage)) }}
          </a-select-option>
        </a-select>
        <div class="ant-form-explain txt-danger" v-if="getError(errors, 'modelId', false)">{{ getError(errors, 'modelId', false) }}</div>
      </a-form-model-item>
      <p class="font-18px font-weight-bold">{{ $t('errorCodes.titleErrorName') }}</p>
      <div v-for="(name, index) in errorCode.names" :key="index" >
        <a-form-model-item
          :label="name.nameLG"
          :prop="'names.' + index + '.content'"
          :rules="{
            required: name.isRequired ? true : false,
            message: $t('messValidate.requiredErrorName'),
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
      <a-form-model-item :wrapper-col="{ span: 12, offset: 4 }">
        <a-button type="primary" html-type="submit" :disabled="isSubmit || (errorCode.publishVersion && isEdit)" @click="handleSubmit">{{ isEdit ? $t('commonText.btnSave') : $t('commonText.btnContinue') }}</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
  import { mapActions, mapState } from "vuex";
  import { IS_DRAFT } from "~/plugins/constant.js";

  export default {
    props: ['isEdit', 'initData', 'seriesId', 'modelId'],
    data() {
      return {
        errors: {},
        isSubmit: false,
        models: {},
        errorCode: this.initData,
      };
    },
    computed: {
      ...mapState({
        seriesHasModel: state => state.series.seriesHasModel,
        listLanguage: state => state.languages.listLanguage
      })
    },
    created() {
      this.init();
    },
    methods: {
      ...mapActions({
        addErrorCode: 'errorCodes/addErrorCode',
        editErrorCode: 'errorCodes/editErrorCode',
        getSeriesHasListModel: 'series/getSeriesHasListModel'
      }),
      async init() {
        await this.getSeriesHasListModel(this.seriesId);
        this.models = this.seriesHasModel.models;
      },
      handleSubmit() {
        this.isSubmit = true;
        this.$refs.errorCode.validate(async valid => {
          if (valid) {
            if(!this.isEdit) {
              let errorCodeAdd = {
                ...this.errorCode,
                errorCode: this.errorCode.errorCode.trim(),
                names: this.errorCode.names.map(it => ({...it, content: it.content.trim()})),
                isDraft: IS_DRAFT.UNPUBLISH.id,
                savedBy: this.getUserName(this.$keycloak.token)
              }
              const resAdd = await this.addErrorCode(errorCodeAdd);
              if (resAdd.status == 200) {
                this.$router.push(`/errorCodes/${resAdd.data.errorCodeId}?modelId=${errorCodeAdd.modelId}`);
              } else {
                this.errors = resAdd;
              }
            } else {
              let errorCodeEdit = {
                ...this.errorCode,
                errorCode: this.errorCode.errorCode.trim(),
                names: this.errorCode.names.map(it => ({...it, content: it.content.trim()})),
                oldModelId: this.modelId,
                savedBy: this.getUserName(this.$keycloak.token)
              }
              const resEdit = await this.editErrorCode(errorCodeEdit);
              if (resEdit.status == 200) {
                this.$router.push(`/errorCodes/${resEdit.data.errorCodeId}?modelId=${errorCodeEdit.modelId}`);
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
      }
    },
  };
</script>