<template>
  <a-form-model
    ref="validateChoiceDescs"
    :model="validateChoiceDescs"
  >
    <a-form-model-item
      v-for="(domain, indexChoice) in validateChoiceDescs.choiceDescs"
      :key="domain.key"
    >
      <a-row class="mb-2">
        <a-col :span="4">
          <span class="font-18px font-weight-bold">{{ $t('buttons.txtButton') }} {{ indexChoice + 1 }}</span>
        </a-col>
        <a-col v-if="validateChoiceDescs.choiceDescs.length > 1">
          <a class="txt-danger" @click="removeDomain(domain)">
            <u>{{ $t('buttons.actionRemove') }}</u>
          </a>
        </a-col>
      </a-row>

      <div v-for="(name, indexName) in validateChoiceDescs.choiceDescs[indexChoice].names" :key="name.locale">
          <a-form-model-item :label="name.name"
          :prop="'choiceDescs.' + indexChoice + '.names.' + indexName + '.content'"
          :rules="{
            required: name.isRequired ? true : false,
            message: 'Please input Button name!',
            trigger: 'blur',
          }"
          :label-col="{ span: 4 }" :wrapper-col="{ span: 6 }"
          >
            <a-input
              v-model="name.content"
              @change="handleChangeEditor(`names-${name.locale}`, indexName)"
            ></a-input>
            <div class="ant-form-explain txt-danger" v-if="getError(errors, `names-${name.locale}`, false)">{{ getError(errors, `names-${name.locale}`, false) }}</div>
          </a-form-model-item>
        </div>
    </a-form-model-item>
    <a-form-model-item :wrapper-col="{ span: 12, offset: 4 }" v-if="validateChoiceDescs.choiceDescs.length < AMOUNT_BUTTONS">
      <a @click="addDomain">
        <u>{{ $t('buttons.actionAdd') }}</u>
      </a>
    </a-form-model-item>
    <a-form-model-item :wrapper-col="{ span: 12, offset: 4 }">
      <a-button type="primary" :disabled="isSubmit" @click="submitForm('validateChoiceDescs')">{{ $t('commonText.btnSave') }}</a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { mapActions } from "vuex";
import { AMOUNT_BUTTONS } from '~/plugins/constant.js';
export default {
  props: ["isEdit", "initData"],
  data() {
    return {
      isSubmit: false,
      errors: {},
      validateChoiceDescs: this.initData,
      AMOUNT_BUTTONS
    };
  },
  methods: {
    ...mapActions({
      addButtons: 'buttons/addButtons',
      editButtons: 'buttons/editButtons',
    }),
    submitForm(formName) {
      this.isSubmit = true;
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const data = {
            choiceDescs: this.validateChoiceDescs.choiceDescs.map(choice => {
              return {
                ...choice,
                savedBy: this.getUserName(this.$keycloak.token)
              }
            }),
          }
          if (!this.isEdit) {
            const resAdd = await this.addButtons(data);
            if (resAdd.status == 200) {
              this.$router.push('/buttons');
            } else {
              this.errors = resAdd;
              this.isSubmit = false;
            }
          } else {
            const resEdit = await this.editButtons({
              ...data,
              choiceCode: this.validateChoiceDescs.choiceCode
            });
            if (resEdit.status == 200) {
              this.$router.push('/buttons');
            } else {
              this.errors = resEdit;
            }
          }
        }
        this.isSubmit = false;
      });
    },
    removeDomain(item) {
      let index = this.validateChoiceDescs.choiceDescs.indexOf(item);
      if (index !== -1) {
        this.validateChoiceDescs.choiceDescs.splice(index, 1);
        this.validateChoiceDescs.choiceDescs = this.validateChoiceDescs.choiceDescs.map(choice => {
          return {
            ...choice,
            choiceOrder: choice.choiceOrder > item.choiceOrder ? choice.choiceOrder - 1 : choice.choiceOrder
          }
        });
      }
    },
    addDomain() {
      if(this.validateChoiceDescs.choiceDescs.length < AMOUNT_BUTTONS) {
        this.validateChoiceDescs.choiceDescs.push({
        key: Date.now(),
        choiceOrder: this.validateChoiceDescs.choiceDescs.length + 1,
        names: this.initData.choiceDescs[0].names.map((it, index) => {
          return {
            ...it,
            content: ''
          }
        }),
      });
      }
    },
    handleChangeEditor(nameField) {
      this.getError(this.errors, nameField, true);
    }
  },

};
</script>