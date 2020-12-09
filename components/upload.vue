<template>
  <div>
    <div :id="previewImgID" class="dropzone-preview-img mb-2" v-if="urlPreview != ''">
      <div class="preview">
        <img :src="urlPreview">
      </div>
      <a class="txt-danger-bold drop-delete" @click="removedFile"><u>Delete</u></a>
    </div>
    <div
      class="d-flex align-items-center in-progress p-2 justify-content-center border mb-2"
      v-if="isProcessing"
      >
        <div class="progress w-100">
          <a-progress type="circle" :percent="75" :width="70"/>
        </div>
      </div>
    <dropzone
      id="idInput"
      ref="uploadDropzone"
      name="image"
      :options="dropzoneOptions"
      @vdropzone-success="success"
      @vdropzone-complete="complete"
      @vdropzone-file-added="addedFile"
      @vdropzone-error="error"
      @vdropzone-sending="sending"
    >
      <div class="dz-message" data-dz-message v-if="urlPreview != ''"><a><u>Upload</u></a></div>
      <div class="dz-message" data-dz-message v-else>
        <button type="button" class="ant-btn"><span>Upload thumbnail</span></button>
      </div>
    </dropzone>
    <p class="txt-danger p-0" v-if="isErrorPhoto">Jpeg or png file that is max 2M.</p>
    <p class="txt-danger p-0" v-if="isErrorUpload">{{ $t('uploadPhoto.mesgErrorUploadPhoto') }}</p>
  </div>
</template>
<script>
    import Dropzone from "nuxt-dropzone";
    import "nuxt-dropzone/dropzone.css";
    import { API_URL } from "~/plugins/constant.js";
    import { mapActions } from "vuex";

    export default {
        components: {
            Dropzone
        },
        props: ["maxFiles", "idInput", "imageWidth", "imageHeight", "idData", "url"],
        data() {
          return {
            dropzoneOptions: {
              headers:{"Authorization": `Bearer ${this.$keycloak.token}`},
              url: API_URL.apiUploadThumbnail,
              method: "post",
              thumbnailWidth: 150,
              maxFilesize: 100,
              acceptedFiles: "image/jpeg, image/png",
              paramName: "file",
              addRemoveLinks: true,
              params: { }
            },
            urlPreview: this.url ? this.url : '',
            isProcessing: false,
            isErrorUpload: false,
            previewImgID: "previewImg_" + new Date().getTime(),
            isErrorPhoto: false
          };
        },
        mounted: function() {
          this.styleImage = this.getImageWidthHeight();
        },
        methods: {
          ...mapActions({
            deleteThumbnail: 'series/deleteThumbnail'
          }),
          addedFile(file) {
            this.isProcessing = true;
            this.isErrorUpload = false;
            this.isErrorPhoto = false;
            this.urlPreview = '';
            if (file.type == "image/jpeg" || file.type == "image/png") {
              if (file.size > 2097152) {
                this.handleErrorImage(file);
              }
            } else {
              this.handleErrorImage(file);
            }
          },
          sending(file, xhr, formData) {
            formData.append('seriesId', this.idData);
          },
          success(file, response) {
            if (response.status == 200) {
              this.isProcessing = false;
              this.urlPreview = response.data.thumbPath;
            } else {
              this.isErrorUpload = true;
            }
          },
          complete(file) {
            if (file.status == "error") {
              this.$refs.uploadDropzone.removeFile(file);
            }
            this.isProcessing = false;
          },
          error(file, message, xhr) {
            console.log(file, message, xhr);
          },
          getImageWidthHeight() {
            return {
              width: this.imageWidth + "px",
              height: this.imageHeight + "px"
            };
          },
          async removedFile() {
            this.$confirm({
              title: 'Do you want to delete this Thumbnail?',
              onOk: async () => {
                const resDelete = await this.deleteThumbnail(this.idData);
                if (resDelete.status == 200) {
                  this.urlPreview = '';
                }
              }
            });
          },
          handleErrorImage(file) {
            const oldUrl = this.url ? _.cloneDeep(this.url) : '';
            this.isProcessing = false;
            this.isErrorPhoto = true;
            this.$refs.uploadDropzone.removeFile(file);
            this.urlPreview = oldUrl;
          }
        }
    };
</script>
<style>
    .dropzone {
      border: none;
      padding: 0;
      min-height: unset;
      max-width: 120px;
    }
    .dz-preview {
      display: none !important;
    }
    .dropzone:hover {
      background: #fff;
    }
    .dropzone .dz-message {
      margin: 0 !important;
      text-align: left;
      display: block !important;
    }

    .dropzone-preview-img {
      width: 120px;
      height: 120px;
      position: relative;
    }

    .preview {
      width: 100%;
      height: 100%;
      border: solid 1px #979797;
      padding: 3px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .preview img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .preview:hover,
    .preview.preview-click {
      border-color: #00a8a9;
    }

    .loading-upload {
      top: 0;
      left: 0;
    }

    .in-progress {
      width: 120px;
      height: 120px;
      margin-right: 20px;
      box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);
    }

    .progress {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .drop-delete {
      position: absolute;
      bottom: -29px;
      right: 20px;
    }
</style>
