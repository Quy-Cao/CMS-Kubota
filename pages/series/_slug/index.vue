<template>
  <div>
    <div>
      <div class="background-title-page">
        <h1 class="m-0">
          <strong class="font-28px">{{ getContentLocale(seriesHasModel.series.names, getLocaleDefault(listLanguage)) }}</strong>
          <nuxt-link :to="`/series/${seriesHasModel.series.seriesId}/edit`" class="font-14px ml-2"><u>{{ $t('series.linkEdit') }}</u></nuxt-link>
        </h1>
        <a-breadcrumb>
          <span slot="separator" class="ic-breadcrumb"><img src="../../../assets/images/line.svg"></span>
          <a-breadcrumb-item>
            <nuxt-link to="/series">
            <u>{{ $t('series.titleSeries') }}</u>
          </nuxt-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            {{ getContentLocale(seriesHasModel.series.names, getLocaleDefault(listLanguage)) }}
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      <div class="bg-white px-3 py-4 box-content">
        <div class="pb-4">
          <p class="font-22px font-weight-500 mb-2 txt-main">{{ $t('series.titleThumbnail') }}</p>
          <UploadDropzone
            folder-name="series"
            :max-files="1"
            id-input="uploadPhoto"
            image-width="73"
            image-height="73"
            :id-data="seriesHasModel.series.seriesId"
            :url="seriesHasModel.series.thumbPath"
          ></UploadDropzone>
        </div>
        <div>
          <p class="d-flex justify-space-between">
            <span class="font-22px font-weight-500 mb-2 txt-main">{{ $t('series.txtModels') }}</span>
            <a-button type="primary" @click="addModel">{{ $t('series.btnAddModel') }}</a-button>
          </p>
          <a-table :columns="columns" :data-source="seriesHasModel.models" :pagination="false" :customRow="customRow" class="table-row">
            <span slot="name" class="font-16px font-weight-bold" slot-scope="text, record">{{ getContentLocale(record.names, getLocaleDefault(listLanguage)) }}</span>
            <span slot="distributorNameEn" class="font-16px font-weight-bold" slot-scope="text, record">{{ getContentLocale(record.distributorNames, getLocaleDefault(listLanguage)) }}</span>
            <span slot="action" class="ic-row-right"></span>
          </a-table>
        </div>
      </div>
    </div>
    <div class="mt-3">
      <span @click="showConfirmDelete" style="cursor: pointer"><u class="txt-danger-bold">{{ $t('series.deleteSeries')}}</u></span>
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
      const columns = [
        {
          title: this.$t('series.titleModel'),
          dataIndex: 'nameEn',
          key: 'nameEn',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: this.$t('series.titleDistributor'),
          dataIndex: 'distributorNameEn',
          key: 'distributorNameEn',
          scopedSlots: { customRender: 'distributorNameEn' },
        },
        {
          title: '',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          width: '50px'
        },
      ]
      return {
        columns
      };
    },
    computed: {
      ...mapState({
        seriesHasModel: state => state.series.seriesHasModel,
        listLanguage: state => state.languages.listLanguage
      })
    },
    async fetch({ store, params, error }) {
      await store.dispatch('series/getSeriesHasListModel', params.slug);
    },
    methods: {
      ...mapActions({
        deleteSeries: 'series/deleteSeries'
      }),
      showConfirmDelete() {
        this.$confirm({
          title: 'Do you want to delete this Series?',
          onOk: async () => {
            const resDelete = await this.deleteSeries(this.seriesHasModel.series.seriesId);
            if (resDelete.status == 200) {
              this.$router.push('/series');
            } else {
              this.$warning({
                title: 'Can not delete this Series!',
              });
            }
          }
        });
      },
      addModel() {
        this.$router.push(`/models/add?seriesId=${this.seriesHasModel.series.seriesId}`);
      },
      customRow(record, index) {
        return {
          on: {
            click: () => {
              this.$router.push(`/errorCodes?modelId=${record.modelId}`);
            }
          }
        }
      }
    }
  }
</script>