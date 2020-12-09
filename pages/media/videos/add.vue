<template>
  <div>
    <div class="background-title-page">
      <h1 class="font-28px m-0"><strong>{{ $t('medias.txtAddVideo') }}</strong></h1>
      <a-breadcrumb>
        <span slot="separator" class="ic-breadcrumb"><img src="../../../assets/images/line.svg"></span>
        <a-breadcrumb-item>
          <nuxt-link to="/media/videos">
            <u>{{ $t('medias.titleVideo') }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          {{ $t('medias.txtAddVideo') }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="bg-white px-3 py-4 box-content">
      <Editor :init-data="blankData" :type="TYPE_MEDIA.VIDEOS">
      </Editor>
    </div>
  </div>
</template>
<script>
  import Editor from "~/components/medias/editor.vue";
  import { mapActions, mapState } from "vuex";
  import { TYPE_MEDIA } from "~/plugins/constant";
  export default {
    middleware: ['ktcUsers'],
    layout: "default",
    components: {
      Editor
    },
    data() {
      return {
        blankData: {
          file: null,
          fileThumbnail: null,
          type: 2,
          fileName: ''
        },
        TYPE_MEDIA
      };
    },
    computed: {
      ...mapState({
        listLanguage: state => state.languages.listLanguage,
        fileState: state => state.medias.fileState
      })
    },
    beforeMount() {
      this.setData();
    },
    methods: {
      setData() {
        // let names = {};
        // _.forEach(this.listLanguage, (language, index) => {
        //   const { locale, name, isRequired } = language;
        //   const nameData = {
        //     locale,
        //     content: '',
        //     nameLG: name,
        //     isRequired
        //   }
        //   names[index] = nameData;
        // })
        this.blankData = {
          ...this.blankData,
          // names,
          file: this.fileState ? this.fileState[0] : null,
          fileName: this.fileState ? this.fileState[0].name : '',
          type: TYPE_MEDIA.VIDEOS
        }
      },
    }
  }

</script>