<template>
  <div>
    <div class="background-title-page">
      <h1 class="font-28px"><strong>{{ $t('cards.titlePage') }}</strong></h1>
    </div>
    <div class="bg-white px-3 py-4 box-content">
      <a-form layout="inline" :form="form"  @submit="handleSubmit">
        <!-- Select Types -->
        <a-form-item class="mr-1">
          <a-select
            v-decorator="[
              'cardTypeId',
              {
                initialValue: queryParams.cardTypeId ? queryParams.cardTypeId : ''
              }
            ]"
            placeholder="Type"
            @change="handleChangeFilterType"
          >
            <a-select-option value="" disabled>
              {{ $t('cards.selectTypes') }}
            </a-select-option>
            <a-select-option value="all">
              {{ $t('cards.selectAll') }}
            </a-select-option>
            <a-select-option v-for="cardType in cardTypes" :key="cardType.cardTypeId" >
              {{ cardType.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item class="mr-1">
          <a-input
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

        <!-- Button Filter -->
        <a-form-item class="m-0">
          <a-button class="short" html-type="submit" :type="!isNotFilter ? 'primary' : ''">
            {{ $t('commonText.btnFilter') }}
          </a-button>
        </a-form-item>
        <!-- Button Add Cards -->
        <a-form-item class="float-right m-0">
          <nuxt-link to="/cards/add">
            <a-button type="primary">
              {{ $t('cards.btnAdd') }}
            </a-button>
          </nuxt-link>
        </a-form-item>
      </a-form>
      <div class="mt-3">
        <a-table
          :columns="columns"
          :data-source="listCard"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          class="table-row"
          :customRow="customRow"
        >
          <span slot="cardId" class="font-16px" slot-scope="text">{{ text }}</span>
          <div slot="name" class="font-16px font-weight-bold nl2br" slot-scope="text">{{ text }}</div>
          <span slot="cardTypeName" class="font-16px" slot-scope="text">{{ text }}</span>
          <span slot="savedBy" class="font-16px" slot-scope="text">{{ text }}</span>
          <span slot="action" class="ic-row-right"></span>
        </a-table>
      </div>

    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from "vuex";
  import store from '~/store'
  import { PAGE_SIZE } from "~/plugins/constant.js";
  import { getStatusName } from "~/plugins/utils.js";
  export default {
    middleware: ['ktcUsers'],
    layout: "default",
    data() {
        const columns = [
          {
            title: this.$t('cards.titleCardId'),
            dataIndex: 'cardId',
            key: 'cardId',
            scopedSlots: { customRender: 'cardId' },
            width: "100px",
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => {return},
          },
          {
            title: this.$t('cards.titleCard'),
            dataIndex: 'name',
            key: 'name',
            scopedSlots: { customRender: 'name' },
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => {return},
          },
          {
            title: this.$t('cards.titleType') ,
            dataIndex: 'cardTypeName',
            key: 'cardTypeName',
            scopedSlots: { customRender: 'cardTypeName' },
            width: '20%'
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
            width: '50px'
          },
        ]
        return {
          form: this.$form.createForm(this, { name: 'Cards' }),
          isSubmit: false,
          loading: false,
          isNotFilter: true,
          listCard: null,
          columns,
          pagination: {},
          queryParams: {}
        };
      },
      async created() {
        await this.getListCardTypes({ locale: this.getLocaleDefault(this.listLanguage) });
      },
      computed: {
        ...mapState({
          cardTypes: state => state.cardTypes.cardTypes,
          listLanguage: state => state.languages.listLanguage
        })
      },
      watch: {
        '$route.query': '$fetch'
      },
      fetch() {
        this.initData();
      },
      methods: {
        ...mapActions({
          getListCards: 'cards/getListCards',
          getListCardTypes: 'cardTypes/getListCardType'
        }),
        initData() {
          const { cardTypeId, pageNumber, pageSize, search, locale, orderBy, orderType } = this.$route.query;
          const params = {
            cardTypeId:  !isNaN(_.parseInt(cardTypeId)) ? _.parseInt(cardTypeId) : '' ,
            pageNumber: !_.isNil(pageNumber) ? pageNumber : 1,
            pageSize: !_.isNil(pageSize) ? pageSize : PAGE_SIZE,
            search: !_.isNil(search) ? search : '',
            locale: this.getLocaleDefault(this.listLanguage),
            orderBy: !_.isNil(orderBy) ? orderBy : '',
            orderType: !_.isNil(orderType) ? orderType : '',
          };
          this.queryParams = params;
          this.isNotFilter = (params.cardTypeId === '' && params.search === '');
          this.handleSearch(params);
        },
        handleSubmit(e) {
          e.preventDefault();
          this.isSubmit = true;
          this.form.validateFields(async (err, values) => {
            values = {
              ...values,
              cardTypeId: (values.cardTypeId && values.cardTypeId != 'all') ? _.parseInt(values.cardTypeId) : '',
              search:  _.trim(values.search),
              pageNumber: 1,
              pageSize: PAGE_SIZE,
              locale: this.getLocaleDefault(this.listLanguage),
            };
            this.$router.push({path: this.$route.path, query: values });
          });
        },
        async handleSearch(params) {
          const resApi = await this.getListCards(params);
          if (resApi.status == 200) {
            const pagination = { ...this.pagination };
            pagination.total = resApi.data.totalRecord;
            pagination.pageSize = resApi.data.pageSize;
            pagination.current = resApi.data.pageNumber;
            this.loading = false;
            this.pagination = pagination;
            this.listCard = resApi.data.card;
          }
        },
        handleTableChange(pagination, filters, sorter) {
          let params = {
            ...this.queryParams,
            pageNumber: pagination.current
          };
          if(sorter.order) {
            params = {
              ...params,
              orderBy: sorter.field,
              orderType: sorter.order === 'descend' ? 'desc' : 'asc'
            }
          } else {
            params = {
              ...params,
              orderBy: '',
              orderType: ''
            };
          }
          this.$router.push({path: this.$route.path, query: params });
        },
        customRow(record, index) {
          return {
            on: {
              click: () => {
                this.$router.push(`/cards/${record.cardId}`);
              }
            }
          }
        },
        handleChangeFilterType(value) {
          this.queryParams = {
            ...
            this.queryParams,
            cardTypeId: (value && value != 'all') ? _.parseInt(value) : '',
            pageNumber: 1
          };
          this.$router.push({path: this.$route.path, query: this.queryParams });
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
      }
  }
</script>
