<template>
  <div>
    <div>
      <div class="background-title-page">
        <h1 class="m-0">
          <strong class="font-28px">{{ getContentLocale(seriesInfo.names, 'en') }}</strong>
          <nuxt-link :to="`/series/${seriesInfo.seriesId}/edit`" class="font-14px ml-2"><u>{{ $t('series.linkEdit') }}</u></nuxt-link>
        </h1>
        <a-breadcrumb>
          <span slot="separator" class="ic-breadcrumb"><img src="../../../assets/images/line.svg"></span>
          <a-breadcrumb-item>
            <nuxt-link to="/series">
            <u>{{ $t('series.titleSeries') }}</u>
          </nuxt-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            {{ getContentLocale(seriesInfo.names, 'en') }}
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </div>
    <div class="bg-white px-3 py-4 box-content">
        <div class="pb-4">
          <p class="font-weight-bold font-18px txt-main">{{ $t('series.titleThumbnail') }}</p>
          <UploadDropzone
            folder-name="series"
            :max-files="1"
            id-input="uploadPhoto"
            image-width="73"
            image-height="73"
            :id-data="seriesInfo.seriesId"
            :url="seriesInfo.thumbPath"
          ></UploadDropzone>
        </div>
        <div class="pt-2">
          <p class="font-weight-bold font-18px txt-main">{{ $t('series.txtModels') }}</p>
          <a-button @click="addModel">{{ $t('series.btnAddModel') }}</a-button>
        </div>
    </div>
    <div class="mt-3">
      <span @click="showConfirmDelete" style="cursor: pointer"><u class="txt-danger-bold">{{ $t('series.deleteSeries') }}</u></span>
    </div>
  </div>
</template>
<script>
  import { mapState, mapActions } from "vuex";
  import UploadDropzone from "~/components/upload.vue";

  export default {
    middleware: ['ktcUsers'],
    layout: "default",
    components: {
      UploadDropzone
    },
    data() {
      return {

      };
    },
    computed: {
      ...mapState({
        seriesInfo: state => state.series.seriesInfo,
      })
    },
    async fetch({ store, params, error }) {
      await store.dispatch('series/getSeriesById', params.slug);
    },
    methods: {
      ...mapActions({
        deleteSeries: 'series/deleteSeries'
      }),
      showConfirmDelete() {
        this.$confirm({
          title: 'Do you want to delete this series?',
          onOk: async () => {
            const resDelete = await this.deleteSeries(this.seriesInfo.seriesId);
            if (resDelete.status == 200) {
              this.$router.push('/series');
            } else {
              this.$warning({
                title: 'Can not delete this series!',
              });
            }
          }
        });
      },
      addModel() {
        this.$router.push(`/models/add?seriesId=${this.seriesInfo.seriesId}`);
      }
    }
  }
</script>