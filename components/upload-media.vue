<template>
  <div>
    <input
      type="file"
      @change="onFileChange"
      class="custom-file-input"
      :class="type == TYPE_MEDIA.VIDEOS ? 'upload-video' : ''"
      :accept="acceptFiles"
      ref="fileInput"
      @click="$refs.fileInput.value=null"
    >
  </div>
</template>
<script>
  import { mapMutations } from "vuex";
  import { TYPE_MEDIA, FILE_SIZE } from "~/plugins/constant";

  export default {
    props: ["type"],
    data() {
      return {
        TYPE_MEDIA,
        image: '',
        acceptFiles: ''
      }
    },
    mounted: function() {
      this.initData();
    },
    methods: {
      ...mapMutations({
        setFileState: 'medias/setFileState'
      }),
      initData() {
        if (this.type == TYPE_MEDIA.IMAGES) {
          this.acceptFiles = 'image/*';
        } else if (this.type == TYPE_MEDIA.VIDEOS) {
          this.acceptFiles = 'video/mp4';
        }
      },
      onFileChange(e) {
        let files = e.target.files || e.dataTransfer.files;
        let fileSize = files[0].size/1024/1024;
        if (this.type == TYPE_MEDIA.IMAGES ? fileSize > FILE_SIZE.MAX_SIZE_IMAGE : fileSize > FILE_SIZE.MAX_SIZE_VIDEO) {
          this.$warning({
            title: this.type == TYPE_MEDIA.IMAGES ? this.$t('titleFormModal.messErrorFileSizeImage') : this.$t('titleFormModal.messErrorFileSizeVideo')
          });
          return;
        }

        if (!files.length)
          return;
        this.setFileState(files);
        if (this.type == TYPE_MEDIA.IMAGES) {
          this.$router.push(`/media/images/add`);
        } else {
          this.$router.push(`/media/videos/add`);
        }
      }
    }
  }
</script>
