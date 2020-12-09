<template>
  <div>
    <a-form layout="inline" :form="form">
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
        <UploadMedia :type="type"></UploadMedia>
      </a-form-item>
    </a-form>
    <div class="mt-3">
      <a-table
      :columns="columns"
      :data-source="listImages"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      class="table-action"
      >
        <span slot="path" slot-scope="text">
          <div v-if="type == TYPE_MEDIA.IMAGES"><img :src="text" alt="" class="media-thumb-img"></div>
          <div v-else>
            <video :src="text" controls class="media-thumb-video"></video>
          </div>
        </span>
        <span slot="fileName" class="font-16px " slot-scope="text" >{{ text }}</span>
        <span slot="savedBy" class="font-16px" slot-scope="text">{{ text }}</span>
        <!-- <span slot="names" class="font-16px nl2br line-clamp" slot-scope="text" >{{ getContentLocale(text, getLocaleDefault(listLanguage)) }}</span> -->
        <div slot="action" slot-scope="action" class="txt-right pr-3">
          <nuxt-link :to="action.type == TYPE_MEDIA.IMAGES ? `/media/images/${action.imageId}/edit` : `/media/videos/${action.imageId}/edit`"><u>{{ $t('commonText.actionEdit') }}</u></nuxt-link>
          <a class="ml-4 txt-danger-bold" @click="showConfirmDeleteMedia(action.imageId)"><u>{{ $t('commonText.actionDelete') }}</u></a>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
  import UploadMedia from "~/components/upload-media.vue";
  import { mapState, mapActions } from "vuex";
  import { PAGE_SIZE } from "~/plugins/constant.js";
  import { TYPE_MEDIA } from "~/plugins/constant.js";
export default {
  components: {
    UploadMedia,
  },
  layout: "default",
  props: ['type'],
  data() {
    const columns = [
      {
        title:  this.$t('medias.titleThumbnail'),
        dataIndex: 'path',
        key: 'path',
        scopedSlots: { customRender: 'path' },
        width: "185px",
      },
      {
        title: this.$t('medias.titleFileName'),
        dataIndex: 'fileName',
        key: 'fileName',
        scopedSlots: { customRender: 'fileName' },
        // width: "15%",
        className: 'media-row-table',
      },
      {
        title: this.$t('listModel.txtSavedBy') ,
        dataIndex: 'savedBy',
        key: 'savedBy',
        scopedSlots: { customRender: 'savedBy' },
        width: '200px',
        className: 'media-row-table',
      },
      // {
      //   title: this.$t('medias.titleCaption'),
      //   dataIndex: 'names',
      //   key: 'names',
      //   scopedSlots: { customRender: 'names' },
      //   className: 'media-row-table',
      //   width: '50%',
      //   height: '100px',
      // },
      {
        title: '',
        key: 'action',
        scopedSlots: { customRender: 'action' },
        width: '200px',
        className: 'media-row-table'
      },
    ]
    return {
      form: this.$form.createForm(this, { name: 'formSearch' }),
      columns,
      isNotFilter: true,
      loading: false,
      listImages: null,
      pagination: {},
      queryParams: {},
      TYPE_MEDIA
  };
  },
  watch: {
    '$route.query': '$fetch'
  },
  fetch() {
    this.initData();
  },
  computed: {
    ...mapState({
      listLanguage: state => state.languages.listLanguage
    })
  },
  methods: {
    ...mapActions({
      deleteMedia: 'medias/deleteMedia',
      getListMedia: 'medias/getListMedia',
    }),
    initData() {
      const { pageNumber, pageSize, search } = this.$route.query;
      const params = {
        pageNumber: !_.isNil(pageNumber) ? pageNumber : 1,
        pageSize: !_.isNil(pageSize) ? pageSize : PAGE_SIZE,
        search: !_.isNil(search) ? search : '',
        type: this.type,
        locale: this.getLocaleDefault(this.listLanguage),
      };
      this.queryParams = params;
      this.isNotFilter = (params.search === '');
      this.handleSearch(params);
    },
    handleSubmit(e) {
      e.preventDefault();
      this.isSubmit = true;
      this.form.validateFields(async (err, values) => {
        values = {
        search:  _.trim(values.search),
        pageNumber: 1,
        pageSize: PAGE_SIZE,
        type: this.type,
        locale: this.getLocaleDefault(this.listLanguage),
      };
      this.$router.push({path: this.$route.path, query: values });
      })
    },
    async handleSearch(params) {
      const resApi = await this.getListMedia(params);
      if (resApi.status == 200) {
        const pagination = {
          ...this.pagination,
          total: resApi.data.totalRecord,
          pageSize: resApi.data.pageSize,
          current: resApi.data.pageNumber
        }
        this.loading = false;
        this.pagination = pagination;
        this.listImages = resApi.data.diagnosisImages;
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
        search: value ? _.trim(value) : '',
        pageNumber: 1
      };
      _.delay(() => {
        this.$router.push({path: this.$route.path, query: this.queryParams });
      }, 1000)
    },
    showConfirmDeleteMedia(imageId) {
        this.$confirm({
          title: this.type == TYPE_MEDIA.IMAGES ? 'Do you want to delete this Image?' : 'Do you want to delete this Video?',
          onOk: async () => {
            const resDelete = await this.deleteMedia(imageId);
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
                title: this.type == TYPE_MEDIA.IMAGES ? 'Can not delete this Image?' : 'Can not delete this Video?',
              });
            }
          }
        });
      }
  }

}
</script>