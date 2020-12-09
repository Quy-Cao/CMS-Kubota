<template>
  <div class="container">
    <div>
      <h1 class="font-28px"><strong>{{ $t('listSeries.titlePage') }}</strong></h1>
    </div>
    <div class="p-2 pb-5 bg-white">
      <p class="txt-right">
        <!-- TODO: set link to page add series -->
        <nuxt-link to="/">
          <a-button type="primary">
            <span class="font-weight-bold">{{ $t('listSeries.btnAdd') }}</span>
          </a-button>
        </nuxt-link>
      </p>
      <a-table :columns="columns" :data-source="series" :pagination="false">
        <span slot="name" class="font-16px font-weight-bold" slot-scope="text">{{ text }}</span>
        <span slot="action" slot-scope="action">
          <!-- TODO: set link to page model-error codes -->
          <nuxt-link to="/"><a-icon type="right" /></nuxt-link>
        </span>
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

  export default {
    layout: "default",
    props: [],
    data(){
      const columns = [
        {
          title: this.$t('listSeries.titleColSeries') ,
          dataIndex: 'nameEn',
          key: 'nameEn',
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
        columns
      };
    },
    mounted() {
      this.$router.push(`/series`);
    },
    computed: {
      ...mapState({
        series: state => state.series.series,
      }),

      ...mapGetters({
        total: 'series/total',
      })
    },

    methods: {
      ...mapMutations({
        setSeries: 'series/setSeries'
      })
    }
  }
</script>
