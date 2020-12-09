<template>
  <div>
    <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 6 }" @submit="handleSubmit">
      <a-form-item :label="$t('languages.titleLanguage')">
        <a-input
        @change="handleChangeInput('name')"
          v-decorator="[
            'name',
            {
              initialValue: languageData.name,
              rules: [{ required: true, message: $t('messValidate.requiredNameRules') }]
            }
          ]"
        />
        <div class="ant-form-explain txt-danger" v-if="getError(errors, 'name', false)">{{ getError(errors, 'name', false) }}</div>
      </a-form-item>
      <a-form-item :label="$t('languages.labelLocale')">
        <a-input
        @change="handleChangeInput('locale')"
          v-decorator="[
            'locale',
            {
              initialValue: languageData.locale,
              rules: [{ required: true, message: $t('messValidate.requiredLocaleRules') },
              { pattern: /^[A-Za-z]{1,2}$/, message: $t('messValidate.requiredLocalePattern')}],
            }
          ]"
        />
        <div class="ant-form-explain txt-danger" v-if="getError(errors, 'locale', false)">{{ getError(errors,'locale', false) }}</div>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 4 }" class="mb-0">
        <a-checkbox
          class="font-16px"
          @change="handleChangeDefault"
          :disabled="languageData.isDefault ? true : false"
          v-decorator="[
            'isDefault',
            {
              valuePropName: 'checked',
              initialValue: languageData.isDefault ? true : false,
            },
          ]"
        >
          {{ $t('languages.txtDefault') }}
        </a-checkbox>
        <div class="ant-form-explain txt-danger" v-if="getError(errors, 'isDefault', false)">{{ getError(errors, 'isDefault', false) }}</div>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 4 }">
        <a-checkbox
          class="font-16px"
          :disabled="isDisabledRequired"
          v-decorator="[
            'isRequired',
            {
              valuePropName: 'checked',
              initialValue: languageData.isRequired ? true : false,
            },
          ]"
        >
          {{ $t('languages.txtRequired') }}
        </a-checkbox>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 4 }">
        <a-button type="primary" html-type="submit" :disabled="isSubmit">{{ $t('commonText.btnSave') }}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  import { mapActions } from "vuex";
    const blankData = {
      name: '',
      locale: '',
      isDefault: 0,
      isRequired: 0
    }
  export default {
    props: ['isEdit', 'initData'],
    data() {
      return {
        formLayout: 'horizontal',
        form: this.$form.createForm(this, { name: 'editorLanguages' }),
        errors: {},
        isSubmit: false,
        languageData: this.initData ? this.initData : blankData,
        locale: '',
        isDisabledRequired: (this.initData && this.initData.isDefault) ? true : false
      };
    },
    methods: {
      ...mapActions({
        addLanguage: 'languages/addLanguage',
        editLanguage: 'languages/editLanguage'
      }),
      handleSubmit(e) {
        e.preventDefault();
        this.isSubmit = true;
        this.form.validateFields(async (err, values) => {
          if (!err) {
            values = {
              ...values,
              name: _.trim(values.name),
              locale: _.trim(values.locale),
              isDefault: values.isDefault ? 1 : 0,
              isRequired: values.isRequired ? 1 : 0,
              savedBy: this.getUserName(this.$keycloak.token)
            };
            if(!this.isEdit) {
              // Add language
              const resAdd = await this.addLanguage(values);
              if (resAdd.status == 200) {
                this.$router.push('/languages');
              } else {
                this.errors = resAdd;
                this.isSubmit = false;
              }
            }else {
              /* Edit language */
              const { name, locale, isDefault } = this.languageData;
              values = {
                ...values,
                oldLocale: locale
              };
              const resEdit = await this.editLanguage(values);
              if (resEdit.status == 200) {
                this.$router.push('/languages');
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
      handleChangeDefault(e) {
        this.getError(this.errors, 'isDefault', true);
        const isRequired = this.form.getFieldValue('isRequired');
        if (!isRequired) {
          this.form.setFieldsValue({ 'isRequired' : e.target.checked })
        }
        this.isDisabledRequired = e.target.checked;
      }
    }
  }
</script>
