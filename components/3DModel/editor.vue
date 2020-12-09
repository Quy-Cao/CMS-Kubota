<template>
  <div>
    <a-form-model ref="dataForm" :model="dataForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 6 }" >
      <a-form-model-item
        :label-col="{ span: 4 }" :wrapper-col="{ span: 6 }"
        :label="$t('model3D.txtName')"
        prop="identityName"
        :rules="{
          required: true,
          message: $t('messValidate.required3DModel'),
          trigger: 'change',
        }"
      >
        <a-input
          @change="handleChangeInput('identityName')"
          v-model="dataForm.identityName"
        >
        </a-input>
        <div class="ant-form-explain txt-danger" v-if="getError(errors, 'identityName', false)">{{ getError(errors, 'identityName', false) }}</div>
      </a-form-model-item>
      <a-form-model-item
        :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
        :label="$t('model3D.txtFileIos')"
        prop="urlIos"
        class="d-flex mb-0 txt-label mt-3"
      >
        <div class="d-flex flex-column">
          <a class="line-height-normal text-word-break mb-1" :href="dataForm.urlIos">{{ dataForm.urlIos }}</a>
          <div class="d-flex">
            <input
              type="file"
              ref="fileIos"
              class="custom-file-input file-input-default"
              @change="handleUploadFile($event, FILE_UPLOAD.FILE_IOS)"
              @click="$refs.fileIos.value=null"
            >
            <p v-if="nameFileIos" class="d-flex flex-column ml-3 mb-0">
              <span class="line-height-normal">{{ nameFileIos }}</span>
              <a class="txt-danger line-height-normal" @click="deleteFile(FILE_UPLOAD.FILE_IOS)"><u>{{ $t('commonText.txtUnchoose') }}</u></a>
            </p>
          </div>
          <span v-if="errorFileIos" class="txt-danger">{{ errorFileIos }}</span>
        </div>
      </a-form-model-item>
      <a-row>
        <a-col offset="4">
          <span class="font-12px">{{ $t('model3D.noteFileApp') }}</span>
        </a-col>
      </a-row>
      <a-form-model-item
        :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
        :label="$t('model3D.txtFileAndroid')"
        prop="urlAndroid"
        class="d-flex mb-0 txt-label mt-3"
      >
        <div class="d-flex flex-column">
          <a class="line-height-normal text-word-break mb-1" :href="dataForm.urlAndroid">{{ dataForm.urlAndroid }}</a>
          <div class="d-flex">
            <input
              type="file"
              ref="fileAndroid"
              class="custom-file-input file-input-default"
              @change="handleUploadFile($event, FILE_UPLOAD.FILE_ANDROID)"
              @click="$refs.fileAndroid.value=null"
            >
            <p v-if="nameFileAndroid" class="d-flex flex-column ml-3 mb-0">
              <span class="line-height-normal">{{ nameFileAndroid }}</span>
              <a class="txt-danger line-height-normal" @click="deleteFile(FILE_UPLOAD.FILE_ANDROID)"><u>{{ $t('commonText.txtUnchoose') }}</u></a>
            </p>
          </div>
          <span v-if="errorAndroid" class="txt-danger">{{ errorAndroid }}</span>
        </div>
      </a-form-model-item>
      <a-row>
        <a-col offset="4">
          <span class="font-12px">{{ $t('model3D.noteFileApp') }}</span>
        </a-col>
      </a-row>
      <a-form-model-item
        :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }"
        :label="$t('model3D.txtParts')"
        prop="partModels"
        class="d-flex txt-label mt-3"
      >
        <div class="d-flex align-item-center">
          <input
            @change="handleUploadFile($event, FILE_UPLOAD.FILE_CSV)"
            ref="fileInput"
            type="file"
            class="custom-file-input file-input-csv"
            id="uploadCSVFile"
            @click="$refs.fileInput.value=null"
          >
          <p v-if="nameFileCSV" class="d-flex flex-column ml-3 mb-0">
            <span class="line-height-normal">{{ nameFileCSV }}</span>
            <a class="txt-danger line-height-normal" @click="deleteFile(FILE_UPLOAD.FILE_CSV)"><u>{{ $t('commonText.txtUnchoose') }}</u></a>
          </p>
        </div>
        <span v-if="errorCsv" class="txt-danger">{{ errorCsv }}</span>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 12, offset: 4 }">
        <a-button class="mt-1" type="primary" html-type="submit" :disabled="isSubmit" @click="handleSubmit">{{ $t('commonText.btnSave') }}</a-button>
      </a-form-model-item>
    </a-form-model>
    <div v-if="isEdit">
      <hr class="hr mt-2 mb-3">
      <p class="font-18px txt-main d-flex justify-space-between align-item-center">
        <b>List part</b>
        <a-button type="primary" @click="addPart">{{ $t('model3D.txtAddPart') }}</a-button>
      </p>
      <a-table
        :columns="columns"
        :data-source="dataForm.partModels"
        :pagination="false"
        class="table-action"
      >
        <span slot="identityName" class="font-16px font-weight-bold" slot-scope="text" >{{ text }}</span>
        <div slot="action" slot-scope="action" class="txt-right pr-3">
          <a class="" @click="editPart(action.partModelId)"><u>{{ $t('commonText.actionEdit') }}</u></a>
          <a class="ml-4 txt-danger-bold" @click="showConfirmDeletePartModel(action.partModelId)"><u>{{ $t('commonText.actionDelete') }}</u></a>
        </div>
      </a-table>
    </div>
    <a-modal v-model="isShowModal" title="" @cancel="handleCancel" :footer="null" :dialogStyle="{animationDuration: isShowModal ? '0.4s' : '', display: isShowModal ? '' : 'none'}">
      <p class="font-18px m-0">
        <b>{{ isAddPart ? $t('model3D.txtAddPart') : $t('model3D.txtEditPart') }}</b>
      </p>
      <a-form :form="formPart" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" @submit="handleSubmitFormPart" class="mt-4">
        <a-form-item label="Part name">
          <a-input
            @change="handleChangeInputPart('identityName')"
            v-decorator="[
              'identityName',
              {
                initialValue: partDetail.identityName,
                rules: [{ required: true, message: $t('messValidate.requiredPartName') }]
              }
            ]"
          />
          <div class="ant-form-explain txt-danger" v-if="getError(errorsPart, 'identityName', false)">{{ getError(errorsPart, 'identityName', false) }}</div>
        </a-form-item>
        <a-form-item label="Part detail">
          <a-input
            @change="handleChangeInputPart('pathHighlight')"
            type="textarea"
            :auto-size="{ minRows: 2, maxRows: 5 }"
            v-decorator="[
              'pathHighlight',
              {
                initialValue: partDetail.pathHighlight,
                rules: [{ required: true, message: $t('messValidate.requiredPartDetail') }]
              }
            ]"
          />
          <div class="ant-form-explain txt-danger" v-if="getError(errorsPart, 'pathHighlight', false)">{{ getError(errorsPart, 'pathHighlight', false) }}</div>
        </a-form-item>
        <p class="txt-center mt-4">
          <a-button class="mr-2" @click="handleCancel">{{ $t('commonText.txtCancel') }}</a-button>
          <a-button type="primary"  html-type="submit">{{ $t('commonText.btnSave') }}</a-button>
        </p>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
  import { mapActions, mapState } from "vuex";
  import { uploadFile } from '~/plugins/upload-azure';
  import { FILE_UPLOAD, FILE_SIZE } from '~/plugins/constant';

  export default {
    props: ['isEdit', 'initData'],
    data() {
      return {
        errors: {},
        isSubmit: false,
        isShowModal: false,
        isAddPart: true,
        nameFileCSV: '',
        nameFileIos: '',
        nameFileAndroid: '',
        dataForm: _.cloneDeep(this.initData),
        listParts: [],
        errorsPart: {},
        columns: [
          {
            title: this.$t('model3D.txtPartName'),
            dataIndex: 'identityName',
            key: 'identityName',
            scopedSlots: { customRender: 'identityName' },
            width: '30%'
          },
          {
            title: this.$t('model3D.txtPartDetail'),
            dataIndex: 'pathHighlight',
            key: 'pathHighlight',
            scopedSlots: { customRender: 'pathHighlight' },
          },
          {
            title: '',
            key: 'action',
            scopedSlots: { customRender: 'action' },
            width: '150px',
          }
        ],
        formPartLayout: 'horizontal',
        formPart: this.$form.createForm(this, { name: 'formPart' }),
        partDetail: {
          identityName: '',
          pathHighlight: ''
        },
        fileIOS: [],
        fileAndroid: [],
        FILE_UPLOAD,
        errorFileIos: '',
        errorAndroid: '',
        errorCsv: ''
      };
    },
    computed: {
      ...mapState({
        model3DDetail: state=> state.model3D.model3DDetail
      })
    },
    methods: {
      ...mapActions({
        addModel3D: 'model3D/addModel3D',
        editModel3D: 'model3D/editModel3D',
        addModelPart: 'model3D/addModelPart',
        editModelPart: 'model3D/editModelPart',
        getInfoPartModel: 'model3D/getInfoPartModel',
        getModel3DDetail: 'model3D/getModel3DDetail',
        deletePartModel: 'model3D/deletePartModel',
        getBlobSasUri: 'models/getBlobSasUri'
      }),
      handleUploadFile(e, text) {
        var file = e.target.files || e.dataTransfer.files;
        var fileSize = file[0].size/1024/1024;
        switch (text) {
          case FILE_UPLOAD.FILE_IOS:
            if(fileSize < FILE_SIZE.MAX_SIZE) {
              if(file[0].type === "" || file[0].type === "vl" || file[0].type === "fbx") {
                this.fileIOS = file;
                this.nameFileIos = file[0].name;
                this.errorFileIos = '';
              } else {
                this.nameFileIos = file[0].name;
                this.errorFileIos = this.$t('titleFormModal.messErrorTypeFile');
              }
            } else {
              this.nameFileIos = file[0].name;
              this.errorFileIos = this.$t('titleFormModal.messErrorUploadFileSize');
            }
            break;
          case FILE_UPLOAD.FILE_ANDROID:
            if(fileSize < FILE_SIZE.MAX_SIZE) {
              if((file[0].type === "" || file[0].type === "vl" || file[0].type === "fbx")) {
                this.fileAndroid = file;
                this.nameFileAndroid = file[0].name;
                this.errorAndroid = '';
              } else {
                this.nameFileAndroid = file[0].name;
                this.errorAndroid = this.$t('titleFormModal.messErrorTypeFile')
              }
            } else {
              this.nameFileAndroid = file[0].name;
              this.errorAndroid = this.$t('titleFormModal.messErrorUploadFileSize');
            }
            break;
          case FILE_UPLOAD.FILE_CSV:
            if(fileSize < FILE_SIZE.MAX_SIZE) {
              if((file[0].name.split(".")[1] === "csv")) {
                if (!file.length)
                  return;
                this.nameFileCSV = file[0].name;
                const reader = new FileReader();
                reader.readAsText(file[0]);
                reader.onload = () => {
                  const text = reader.result;
                  const csvToJson = this.csvJSON(text);
                  this.listParts = csvToJson;
                };
                this.errorCsv = '';
              } else {
                this.nameFileCSV = file[0].name;
                this.errorCsv = this.$t('titleFormModal.messErrorFileCsv')
              }
            } else {
              this.nameFileCSV = file[0].name;
              this.errorCsv = this.$t('titleFormModal.messErrorUploadFileSize');
            }
            break;
        }
      },
      async handleAddEdit3DModel(data) {
        let resApi;
        if(!this.isEdit) {
          resApi = await this.addModel3D(data);
        } else {
          data = {
            ...data,
            displayModelId: this.$route.params.slug
          }
          resApi = await this.editModel3D(data);
        }
        if (resApi.status == 200 ) {
          this.$router.push('/media/3DModels');
        } else {
          this.errors = resApi;
        }
      },
      handleSubmit() {
        this.isSubmit = true;
        this.$refs.dataForm.validate(async valid => {
          if (valid && this.errorFileIos == '' && this.errorAndroid == '' && this.errorCsv == '') {
            let resApi = await this.getBlobSasUri();
            if(resApi.status == 200) {
              let data = {
                ...this.dataForm,
                identityName: _.trim(this.dataForm.identityName),
                partModels: this.listParts,
                urlIos: _.isEmpty(this.fileIOS) ? this.dataForm.urlIos : (await uploadFile(this.fileIOS, resApi.sasUri)).split("?")[0],
                urlAndroid: _.isEmpty(this.fileAndroid) ? this.dataForm.urlAndroid : (await uploadFile(this.fileAndroid, resApi.sasUri)).split("?")[0],
                savedBy: this.getUserName(this.$keycloak.token)
              }
              this.handleAddEdit3DModel(data);
            } else {
              this.$confirm({
                title: this.$t('titleFormModal.messErrorServerUpload'),
                onOk: async () => {
                  let data = {
                    ...this.dataForm,
                    partModels: this.listParts,
                    urlIos: _.isEmpty(this.fileIOS) ? this.dataForm.urlIos : '',
                    urlAndroid: _.isEmpty(this.fileAndroid) ? this.dataForm.urlAndroid : '',
                  }
                  this.handleAddEdit3DModel(data);
                }
              });
            }
          }
          this.isSubmit = false;
        });
      },
      handleChangeInput(nameField) {
        this.getError(this.errors, nameField, true);
      },

      deleteFile(name) {
        if(name === FILE_UPLOAD.FILE_ANDROID) {
          this.nameFileAndroid = '';
          this.fileAndroid = [];
          this.errorAndroid = '';
        } else if (name === FILE_UPLOAD.FILE_CSV) {
          this.nameFileCSV = '';
          this.listParts = [];
          this.errorCsv = '';
        } else {
          this.nameFileIos = '';
          this.fileIOS = [];
          this.errorFileIos = '';
        }
      },
      csvJSON(csvText) {
        let lines = [];
        const linesArray = csvText.split('\n');
        linesArray.forEach((e) => {
          const row = e.replace(/[\s]+[,]+|[,]+[\s]+/g, ',').trim();
          lines.push(row);
        });

        if (linesArray[0].split(",").length != 2) {
          this.errorCsv = 'The file is invalid';
          return;
        }
        this.errorCsv = '';

        lines.splice(lines.length - 1, 1);
        const result = [];
        const headers = ['identityName', 'pathHighlight'];
        for (let i = 1; i < lines.length; i++) {
          const obj = {};
          const currentline = lines[i].split(",");
          for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
          }
          result.push(obj);
        }
        return result;
      },
      addPart() {
        this.isAddPart = true;
        this.isShowModal = true;
      },
      async editPart(partModelId) {
        this.isAddPart = false;
        this.isShowModal = true;
        const resInfoPartModel = await this.getInfoPartModel(partModelId);
        if (resInfoPartModel.status == 200) {
          this.partDetail = resInfoPartModel.data;
        }
      },
      handleCancel() {
        this.isAddPart = true;
        this.isShowModal = false;
        this.partDetail = {
          identityName: '',
          pathHighlight: ''
        }
        this.formPart.resetFields();
        this.errorsPart = {};
      },
      handleSubmitFormPart(e) {
        e.preventDefault();
        this.formPart.validateFields(async (err, values) => {
          values =  {
            ...values,
            displayModelId: this.dataForm.displayModelId,
            savedBy: this.getUserName(this.$keycloak.token)
          }

          if (!this.isAddPart) {
            values = {
              ...values,
              partModelId: this.partDetail.partModelId
            }
          }

          if (!err) {
            const resSavePart = this.isAddPart ? await this.addModelPart(values) : await this.editModelPart(values);
            if (resSavePart.status == 200) {
              this.resetDataForm();
              this.isShowModal = false;
              this.partDetail = {
                identityName: '',
                pathHighlight: ''
              }
              this.formPart.resetFields();
            } else {
              this.errorsPart = resSavePart;
            }
          }
        });
      },
      showConfirmDeletePartModel(partModelId) {
        this.$confirm({
          title: this.$t('titleFormModal.messDelete3DModel'),
          onOk: async () => {
            const resDelete = await this.deletePartModel({
              partModelId,
              displayModelId: this.$route.params.slug,
              savedBy: this.getUserName(this.$keycloak.token)
            });
            if (resDelete.status == 200) {
              this.$success({
                title: 'This Part model delete',
              });
              this.resetDataForm();
            } else {
              this.$warning({
                title: this.$t('titleFormModal.messErrorDelete3DModel'),
              });
            }
          }
        });
      },
      async resetDataForm() {
        const resApi = await this.getModel3DDetail(this.$route.params.slug);
        if (resApi.status == 200) {
          this.dataForm = this.model3DDetail;
        }
      },
      handleChangeInputPart(nameField) {
        this.getError(this.errorsPart, nameField, true);
      },
    },
  };
</script>