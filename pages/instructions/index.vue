<template>
  <div>
    <div class="background-title-page">
      <h1 class="font-28px"><strong>{{ $t('instructions.titlePage') }}</strong></h1>
    </div>
    <div class="bg-white px-3 py-4 box-content">
      <a-form layout="inline" :form="form" @submit="handleSubmit">
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
        <!-- Button Add Instructon -->
        <a-form-item class="float-right m-0">
          <nuxt-link to="/instructions/add">
            <a-button type="primary">
              {{ $t('instructions.btnAdd') }}
            </a-button>
          </nuxt-link>
        </a-form-item>
      </a-form>
      <div class="mt-3">
        <a-table
          :columns="columns"
          :data-source="listInstruction"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          class="table-action"
        >
          <span slot="name" class="font-16px font-weight-bold style-column-instruction nl2br" slot-scope="text" v-html="text"></span>
          <span slot="savedBy" class="font-16px" slot-scope="text">{{ text }}</span>
          <div slot="action" slot-scope="action" class="txt-right pr-3">
            <nuxt-link :to="`/instructions/${action.instructionId}/edit`"><u>{{ $t('commonText.actionEdit') }}</u></nuxt-link>
            <a class="ml-4 txt-danger-bold" @click="showConfirmDeleteInstruction(action.instructionId)"><u>{{ $t('commonText.actionDelete') }}</u></a>
          </div>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState, mapMutations } from "vuex";
  import store from '~/store'
  import { PAGE_SIZE } from "~/plugins/constant.js";
export default {
  middleware: ['ktcUsers'],
  layout: "default",
  data() {
    const columns = [
      {
        title: this.$t('instructions.titleInstruction'),
        dataIndex: 'name',
        key: 'name',
        scopedSlots: { customRender: 'name' }
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
      },
    ]
    return {
      form: this.$form.createForm(this, { name: 'Instructions' }),
      isSubmit: false,
      loading: false,
      isNotFilter: true,
      listInstruction: null,
      columns,
      pagination: {},
      queryParams: {}
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
      getListInstructions: 'instructions/getListInstructions',
      deleteInstruction: 'instructions/deleteInstruction',
    }),
    initData() {
      const { pageNumber, pageSize, search } = this.$route.query;
      const params = {
        pageNumber: !_.isNil(pageNumber) ? pageNumber : 1,
        pageSize: !_.isNil(pageSize) ? pageSize : PAGE_SIZE,
        search: !_.isNil(search) ? search : '',
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
        locale: this.getLocaleDefault(this.listLanguage)
      };
      this.$router.push({path: this.$route.path, query: values });
      })
    },
    async handleSearch(params) {
      const resApi = await this.getListInstructions(params);
      if (resApi.status == 200) {
        const pagination = { ...this.pagination };
        pagination.total = resApi.data.totalRecord;
        pagination.pageSize = resApi.data.pageSize;
        pagination.current = resApi.data.pageNumber;
        this.loading = false;
        this.pagination = pagination;
        this.listInstruction = resApi.data.instruction;
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

    showConfirmDeleteInstruction(instructionId) {
      this.$confirm({
        title: 'Do you want to delete this Instruction?',
        onOk: async () => {
          const resDelete = await this.deleteInstruction(instructionId);
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
              title: 'Can not delete this Instruction!',
            });
          }
        }
      });
    }
  }
}
</script>
