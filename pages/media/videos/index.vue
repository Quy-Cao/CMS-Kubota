<template>
  <div>
    <div class="background-title-page">
      <h1 class="m-0">
        <strong class="font-28px mr-3">{{ $t('medias.titlePage') }}</strong>
      </h1>
    </div>
    <div class="bg-white px-3 py-4 box-content">
      <a-tabs :default-active-key="TYPE_MEDIA.VIDEOS" @change="handleChangeTabs">
        <a-tab-pane :key="TYPE_MEDIA.IMAGES" :tab="$t('medias.titleImage')">

        </a-tab-pane>
        <a-tab-pane :key="TYPE_MEDIA.VIDEOS" :tab="$t('medias.titleVideo')">
          <div>
            <list-media :type="type"/>
          </div>
        </a-tab-pane>
        <a-tab-pane :key="TYPE_MEDIA.MODELS" :tab="$t('medias.titleModel')">
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
  import listMedia from "~/components/medias/listMedia.vue";
  import {TYPE_MEDIA} from "~/plugins/constant";
  export default {
    middleware: ['ktcUsers'],
    components: {
      listMedia
    },
    data() {
      return {
        type: TYPE_MEDIA.VIDEOS,
        TYPE_MEDIA
      }
    },
    methods: {
      handleChangeTabs(key) {
        switch (key) {
          case TYPE_MEDIA.IMAGES:
            this.$router.push('/media/images');
            break;
          case TYPE_MEDIA.VIDEOS:
            this.$router.push('/media/videos');
            break;
          case TYPE_MEDIA.MODELS:
             this.$router.push('/media/3DModels');
            break;
          default:
            this.$router.push('/media/images');
        }
      },
    }
  }
</script>