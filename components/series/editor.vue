<template>
  <div>
    <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
      <a-form-item :label="$t('series.lableInput')">
        <a-input
        @change="handleChangeInput('name')"
          v-decorator="[
            'name',
            {
              initialValue: getContentLocale(series.names, getLocaleDefault(listLanguage)),
              rules: [{ required: true, message: 'Please input Series name!' }]
            }
          ]"
        />
        <div class="ant-form-explain txt-danger" v-if="this.getError('names-en', false)">{{ this.getError('names-en', false) }}</div>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 4 }">
        <a-button type="primary" html-type="submit" :disabled="isSubmit">{{ isEdit ? $t('commonText.btnSave') : $t('commonText.btnContinue') }}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
  import { mapActions, mapState } from "vuex";
  const blankData = {
    productId: null,
    seriesId: -1,
    thumbPath:null
  }

  export default {
    props: ['isEdit', 'initData'],
    data() {
      return {
        formLayout: 'horizontal',
        form: this.$form.createForm(this, { name: 'editorSeries' }),
        errors: {},
        isSubmit: false,
        series: this.initData,
      };
    },
    computed: {
      ...mapState({
        listLanguage: state => state.languages.listLanguage
      })
    },
    methods: {
      ...mapActions({
        addSeries: 'series/addSeries',
        editSeries: 'series/editSeries',
      }),
      handleSubmit(e) {
        e.preventDefault();
        this.isSubmit = true;
        this.form.validateFields(async (err, values) => {
          if (!err) {
            let names = [];
            _.forEach(this.listLanguage, language => {
              const name = {
                locale: language.locale,
                content: _.trim(values.name)
              }
              names.push(name);
            })
            values = {
              ...values,
              names
            };
            if (this.isEdit) {
              /* Edit series */
              const { nameJp, productId, seriesId } = this.series;
              values = {
                ...values,
                productId,
                seriesId,
              };
              const resEdit = await this.editSeries(values);
              if (resEdit.status == 200) {
                this.$router.push(`/series/${seriesId}`);
              } else {
                this.errors = resEdit;
                this.isSubmit = false;
              }
            } else {
              /* Add new series */
              const resAdd = await this.addSeries(values);
              if (resAdd.status == 200) {
                this.$router.push(`/series/${resAdd.data.seriesId}/blank`);
              } else {
                this.errors = resAdd;
                this.isSubmit = false;
              }
            }
          }
          this.isSubmit = false;
        });
      },
      getError(nameField, isChange = false) {
        if (!_.isEmpty(this.errors)) {
          if (isChange) {
            this.errors.errors = _.omit(this.errors.errors, [nameField]);
          }
          if(!_.isUndefined(this.errors.errors[nameField])) {
            return this.errors.errors[nameField];
          }
        }
      },
      handleChangeInput(nameField) {
        this.getError(nameField, true);
      }
    },
  };
</script>
