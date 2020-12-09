<template>
  <div>
    <a-form-model ref="instructions" :model="instructions">
      <div v-for="(name, index) in instructions.names" :key="index">
        <a-form-model-item :label="name.nameLG"
          :prop="'names.' + index + '.content'"
          :rules="{
            required: name.isRequired ? true : false,
            message: $t('messValidate.requiredInstruction'),
            trigger: 'change',
          }"
          :label-col="{ span: 4 }" :wrapper-col="{ span: 10 }"
          >
            <a-input
              type="textarea"
              :auto-size="{ minRows: 5, maxRows: 10 }"
              v-model="name.content"
              @change="handleChangeEditor(`names-${name.locale}`)"
            />
            <div class="ant-form-explain txt-danger" v-if="getError(errors, `names-${name.locale}`, false)">{{ getError(errors, `names-${name.locale}`, false) }}</div>
        </a-form-model-item>
      </div>
      <a-form-model-item :wrapper-col="{ span: 12, offset: 4 }">
        <a-button type="primary" :disabled="isSubmit" @click="handleSubmit">{{ $t('commonText.btnSave') }}</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  props: ['isEdit', 'initData'],
  data() {
    return {
      instructions: this.initData,
      errors: {},
      isSubmit: false,
    };
  },
  methods: {
    ...mapActions({
      addInstruction: 'instructions/addInstruction',
      editInstruction: 'instructions/editInstruction'
    }),
    handleSubmit() {
      this.isSubmit = true;
      this.$refs.instructions.validate(async valid => {
        this.instructions = {
          ...this.instructions,
          savedBy: this.getUserName(this.$keycloak.token)
        }
        if (valid) {
          if (!this.isEdit) {
            this.addInstruction(this.instructions).then(resAdd => {
              if (resAdd.status == 200) {
                this.$router.push('/instructions');
              } else {
                this.errors = resAdd;
              }
            });
          } else {
            this.editInstruction(this.instructions).then(resEdit => {
              if (resEdit.status == 200) {
                this.$router.push('/instructions');
              } else {
                this.errors = resEdit;
              }
            });
          }
        }
        this.isSubmit = false;
      });
    },
    handleChangeEditor(nameField, index) {
      this.getError(this.errors, nameField, true);
    }
  }
};
</script>
