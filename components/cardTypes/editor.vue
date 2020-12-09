<template>
  <div>
    <a-form-model ref="cardTypes" :model="cardTypes" :label-col="{ span: 4 }" :wrapper-col="{ span: 6 }" >
      <div v-for="(name, index) in cardTypes.names" :key="index" >
        <a-form-model-item
          :label="name.nameLG"
          :prop="'names.' + index + '.content'"
          :rules="{
            required: name.isRequired ? true : false,
            message: $t('messValidate.requiredCardTypeName'),
            trigger: 'change',
          }"
        >
          <a-input
            @change="handleChangeInput(`name-${name.locale}`)"
            v-model="name.content"
          >
          </a-input>
          <div class="ant-form-explain txt-danger" v-if="getError(errors, `names-${name.locale}`, false)">{{ getError(errors, `names-${name.locale}`, false) }}</div>
        </a-form-model-item>
      </div>
      <a-form-model-item :wrapper-col="{ span: 12, offset: 4 }">
        <a-checkbox class="font-16px" v-model="cardTypes.isEndOfDiagnosis" >
          {{ $t('cardTypes.txtEndOfDiagnosis') }}
        </a-checkbox>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 12, offset: 4 }">
        <a-button type="primary" html-type="submit" :disabled="isSubmit" @click="handleSubmit">{{ $t('commonText.btnSave') }}</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
  import { mapActions } from "vuex";
  import { IS_END_DIAGNOSIS } from '~/plugins/constant';
  export default {
    props: ['isEdit', 'initData'],
    data() {
      return {
        errors: {},
        isSubmit: false,
        cardTypes: this.initData,
        IS_END_DIAGNOSIS
      };
    },
    methods: {
      ...mapActions({
        addCardType: 'cardTypes/addCardType',
        editCardType: 'cardTypes/editCardType'
      }),
      handleSubmit() {
        this.isSubmit = true;
        this.$refs.cardTypes.validate(async valid => {
          let cardTypes = {
            ...this.cardTypes,
            savedBy: this.getUserName(this.$keycloak.token),
            isEndOfDiagnosis: this.cardTypes.isEndOfDiagnosis ? _.parseInt(IS_END_DIAGNOSIS.END_DIAGNOSIS.id) : _.parseInt(IS_END_DIAGNOSIS.NOT_END_DIAGNOSIS.id)
          }
          if (valid) {
            if(!this.isEdit) {
              const resAdd = await this.addCardType(cardTypes);
              if (resAdd.status == 200) {
                this.$router.push('/cardTypes');
              } else {
                this.errors = resAdd;
                this.isSubmit = false;
              }
            } else {
              const resEdit = await this.editCardType(cardTypes);
              if (resEdit.status == 200) {
                this.$router.push('/cardTypes');
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