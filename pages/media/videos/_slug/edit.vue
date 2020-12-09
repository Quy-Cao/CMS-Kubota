<template>
  <div>
    <div class="background-title-page">
      <h1 class="font-28px m-0"><strong>{{ $t('medias.txtEditVideo') }}</strong></h1>
      <a-breadcrumb>
        <span slot="separator" class="ic-breadcrumb"><img src="../../../../assets/images/line.svg"></span>
        <a-breadcrumb-item>
          <nuxt-link to="/media/videos">
            <u>{{ $t('medias.titleVideo') }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          {{ $t('medias.txtEditVideo') }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="bg-white px-3 py-4 box-content">
      <Editor :init-data="dataEdit" :type="TYPE_MEDIA.IMAGES" :is-edit="true">
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
        dataEdit: null,
        TYPE_MEDIA
      };
    },
    computed: {
      ...mapState({
        listLanguage: state => state.languages.listLanguage,
        mediaInfo: state=> state.medias.mediaInfo
      })
    },
    async fetch ({ store, params }) {
      await store.dispatch('medias/getMediaInfo', params.slug);
    },
    beforeMount() {
      this.setData();
    },
    methods: {
      setData() {
        // let names = [];
        // _.forEach(this.listLanguage, (language, index) => {
        //   const { locale, name, isRequired } = language;
        //   const nameData = {
        //     locale,
        //     content: this.getContentLocale(this.mediaInfo.names, language.locale),
        //     nameLG: name,
        //     isRequired
        //   }
        //   names.push(nameData);
        // })
        this.dataEdit = {
          ...this.mediaInfo,
          // names
        }
      },
    }
  }

</script>