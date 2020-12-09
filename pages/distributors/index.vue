<template>
  <div class="container">
    <div class="background-title-page">
      <h1 class="font-28px"><strong>{{ $t('distributors.titlePage') }}</strong></h1>
    </div>
    <div class="p-2 pb-5 bg-white">
      <p class="txt-right">
        <nuxt-link to="/distributors/add">
          <a-button type="primary">
            <span class="font-weight-bold">{{ $t('distributors.btnAdd') }}</span>
          </a-button>
        </nuxt-link>
      </p>
      <a-table :columns="columns" :data-source="distributors" :pagination="false" class="table-action">
        <span slot="nameEn" class="font-16px font-weight-bold" slot-scope="text, record">{{ getContentLocale(record.names, getLocaleDefault(listLanguage)) }}</span>
        <span slot="savedBy" class="font-16px" slot-scope="text" >{{ text }}</span>
        <div slot="action" slot-scope="action" class="txt-right pr-3">
          <nuxt-link :to="`/distributors/${action.distributorId}/edit`"><u>{{ $t('commonText.actionEdit') }}</u></nuxt-link>
          <a class="ml-4 txt-danger-bold" @click="showConfirmDeleteDistributor(action.distributorId)"><u>{{ $t('commonText.actionDelete') }}</u></a>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
  import {
  mapState,
  mapGetters,
  mapActions
} from 'vuex'
  import store from '~/store'
  import { Button } from 'ant-design-vue';

  export default {
    middleware: ['ktcUsers'],
    layout: "default",
    props: [],
    data(){
      const columns = [
        {
          title: this.$t('distributors.titleDistributor'),
          dataIndex: 'nameEn',
          key: 'nameEn',
          scopedSlots: { customRender: 'nameEn' },
        },
        {
          title: this.$t('listModel.txtSavedBy') ,
          dataIndex: 'savedBy',
          key: 'savedBy',
          scopedSlots: { customRender: 'savedBy' },
          width: '200px'
        },
        {
          key: 'action',
          scopedSlots: { customRender: 'action' },
          width: '150px'
        },
      ]
      return {
        columns
      };
    },
    async fetch ({ store }) {
      await store.dispatch('distributors/getListDistributors');
    },
    computed: {
      ...mapState({
        distributors: state => state.distributors.distributors,
        listLanguage: state => state.languages.listLanguage
      }),
    },
    methods: {
      ...mapActions({
        deleteDistributor: 'distributors/deleteDistributor'
      }),
      showConfirmDeleteDistributor(distributorId) {
        this.$confirm({
          title: 'Do you want to delete this Distributor?',
          onOk: async () => {
            const resDelete = await this.deleteDistributor(distributorId);
            if (resDelete.status == 200) {
              window.location.reload();
            } else {
              this.$warning({
                title: 'Can not delete this Distributor!',
              });
            }
          }
        });
      }
    }
  }
</script>
