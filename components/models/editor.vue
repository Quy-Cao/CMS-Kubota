<template>
  <div>
    <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
      <a-form-item :label="$t('models.lableModel')">
        <a-input
        @change="handleChangeInput('name')"
          v-decorator="[
            'name',
            {
              initialValue: getContentLocale(model.names, getLocaleDefault(listLanguage)),
              rules: [{ required: true, message: $t('messValidate.requiredModeNname') }]
            }
          ]"
        />
        <div class="ant-form-explain txt-danger" v-if="this.getError('names-en', false)">{{ this.getError('names-en', false) }}</div>
      </a-form-item>
      <a-form-item :label="$t('models.lableDistributor')" >
        <a-select
          v-decorator="[
            'distributorId',
            {
              initialValue: model.distributorId,
              rules: [{ required: true, message: $t('messValidate.requiredModelDistributor') }]
            },
          ]"
          placeholder="Please select a distributor"
        >
          <a-select-option v-for="distributor in distributors" :key="distributor.distributorId">
            {{ getContentLocale(distributor.names, getLocaleDefault(listLanguage)) }}
          </a-select-option>
        </a-select>
        <div class="ant-form-explain txt-danger" v-if="this.getError('distributorId', false)">{{ this.getError('distributorId', false) }}</div>
      </a-form-item>
      <a-form-item
        :label="$t('models.txtTracking')"
        :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
        class="d-flex mb-0 txt-label mt-3"
      >
        <div class="d-flex flex-column">
          <a :href="model.trackingPath" class="line-height-normal text-word-break mb-1">{{ model.trackingPath }}</a>
          <div class="d-flex">
            <input
              type="file"
              ref="fileModelTracking"
              class="custom-file-input file-input-default"
              @change="handleUploadFile($event, FILE_UPLOAD.MODEL_TRACKING)"
              @click="$refs.fileModelTracking.value=null"
            >
            <p v-if="nameModelTracking" class="d-flex flex-column ml-3 mb-0">
              <span class="line-height-normal">{{ nameModelTracking }}</span>
              <a class="txt-danger line-height-normal" @click="deleteFile(FILE_UPLOAD.MODEL_TRACKING)"><u>{{ $t('commonText.txtUnchoose') }}</u></a>
            </p>
          </div>
          <span v-if="errorModelTracking" class="txt-danger">{{ errorModelTracking }}</span>
        </div>
      </a-form-item>
      <a-row>
        <a-col offset="4">
          <span class="font-12px">{{ $t('model3D.noteFileTracking') }}</span>
        </a-col>
      </a-row>
      <a-form-item
        :label="$t('models.txtTrackingLeft')"
        class="d-flex mb-0 txt-label mt-3"
        :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
      >
        <div class="d-flex flex-column">
          <a :href="model.trackingConfigLeftPath" class="line-height-normal text-word-break mb-1">{{ model.trackingConfigLeftPath }}</a>
          <div class="d-flex">
            <input
              type="file"
              ref="fileTrackingLeft"
              class="custom-file-input file-input-default"
              @change="handleUploadFile($event, FILE_UPLOAD.TRACKING_LEFT)"
              @click="$refs.fileTrackingLeft.value=null"
            >
            <p v-if="nameTrackingLeft" class="d-flex flex-column ml-3 mb-0">
              <span  class="line-height-normal">{{ nameTrackingLeft }}</span>
              <a class="txt-danger line-height-normal" @click="deleteFile(FILE_UPLOAD.TRACKING_LEFT)"><u>{{ $t('commonText.txtUnchoose') }}</u></a>
            </p>
          </div>
          <span v-if="errorTrackingLeft" class="txt-danger">{{ errorTrackingLeft }}</span>
        </div>
      </a-form-item>
      <a-row>
        <a-col offset="4">
          <span class="font-12px">{{ $t('model3D.noteFileConfig') }}</span>
        </a-col>
      </a-row>
      <a-form-item
        :label="$t('models.txtTrackingRight')"
        class="d-flex mb-0 txt-label mt-3"
        :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
      >
        <div class="d-flex flex-column">
          <a :href="model.trackingConfigRightPath" class="line-height-normal text-word-break mb-1">{{ model.trackingConfigRightPath }}</a>
          <div class="d-flex">
            <input
              type="file"
              ref="fileTrackingRight"
              class="custom-file-input file-input-default"
              @change="handleUploadFile($event, FILE_UPLOAD.TRACKING_RIGHT)"
              @click="$refs.fileTrackingRight.value=null"
            >
            <p v-if="nameTrackingRight" class="d-flex flex-column ml-3 mb-0">
              <span  class="line-height-normal">{{ nameTrackingRight }}</span>
              <a class="txt-danger line-height-normal" @click="deleteFile(FILE_UPLOAD.TRACKING_RIGHT)"><u>{{ $t('commonText.txtUnchoose') }}</u></a>
            </p>
          </div>
          <span v-if="errorTrackingRight" class="txt-danger">{{ errorTrackingRight }}</span>
        </div>
      </a-form-item>
      <a-row>
        <a-col offset="4">
          <span class="font-12px">{{ $t('model3D.noteFileConfig') }}</span>
        </a-col>
      </a-row>
      <a-form-item :wrapper-col="{ span: 12, offset: 4 }" class="mt-3">
        <a-button type="primary" html-type="submit" :disabled="isSubmit">{{ $t('commonText.btnSave') }}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
  import { mapActions, mapState, mapMutations } from "vuex";
  import store from '~/store'
  import { uploadFile } from '~/plugins/upload-azure';
  import { FILE_UPLOAD, FILE_SIZE } from '~/plugins/constant';
  export default {
    props: ['isEdit', 'initData'],
    data() {
      return {
        formLayout: 'horizontal',
        form: this.$form.createForm(this, { name: 'editorModel' }),
        errors: {},
        isSubmit: false,
        errorModelTracking: '',
        errorTrackingLeft: '',
        errorTrackingRight: '',
        model: this.initData,
        modelTracking: [],
        modelTrackingLeft: [],
        modelTrackingRight: [],
        FILE_UPLOAD,
        nameModelTracking: '',
        nameTrackingLeft: '',
        nameTrackingRight: '',
      };
    },
    computed: {
      ...mapState({
        distributors: state => state.distributors.distributors,
        listLanguage: state => state.languages.listLanguage
      })
    },
    mounted() {
      this.getListDistributors();
    },
    methods: {
      ...mapActions({
        addModel: 'models/addModel',
        editModel: 'models/editModel',
        getListDistributors: 'distributors/getListDistributors',
        getBlobSasUri: 'models/getBlobSasUri'
      }),

      handleUploadFile(e, text) {
        var file = e.target.files;
        var fileSize = file[0].size/1024/1024;
        switch (text) {
          case FILE_UPLOAD.MODEL_TRACKING:
            if(fileSize < FILE_SIZE.MAX_SIZE) {
              if(file[0].name.includes('fbx')) {
                this.modelTracking = file;
                this.nameModelTracking = file[0].name;
                this.errorModelTracking = '';
              } else {
                this.nameModelTracking = file[0].name;
                this.errorModelTracking = this.$t('titleFormModal.messErrorTypeTracking');
              }
            } else {
              this.nameModelTracking = file[0].name;
              this.errorModelTracking = this.$t('titleFormModal.messErrorUploadFileSize');
            }
            break;
          case FILE_UPLOAD.TRACKING_LEFT:
            if(fileSize < FILE_SIZE.MAX_SIZE) {
              if(!file[0].name.includes('fbx') && (file[0].type === '' || file[0].type === 'vl')) {
                this.modelTrackingLeft = file;
                this.nameTrackingLeft = file[0].name;
                this.errorTrackingLeft = '';
              } else {
                this.nameTrackingLeft = file[0].name;
                this.errorTrackingLeft = this.$t('titleFormModal.messErrorTypeFile')
              }
            } else {
              this.nameTrackingLeft = file[0].name;
              this.errorTrackingLeft = this.$t('titleFormModal.messErrorUploadFileSize');
            }
            break;
          case FILE_UPLOAD.TRACKING_RIGHT:
            if(fileSize < FILE_SIZE.MAX_SIZE) {
              if(!file[0].name.includes('fbx') && (file[0].type === '' || file[0].type === 'vl')) {
                this.modelTrackingRight = file;
                this.nameTrackingRight = file[0].name;
                this.errorTrackingRight = '';
              } else {
                this.nameTrackingRight = file[0].name;
                this.errorTrackingRight = this.$t('titleFormModal.messErrorTypeFile')
              }
            } else {
              this.nameTrackingRight = file[0].name;
              this.errorTrackingRight = this.$t('titleFormModal.messErrorUploadFileSize');
            }
            break;
        }
      },

      async handleCallApiAddEdit(values, names) {
        if (!this.isEdit) {
          const { seriesId } = this.$route.query;
          values = {
            ...values,
            names,
            seriesId: _.parseInt(seriesId),
          }
          const resAdd = await this.addModel(values);
          if (resAdd.status == 200) {
            this.$router.push(`/errorCodes?modelId=${resAdd.data.modelId}`);
          } else {
            this.errors = resAdd;
          }
        } else {
          const { modelId } = this.model;
          values = {
            ...values,
            modelId,
          };
          const resEdit = await this.editModel(values);
          if (resEdit.status == 200) {
            this.$router.push(`/errorCodes?modelId=${modelId}`);
          } else {
            this.errors = resEdit;
          }
        }
      },
      handleSubmit(e) {
        e.preventDefault();
        this.isSubmit = true;
        this.form.validateFields(async (err, values) => {
          if (!err && this.errorModelTracking == '' && this.errorTrackingLeft == '' && this.errorTrackingRight == '') {
            let names = [];
            _.forEach(this.listLanguage, language => {
              const name = {
                locale: language.locale,
                content: _.trim(values.name)
              }
              names.push(name);
            });
            let resApi = await this.getBlobSasUri();
            if(resApi.status == 200) {
              values = {
                ...values,
                names,
                trackingPath: _.isEmpty(this.modelTracking) ? this.model.trackingPath : (await uploadFile(this.modelTracking, resApi.sasUri)).split('?')[0],
                trackingConfigLeftPath: _.isEmpty(this.modelTrackingLeft) ? this.model.trackingConfigLeftPath : (await uploadFile(this.modelTrackingLeft, resApi.sasUri)).split('?')[0],
                trackingConfigRightPath: _.isEmpty(this.modelTrackingRight) ? this.model.trackingConfigRightPath : (await uploadFile(this.modelTrackingRight, resApi.sasUri)).split('?')[0]
              };
              this.handleCallApiAddEdit(values, names);
            } else {
              this.$confirm({
                title: this.$t('titleFormModal.messErrorServerUpload'),
                onOk: async () => {
                  values = {
                    ...values,
                    names,
                    trackingPath: _.isEmpty(this.modelTracking) ? this.model.trackingPath : '',
                    trackingConfigLeftPath: _.isEmpty(this.modelTrackingLeft) ? this.model.trackingConfigLeftPath : '',
                    trackingConfigRightPath: _.isEmpty(this.modelTrackingRight) ? this.model.trackingConfigRightPath : ''
                  };
                  this.handleCallApiAddEdit(values, names);
                }
              });
            }
          }
          this.isSubmit = false;
        });
      },
      deleteFile(name) {
        if(name === FILE_UPLOAD.MODEL_TRACKING) {
          this.nameModelTracking = '';
          this.modelTracking = [];
          this.errorModelTracking = '';
        } else if(name === FILE_UPLOAD.TRACKING_LEFT) {
          this.nameTrackingLeft = '';
          this.modelTrackingLeft = [];
          this.errorTrackingLeft = '';
        } else {
          this.nameTrackingRight = '';
          this.modelTrackingRight = [];
          this.errorTrackingRight = '';
        }
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
