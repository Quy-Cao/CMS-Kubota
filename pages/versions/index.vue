<template>
  <div>
    <div class="background-title-page">
      <h1 class="m-0">
        <strong class="font-28px mr-3">{{ $t('versions.titlePage') }}</strong>
      </h1>
      <a-breadcrumb>
        <span slot="separator" class="ic-breadcrumb"><img src="../../assets/images/line.svg"></span>
        <a-breadcrumb-item>
          <nuxt-link to="/series"><u>{{ $t('errorCodes.titleSeries') }}</u></nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <nuxt-link :to="`/series/${modelInfo.seriesId}`"><u>{{ getContentLocale(modelInfo.seriesNames, getLocaleDefault(listLanguage)) }}</u></nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <nuxt-link :to="`/errorCodes?modelId=${modelInfo.modelId}`">
            <u>{{ getContentLocale(modelInfo.names, getLocaleDefault(listLanguage)) }}</u>
          </nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          {{ $t('versions.titlePage') }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="bg-white px-3 py-4 box-content">
      <div>
        <a-input
          v-model="description"
          class="input-search-instruction mr-1"
          :placeholder="$t('versions.inputDiscription')"
        />
        <a-button type="primary" class="ant-btn mr-2" @click="handleNewVersion" :disabled="!getUserRoles($keycloak.token).includes(USER_ROLES.ADMIN)" >
          <span>{{ $t('versions.btnSaveVersion') }}</span>
        </a-button>
        <a href="javascript:void(0)" @click="downloadVersion(TYPE_DOWNLOAD.CURRENT)" class="font-16px pl-1">
          <u>{{ $t('versions.downloadVersion') }}</u>
        </a>
      </div>
      <div class="mt-3">
        <a-table :columns="columns" :data-source="listVersion" :pagination="false" class="table-action">
          <span slot="version" class="font-16px" slot-scope="text">{{ text }}</span>
          <span slot="createDate" class="font-16px" slot-scope="text">{{ moment.utc(text ).local().format('lll') }}</span>
          <span slot="description" class="font-16px" slot-scope="text">
            {{ text }}
          </span>
          <p slot="download" class="font-16px m-0 txt-center" slot-scope="text, record">
            <a href="javascript:void(0)" class="font-weight-400" @click="downloadVersion(TYPE_DOWNLOAD.VERSION, record)"><u>{{ $t('versions.txtDownload') }}</u></a>
          </p>
          <span slot="savedBy" class="font-16px" slot-scope="text">{{ text }}</span>
          <span slot="action" class="ic-row-right cursor-pointer" slot-scope="record" @click="handleClickVersionInfo(record)"></span>
        </a-table>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapState, mapActions } from "vuex";
  import { TYPE_DOWNLOAD, USER_ROLES } from "~/plugins/constant";

  export default {
    middleware: ['ktcUsers'],
    layout: "default",
    data() {
      const columns = [
        {
          title: this.$t('versions.titleVersion'),
          dataIndex: 'version',
          key: 'version',
          scopedSlots: { customRender: 'version' },
          width: '10%'
        },
        {
          title: this.$t('versions.titleDate') ,
          dataIndex: 'createDate',
          key: 'createDate',
          scopedSlots: { customRender: 'createDate' },
          width: '25%'
        },
        {
          title: this.$t('versions.titleDiscription')  ,
          dataIndex: 'description',
          key: 'description',
          scopedSlots: { customRender: 'description' },
          width: '20%'
        },
        {
          title: '',
          dataIndex: 'download',
          key: 'download',
          scopedSlots: { customRender: 'download' },
          width: '20%'
        },
        {
          title: this.$t('versions.titleSaveBy')  ,
          dataIndex: 'savedBy',
          key: 'savedBy',
          scopedSlots: { customRender: 'savedBy' },
        },
        {
          title: '',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          width: '50px'
        },
      ]
      return {
        TYPE_DOWNLOAD,
        USER_ROLES,
        columns,
        description: '',
      };
    },
    computed: {
      ...mapState({
        modelInfo: state => state.models.modelInfo,
        listLanguage: state => state.languages.listLanguage,
        listVersion: state => state.versions.listVersion,
      })
    },
    async fetch({ store, params, route }) {
      const { modelId } = route.query;
      await store.dispatch('models/getModelById', modelId);
      await store.dispatch('versions/getListVersion', modelId);
    },
    methods: {
      ...mapActions({
        getAddNewVersion: 'versions/getAddNewVersion',
        getListVersion: 'versions/getListVersion',
        getCurrentVersion: 'versions/getCurrentVersion'
      }),
      async handleNewVersion(e) {
        const newData = {
          modelId: parseInt(this.$route.query.modelId),
          description: this.description,
          savedBy: this.getUserName(this.$keycloak.token)
        };
        let resAddVersion = await this.getAddNewVersion(newData);
        if(resAddVersion.status === 200) {
          this.getListVersion(this.$route.query.modelId);
        }
        this.description = '';
      },
      handleChangeKey(e) {
        this.description = e.target.value;
      },
      async downloadVersion(typeDownload, record = null) {
        if (typeDownload == TYPE_DOWNLOAD.CURRENT) {
          const res = await this.getCurrentVersion(this.$route.query.modelId);
          if (res.status == 200) {
            this.handleDownlod(res.data, `data_model_${this.$route.query.modelId}_draft_${this.moment().format('YYYYMMDDhhmmss')}.json`);
          }
        } else {
          if (!_.isNull(record)) {
            fetch(record.dowloadLink)
            .then(async res => {
              const data = await res.json();
              const versionInfo = {
                modelId: data.modelId,
                version: data.versionId
              }
              this.handleDownlod(data, `data_model_${record.modelId}_version_${record.version}.json`);
            })
            .then((out) => {
              console.log('Checkout this JSON!')
            })
            .catch(err => { throw err });
          }
        }
      },
      handleDownlod(dataDowload, fileName) {
        if (!_.isNull(dataDowload)) {
          let file = new Blob([JSON.stringify(dataDowload)], {type: 'text/json'});
          if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, fileName);
          else { // Others
            let a = document.createElement("a");
            const url = URL.createObjectURL(file);
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            }, 0);
          }
        } else {
          this.$warning({
            title: this.$t('titleFormModal.errorDowloadVersion'),
          });
        }
      },
      handleClickVersionInfo(record) {
        this.$router.push(`/errorCodes?modelId=${record.modelId}&version=${record.version}`);
      }
    }
  }
</script>