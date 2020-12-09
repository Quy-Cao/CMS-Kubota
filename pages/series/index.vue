<template>
  <div class="container">
    <div class="background-title-page">
      <h1 class="font-28px"><strong>{{ $t('series.titlePage') }}</strong></h1>
    </div>
    <div class="p-2 pb-5 bg-white box-content">
      <p class="txt-right position-relative">
        <input
          type="file"
          class="custom-file-input file-input-camera position-absolute"
          style="right: 185px"
          @change="handleUploadFile"
        >
        <nuxt-link to="/series/add">
          <a-button type="primary">
            <span class="font-weight-bold">{{ $t('series.btnAdd') }}</span>
          </a-button>
        </nuxt-link>
      </p>
      <a-table :columns="columns" :data-source="series" :pagination="false" :customRow="customRow" class="table-row">
        <span slot="name" class="font-16px font-weight-bold" slot-scope="text, record">{{ getContentLocale(record.names, getLocaleDefault(listLanguage)) }}</span>
        <span slot="action" class="ic-row-right"></span>
      </a-table>
    </div>
  </div>
</template>

<script>
  import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations
} from 'vuex'
  import store from '~/store'
  import { Button } from 'ant-design-vue';
  import { uploadFile } from '~/plugins/upload-azure';

  export default {
    middleware: ['ktcUsers'],
    layout: "default",
    props: [],
    data(){
      const columns = [
        {
          title: this.$t('series.titleSeries') ,
          dataIndex: 'names',
          key: 'names',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          width: '50px'
        },
      ]
      return {
        columns,
        fileCamSetting: '',
      };
    },
    async fetch({ store }) {
      await store.dispatch('series/all');
    },
    computed: {
      ...mapState({
        series: state => state.series.series,
        listLanguage: state => state.languages.listLanguage
      }),

      ...mapGetters({
        total: 'series/total',
      })
    },

    methods: {
      ...mapMutations({
        setSeries: 'series/setSeries'
      }),
      ...mapActions({
        getBlobSasUri: 'models/getBlobSasUri',
        updateCameraSetting: 'series/updateCameraSetting'
      }),
      customRow(record, index) {
        return {
          on: {
            click: () => {
              this.$router.push(`/series/${record.seriesId}`);
            }
          }
        }
      },
      async handleUploadFile(e) {
        let file = e.target.files;
        if(file[0].name.includes('json')) {
          this.fileCamSetting = file;
          let resApiAzure = await this.getBlobSasUri();
          if(resApiAzure.status === 200) {
            let values = {
              productId: 1,
              camSettingPath: (await uploadFile(this.fileCamSetting, resApiAzure.sasUri)).split('?')[0]
            }
            let resAPi = await this.updateCameraSetting(values);
            if(resAPi.status == 200) {
              this.$success({
                title: this.$t('titleFormModal.messSuccessUpdateFileCamSetting'),
              });
            }
          } else {
            this.$warning({
              title: this.$t('titleFormModal.messErrorServerUpload'),
            });
          }
        } else {
          this.$error({
              title: this.$t('titleFormModal.messErrorFileCameraSetting'),
            });
        }
      }
    }
  }
</script>
