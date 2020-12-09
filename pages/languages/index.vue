<template>
  <div class="container">
    <div class="background-title-page">
      <h1 class="font-28px"><strong>{{ $t('languages.titlePage') }}</strong></h1>
    </div>
    <div class="p-2 pb-5 bg-white">
      <p class="txt-right">
        <nuxt-link to="/languages/add">
          <a-button type="primary">
            <span class="font-weight-bold">{{ $t('languages.btnAdd') }}</span>
          </a-button>
        </nuxt-link>
      </p>
      <a-table :columns="columns" :data-source="languages" :pagination="false" class="table-action">
        <span slot="name" class="font-16px font-weight-bold" slot-scope="text, record" :key="text.locale">
          {{ text }}
          <span class="txt-gray2 font-weight-400" >{{ record.isDefault ? '(Default)' : '' }}</span>
        </span>
        <span slot="locale" class="font-16px" slot-scope="text" :key="text.locale">{{ text }}</span>
        <span slot="isRequired" class="font-16px" slot-scope="text" :key="text.isRequired">{{ text ? IS_REQUIRED.REQUIRED.name : IS_REQUIRED.NOT_REQUIRED.name }}</span>
        <span slot="savedBy" class="font-16px" slot-scope="text" :key="text">{{ text }}</span>
        <div slot="action" slot-scope="action" :key="action.locale" class="txt-right pr-3">
          <nuxt-link :to="`/languages/${action.locale}/edit`"><u>{{ $t('commonText.actionEdit') }}</u></nuxt-link>
          <a class="ml-4 txt-danger-bold" @click="showConfirmDeleteCardType(action.locale)"><u>{{ $t('commonText.actionDelete') }}</u></a>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
  import {
  mapState,
  mapActions
} from 'vuex'
  import { IS_REQUIRED } from '~/plugins/constant';
  export default {
    middleware: ['ktcUsers'],
    layout: "default",
    props: [],
    data(){
      const columns = [
        {
          title: this.$t('languages.titleLanguage'),
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: this.$t('languages.titleLocale'),
          dataIndex: 'locale',
          key: 'locale',
          scopedSlots: { customRender: 'locale' },
        },
        {
          title: this.$t('languages.titleRequired'),
          dataIndex: 'isRequired',
          key: 'isRequired',
          scopedSlots: { customRender: 'isRequired' },
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
        columns,
        IS_REQUIRED
      };
    },
    async fetch ({ store }) {
      await store.dispatch('languages/getListLanguage');
    },
    computed: {
      ...mapState({
        languages: state => state.languages.listLanguage,
      })
    },
    methods: {
      ...mapActions({
        deleteLanguage: 'languages/deleteLanguage'
      }),
      showConfirmDeleteCardType(locale) {
        this.$confirm({
          title: 'Do you want to delete this Language?',
          onOk: async () => {
            const resDelete = await this.deleteLanguage(locale);
            if (resDelete.status == 200) {
              window.location.reload();
            } else {
              this.$warning({
                title: 'Can not delete this Language!',
              });
            }
          }
        });
      }
    },
  }
</script>
