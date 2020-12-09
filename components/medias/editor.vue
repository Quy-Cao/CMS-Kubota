<template>
  <div>
    <a-form-model ref="formMedia" :model="formMedia">
      <a-form-model-item>
        <div v-if="formMedia.type == TYPE_MEDIA.IMAGES">
          <img :src="uriFile" class="uri-file">
        </div>
        <div v-else>
          <video :src="uriFile" controls class="uri-file"></video>
        </div>
        <p class="txt-danger" v-if="!uriFile">No file upload!</p>
      </a-form-model-item>
      <a-form-model-item
        :label="$t('medias.titleFileName')"
        prop="fileName"
        :rules="{
          required: true,
          message: $t('messValidate.requiredFileName'),
          trigger: 'change'
        }"
        :label-col="{ span: 4 }" :wrapper-col="{ span: 10 }"
      >
        <a-input
          v-model="formMedia.fileName"
          @change="handleChangeEditor('fileName')"
        ></a-input>
        <div class="ant-form-explain txt-danger" v-if="getError(errors, 'fileName' , false)">{{ getError(errors, 'fileName' , false) }}</div>

      </a-form-model-item>
      <!-- <p class="font-18px font-weight-bold">{{ $t('medias.titleCaption') }}</p> -->
      <!-- <div v-for="(name, index) in formMedia.names" :key="index">
        <a-form-model-item :label="name.nameLG"
          :prop="'names.' + index + '.content'"
          :rules="{
            required: name.isRequired ? true : false,
            message: $t('messValidate.requiredCaption'),
            trigger: 'change',
          }"
          :label-col="{ span: 4 }" :wrapper-col="{ span: 10 }"
          >
            <a-input
              type="textarea"
              :auto-size="{ minRows: 5, maxRows: 10 }"
              v-model="name.content"
              @change="handleChangeEditor(`names-${name.locale}`)"
            ></a-input>
            <div class="ant-form-explain txt-danger" v-if="getError(errors, `names-${name.locale}`, false)">{{ getError(errors, `names-${name.locale}`, false) }}</div>
        </a-form-model-item>
      </div> -->
      <a-row>
        <a-col :span="4">
        </a-col>
        <a-col :span="10">
          <a-button type="primary" :disabled="isSubmit || !uriFile"  @click="handleSubmit('formMedia')">Save</a-button>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>
<script>
  import { mapActions } from "vuex";
  import { serialize } from 'object-to-formdata';
  import { TYPE_MEDIA } from "~/plugins/constant";
  export default {
    props: ['isEdit', 'initData', 'type'],
    data() {
      return {
        TYPE_MEDIA,
        errors: {},
        isSubmit: false,
        formMedia: this.initData,
        uriFile: ''
      }
    },
    mounted() {
      if (this.isEdit) {
        this.uriFile = this.initData.path;
      } else {
        if (!_.isNil(this.initData.file)) {
          this.createImage(this.initData.file);
        }
      }
    },
    methods: {
      ...mapActions({
        addMedia: 'medias/addMedia',
        editMedia: 'medias/editMedia',
      }),
      handleSubmit(formName) {
        this.isSubmit = true;
        this.$refs[formName].validate(async valid => {
          this.formMedia = {
            ...this.formMedia,
            fileName: _.trim(this.formMedia.fileName),
            savedBy: this.getUserName(this.$keycloak.token)
          }
          if (valid) {
            let resApi;
            if (this.isEdit) {
              resApi = await this.editMedia(this.formMedia);
            } else {
              const formData = serialize(this.formMedia);
              resApi = await this.addMedia(formData);
            }
            if (resApi.status == 200 ) {
              this.$router.push(this.formMedia.type == TYPE_MEDIA.IMAGES ? '/media/images' : '/media/videos');
            } else {
              this.errors = resApi;
            }
          }
          this.isSubmit = false;
        });
      },
      createImage(file) {
        let reader = new FileReader();
        let vm = this;
        reader.onload = (e) => {
          vm.uriFile = e.target.result;
        };
        reader.readAsDataURL(file);
      },
      handleChangeEditor(nameField) {
        this.getError(this.errors, nameField, true);
      }
    }
  }
</script>
