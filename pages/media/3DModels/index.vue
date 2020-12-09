<template>
  <div>
    <div class="background-title-page">
      <h1><strong class="font-28px mr-3">{{ $t('medias.titlePage') }}</strong></h1>
    </div>
    <div class="bg-white px-3 py-4 box-content">
      <a-tabs :default-active-key="TYPE_MEDIA.MODELS" @change="handleChangeTabs">
        <a-tab-pane :key="TYPE_MEDIA.IMAGES" :tab="$t('medias.titleImage')">
        </a-tab-pane>
        <a-tab-pane :key="TYPE_MEDIA.VIDEOS" :tab="$t('medias.titleVideo')">
        </a-tab-pane>
        <a-tab-pane :key="TYPE_MEDIA.MODELS" :tab="$t('medias.titleModel')">
          <div class="bg-white px-3 py-4 box-content">
            <a-form layout="inline" :form="form" @submit="handleSubmit" >
              <a-form-item class="mr-1">
                <a-input
                  class="input-search-instruction"
                  v-decorator="[
                    'search',
                    {
                      initialValue: queryParams.search
                    }
                  ]"
                  :placeholder="$t('commonText.txtSearch')"
                  @keyup="handleKeyUp"
                >
                </a-input>
              </a-form-item>
              <a-form-item class="m-0">
                <a-button class="short" html-type="submit" :type="!isNotFilter ? 'primary' : ''">
                  {{ $t('commonText.btnFilter') }}
                </a-button>
              </a-form-item>
              <a-form-item class="float-right m-0">
                <nuxt-link to="/media/3DModels/add">
                  <a-button type="primary">
                    {{ $t('model3D.btnAdd') }}
                  </a-button>
                </nuxt-link>
              </a-form-item>
            </a-form>
            <div class="mt-3">
              <a-table
                :columns="columns"
                :data-source="dataTable"
                :pagination="pagination"
                :loading="loading"
                @change="handleTableChange"
                class="table-action"
              >
                <span slot="identityName" class="font-16px font-weight-bold" slot-scope="text" >{{ text }}</span>
                <span slot="savedBy" class="font-16px" slot-scope="text" >{{ text }}</span>
                <div slot="action" slot-scope="action" class="txt-right pr-3">
                  <nuxt-link :to='`/media/3DModels/${action.displayModelId}/edit`'><u>{{ $t('commonText.actionEdit') }}</u></nuxt-link>
                  <a class="ml-4 txt-danger-bold" @click="showConfirmDeleteModel3D(action.displayModelId)"><u>{{ $t('commonText.actionDelete') }}</u></a>
                </div>
              </a-table>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  import { TYPE_MEDIA, PAGE_SIZE } from "~/plugins/constant";
  export default {
    middleware: ['ktcUsers'],
    data() {
      const columns = [
        {
          title: this.$t('model3D.titleFileName'),
          dataIndex: 'identityName',
          key: 'identityName',
          scopedSlots: { customRender: 'identityName' },
        },
        {
          title: this.$t('listModel.txtSavedBy') ,
          dataIndex: 'savedBy',
          key: 'savedBy',
          scopedSlots: { customRender: 'savedBy' },
          width: '200px'
        },
        {
          title: '',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          width: '150px',
        }
      ];
      return {
        form: this.$form.createForm(this, { name: 'model3D' }),
        type: TYPE_MEDIA.IMAGES,
        TYPE_MEDIA,
        columns,
        loading: false,
        isNotFilter: true,
        pagination: {},
        queryParams: {},
        dataTable: []
      }
    },
    watch: {
    '$route.query': '$fetch'
  },
  fetch() {
    this.initData();
  },
    computed: {
    ...mapState({
      listLanguage: state => state.languages.listLanguage,
      listDisplayModel: state => state.model3D.listDisplayModel
    })
  },
    methods: {
      ...mapActions({
        getListModel3D: 'model3D/getListModel3D',
        deleteModel3D: 'model3D/deleteModel3D',
      }),
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
      initData() {
        const { pageNumber, pageSize, search } = this.$route.query;
        const params = {
          pageNumber: !_.isNil(pageNumber) ? pageNumber : 1,
          pageSize: !_.isNil(pageSize) ? pageSize : PAGE_SIZE,
          search: !_.isNil(search) ? search : '',
        };
        this.queryParams = params;
        this.isNotFilter = (params.search === '');
        this.handleSearch(params);
      },
      async handleSearch(params) {
        const resApi = await this.getListModel3D(params);
        if (resApi.status == 200) {
          const pagination = { ...this.pagination };
          pagination.total = resApi.data.totalRecord;
          pagination.pageSize = resApi.data.pageSize;
          pagination.current = resApi.data.pageNumber;
          this.loading = false;
          this.pagination = pagination;
          this.dataTable = resApi.data.displayModels;
        }
      },
      handleTableChange(pagination, filters, sorter) {
        const params = {
          ...this.queryParams,
          pageNumber: pagination.current
        };
        this.$router.push({path: this.$route.path, query: params });
      },
      handleKeyUp(e) {
        const value = e.target.value;
        this.queryParams = {
          ...this.queryParams,
          pageNumber: 1,
          search: value ? _.trim(value) : ''
        };
        _.delay(() => {
          this.$router.push({path: this.$route.path, query: this.queryParams });
        }, 1000)
      },
      handleSubmit(e) {
        e.preventDefault();
        this.isSubmit = true;
        this.form.validateFields(async (err, values) => {
          values = {
          search:  _.trim(values.search),
          pageNumber: 1,
          pageSize: PAGE_SIZE,
        };
        this.$router.push({path: this.$route.path, query: values });
        })
      },
      showConfirmDeleteModel3D(displayModelId) {
        this.$confirm({
          title: this.$t('titleFormModal.messDelete3DModel'),
          onOk: async () => {
            const resDelete = await this.deleteModel3D(displayModelId);
            if (resDelete.status == 200) {
              const { pageSize, total, current } = this.pagination;
              if (total % pageSize == 1) {
                this.queryParams = {
                  ...this.queryParams,
                  pageNumber: current - 1
                };
                this.$router.push({path: this.$route.path, query: this.queryParams });
              } else {
                window.location.reload(true);
              }
            } else {
              this.$warning({
                title: this.$t('titleFormModal.messErrorDelete3DModel'),
              });
            }
          }
        });
      }
    }
  }
</script>