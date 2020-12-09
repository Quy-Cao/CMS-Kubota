<template>
  <div>
    <a-form-model ref="distributors" :model="distributors" :label-col="{ span: 4 }" :wrapper-col="{ span: 6 }" >
      <div v-for="(name, index) in distributors.names" :key="index" >
        <a-form-model-item
          :label="name.nameLG"
          :prop="'names.' + index + '.content'"
          :rules="{
            required: name.isRequired ? true : false,
            message: $t('messValidate.requiredDistributorName'),
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
        <a-button type="primary" html-type="submit" :disabled="isSubmit" @click="handleSubmit">{{ $t('commonText.btnSave') }}</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
  import { mapActions } from "vuex";
  export default {
    props: ['isEdit', 'initData'],
    data() {
      return {
        errors: {},
        isSubmit: false,
        distributors: this.initData
      };
    },
    methods: {
      ...mapActions({
        addDistributor: 'distributors/addDistributor',
        editDistributor: 'distributors/editDistributor'
      }),
      handleSubmit() {
        this.isSubmit = true;
        this.$refs.distributors.validate(async valid => {
          if (valid) {
            this.distributors = {
              ...this.distributors,
              names: this.distributors.names.map(it => ({...it, content: it.content.trim()})),
              savedBy: this.getUserName(this.$keycloak.token)
            }
            if(!this.isEdit) {
              const resAdd = await this.addDistributor(this.distributors);
              if (resAdd.status == 200) {
                this.$router.push('/distributors');
              } else {
                this.errors = resAdd;
                this.isSubmit = false;
              }
            } else {
              const resEdit = await this.editDistributor(this.distributors);
              if (resEdit.status == 200) {
                this.$router.push('/distributors');
              } else {
                this.errors = resEdit;
              }
            }
          }
          this.isSubmit = false;
        });
      },
      handleChangeInput(nameField) {
        this.errors = this.getError(this.errors, nameField, true);
      },
    },
  };
</script>