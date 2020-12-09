<template>
  <div>
    <div class="d-flex justify-center align-item-center" style="min-height: 500px" v-if="$fetchState.pending">
      <a-spin size="large" />
    </div>
    <div v-else>
      <div class="background-title-page">
        <h1 class="font-28px m-0"><strong>{{ $t('model3D.txtEditPage') }}</strong></h1>
        <a-breadcrumb>
          <span slot="separator" class="ic-breadcrumb"><img src="../../../../assets/images/line.svg"></span>
          <a-breadcrumb-item>
            <nuxt-link to="/media/3DModels"><u>{{ $t('model3D.txtTitle') }}</u></nuxt-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            {{ model3DDetail.identityName }}
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            {{ $t('model3D.txtEditPage') }}
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      <div class="bg-white px-3 py-4 box-content">
        <Editor :init-data="model3DDetail" :isEdit="true" v-if="model3DDetail != null">
        </Editor>
      </div>
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
    computed: {
      ...mapState({
        listLanguage: state => state.languages.listLanguage,
        model3DDetail: state=> state.model3D.model3DDetail
      })
    },
    async fetch () {
      await this.$store.dispatch('model3D/getModel3DDetail', this.$route.params.slug);
    }
  }

</script>
