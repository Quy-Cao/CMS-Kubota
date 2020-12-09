<template>
  <div class="container">
    <div class="background-title-page">
      <h1 class="font-28px"><strong>{{ $t('cardTypes.titlePage') }}</strong></h1>
    </div>
    <div class="p-2 pb-5 bg-white">
      <p class="txt-right">
        <nuxt-link to="/cardTypes/add">
          <a-button type="primary">
            <span class="font-weight-bold">{{ $t('cardTypes.btnAdd') }}</span>
          </a-button>
        </nuxt-link>
      </p>
      <a-table :columns="columns" :data-source="cardTypes" :pagination="false" class="table-action">
        <span slot="nameEn" class="font-16px font-weight-bold" slot-scope="text, record">{{ record.name }}</span>
        <span slot="savedBy" class="font-16px" slot-scope="text" >{{ text }}</span>
        <span slot="endOfDiagnosis" class="font-16px" slot-scope="text, record" >{{ record.isEndOfDiagnosis ? 'Yes' : 'No' }}</span>
        <div slot="action" slot-scope="action" class="txt-right pr-3">
          <nuxt-link :to="`/cardTypes/${action.cardTypeId}/edit`"><u>{{ $t('commonText.actionEdit') }}</u></nuxt-link>
          <a class="ml-4 txt-danger-bold" @click="showConfirmDeleteCardType(action.cardTypeId)"><u>{{ $t('commonText.actionDelete') }}</u></a>
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
          title: this.$t('cardTypes.titleCardType'),
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
          title: this.$t('cardTypes.txtEndOfDiagnosis') ,
          dataIndex: 'endOfDiagnosis',
          key: 'endOfDiagnosis',
          scopedSlots: { customRender: 'endOfDiagnosis' },
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
    async fetch () {
      await this.$store.dispatch('cardTypes/getListCardType', { locale: this.getLocaleDefault(this.listLanguage) });
    },
    computed: {
      ...mapState({
        cardTypes: state => state.cardTypes.cardTypes,
        listLanguage: state => state.languages.listLanguage
      }),
      ...mapGetters({
        total: 'cardTypes/total',
      })
    },

    methods: {
      ...mapActions({
        deleteCardType: 'cardTypes/deleteCardType'
      }),
      showConfirmDeleteCardType(cardTypeId) {
        this.$confirm({
          title: 'Do you want to delete this Card type?',
          onOk: async () => {
            const resDelete = await this.deleteCardType(cardTypeId);
            if (resDelete.status == 200) {
              window.location.reload();
            } else {
              this.$warning({
                title: 'Can not delete this Card type!',
              });
            }
          }
        });
      }
    }
  }
</script>
