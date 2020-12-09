<template>
  <div>
    <div class="background-title-page">
      <h1 class="font-28px m-0"><strong>{{ $t('model3D.txtPage') }}</strong></h1>
      <a-breadcrumb>
        <span slot="separator" class="ic-breadcrumb"><img src="../../../assets/images/line.svg"></span>
        <a-breadcrumb-item>
          <nuxt-link to="/media/3DModels"><u>{{ $t('model3D.txtTitle') }}</u></nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          {{ $t('model3D.btnAdd') }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="bg-white px-3 py-4 box-content">
      <Editor :init-data="blankData">
      </Editor>
    </div>
  </div>
</template>

<script>
  import Editor from "~/components/3DModel/editor";
  import { mapState } from "vuex";
  export default {
    middleware: ['ktcUsers'],
    layout: "default",
    components: {
      Editor
    },
    data() {
      return {
        blankData: {
          identityName: '',
          urlIos: '',
          urlAndroid: '',
          fileSize: '',
          partModels: []
        }
      };
    },
    computed: {
      ...mapState({
        listLanguage: state => state.languages.listLanguage
      })
    }
  }

</script>
