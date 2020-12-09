<template>
  <div>
    <a-modal :visible="isShow" title=""  @cancel="handleCancel" width="70%" :footer="null" :dialogStyle="{animationDuration: isShow ? '0.4s' : '', display: isShow ? '' : 'none'}">
      <div class="px-4 pt-2">
        <p class="mb-2 font-28px txt-main"><b>{{ titleModal }}</b></p>
        <a-tabs :default-active-key="TYPE_MEDIA.IMAGES" :activeKey="activeTabKey" @change="handleChangeTabs" v-if="type == CHOOSE_DATA_TYPE.MEDIA">
          <a-tab-pane :key="TYPE_MEDIA.IMAGES" :tab="$t('medias.titleImage')">
          </a-tab-pane>
          <a-tab-pane :key="TYPE_MEDIA.VIDEOS" :tab="$t('medias.titleVideo')">
          </a-tab-pane>
        </a-tabs>
        <a-form layout="inline" :form="form"  @submit="handleSubmit">
          <!-- Select Types -->
          <a-form-item class="mr-1" v-if="type == CHOOSE_DATA_TYPE.CARDS">
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
        </a-form>
        <div class="mt-3" style="min-height: 450px">
          <div class="d-flex justify-center align-item-center" style="min-height: 250px" v-if="dataList == null">
            <a-spin size="large" />
          </div>
          <a-table
            v-else
            :columns="columnData"
            :data-source="dataList"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
            :customRow="customRow"
            :scroll="{ y: 500 }"
          >
            <span v-if="type == CHOOSE_DATA_TYPE.INSTRUCTIONS" slot="names" class="font-16px font-weight-bold style-column-instruction nl2br" slot-scope="text, record" v-html="record.name"></span>

            <span slot="path" slot-scope="text, record" v-if="type == CHOOSE_DATA_TYPE.MEDIA">
              <div v-if="record.type == TYPE_MEDIA.IMAGES"><img :src="text" alt="" class="media-thumb-img"></div>
              <div v-else><video :src="text" controls class="media-thumb-video"></video></div>
            </span>
            <span slot="fileName" class="font-16px " slot-scope="text" v-if="type == CHOOSE_DATA_TYPE.MEDIA">{{ text }}</span>
            <!-- <span slot="names" class="font-16px nl2br line-clamp " slot-scope="text" v-if="type == CHOOSE_DATA_TYPE.MEDIA">{{ getContentLocale(text, getLocaleDefault(listLanguage)) }}</span> -->

            <span slot="button1" class="font-16px font-weight-bold" slot-scope="text, record" v-if="type == CHOOSE_DATA_TYPE.BUTTONS && record.choiceDescs">{{ record.choiceDescs[0].name }}</span>
            <span slot="button2" class="font-16px font-weight-bold" slot-scope="text, record" v-if="type == CHOOSE_DATA_TYPE.BUTTONS && record.choiceDescs">{{ record.choiceDescs[1] ? record.choiceDescs[1].name : '-' }}</span>
            <span slot="button3" class="font-16px font-weight-bold" slot-scope="text, record" v-if="type == CHOOSE_DATA_TYPE.BUTTONS && record.choiceDescs">{{ record.choiceDescs[2] ? record.choiceDescs[2].name : '-' }}</span>

            <span slot="cardId" class="font-16px font-weight-bold" slot-scope="text" v-if="type == CHOOSE_DATA_TYPE.CARDS">{{ text }}</span>
            <p slot="name" class="font-16px font-weight-bold mb-0 nl2br" slot-scope="text" v-if="type == CHOOSE_DATA_TYPE.CARDS">{{ text }}</p>
            <span slot="cardTypeNameEn" class="font-16px font-weight-bold" slot-scope="text" v-if="type == CHOOSE_DATA_TYPE.CARDS">{{ text }}</span>

            <span slot="identityName" class="font-16px " slot-scope="text" v-if="type == CHOOSE_DATA_TYPE.MODEL3D">{{ text }}</span>

            <span slot="action" class="ic-row-right"></span>
          </a-table>
        </div>

      </div>
    </a-modal>
  </div>
</template>
<script>
  import { mapActions, mapState, mapMutations } from "vuex";
  import { CHOOSE_DATA_TYPE, PAGE_SIZE, TYPE_MEDIA } from "~/plugins/constant";

  export default {
    props: ['type', 'columnData'],
    data() {
      return {
        CHOOSE_DATA_TYPE,
        TYPE_MEDIA,
        form: this.$form.createForm(this, { name: 'search' }),
        isNotFilter: true,
        loading: false,
        queryParams: {},
        titleModal: '',
        dataList: null,
        pagination: {},
        activeTabKey: TYPE_MEDIA.IMAGES
      };
    },
    computed: {
      ...mapState({
        isShow: state => state.common.isShow,
        queryDataChoose: state => state.common.queryDataChoose,
        listLanguage: state => state.languages.listLanguage,
        cardTypes: state => state.cardTypes.cardTypes,
        listDisplayModel: state => state.model3D.listDisplayModel,
      })
    },
    watch: {
      isShow: function() {
        if (this.isShow) {
          this.initData();
        } else {
          this.form.resetFields();
        }
      }
    },
    methods: {
      ...mapMutations({
        setShowModal: 'common/setShowModal',
        setShowPreview: 'common/setShowPreview',
        setNameDisplayModel: 'model3D/setNameDisplayModel',
      }),
      ...mapActions({
        getListInstructions: 'instructions/getListInstructions',
        getInstructionById: 'instructions/getInstructionById',
        getListMedia: 'medias/getListMedia',
        getListCards: 'cards/getListCards',
        getMediaInfo: 'medias/getMediaInfo',
        getListButtons: 'buttons/getListButtons',
        getButtonById: 'buttons/getButtonById',
        getInfoDiagnosisCard: 'cards/getInfoDiagnosisCard',
        getListModel3D: 'model3D/getListModel3D',
        getListPartModel: 'model3D/getListPartModel',
        getListColor: 'model3D/getListColor',
      }),
      initData() {
        const { pageNumber, pageSize, search } = this.queryDataChoose;
        const params = {
          pageNumber: _.isNil(pageNumber) ? 1 : pageNumber,
          pageSize: _.isNil(pageSize) ? PAGE_SIZE : pageSize,
          search: _.isNil(search) ? '' : search,
          locale: this.getLocaleDefault(this.listLanguage),
        };
        this.queryParams = params;
        this.isNotFilter = (params.search === '');
        this.handleSearch(params);
      },
      async handleSearch(params) {
        let resApi = {};
        this.isNotFilter = (params.search === '');
        switch (this.type) {
          case CHOOSE_DATA_TYPE.INSTRUCTIONS:
            this.titleModal = this.$t('cards.chooseInstruction');
            resApi = await this.getListInstructions(params);
            if (resApi.status == 200) {
              this.dataList = resApi.data.instruction;
            }
            break;
          case CHOOSE_DATA_TYPE.MEDIA:
            this.titleModal = this.$t('cards.chooseMedia');
            params.type = params.type ? params.type : this.activeTabKey;
            resApi = await this.getListMedia(params);
            if (resApi.status == 200) {
              this.dataList = resApi.data.diagnosisImages;
            }
            break;
          case CHOOSE_DATA_TYPE.BUTTONS:
            this.titleModal = this.$t('cards.chooseButton');
            resApi = await this.getListButtons(params);
            if (resApi.status == 200) {
              this.dataList = resApi.data.choiceCodes;
            }
            break;
          case CHOOSE_DATA_TYPE.CARDS:
            this.titleModal = 'Choose card';
            resApi = await this.getListCards(params);
            if (resApi.status == 200) {
              this.dataList = resApi.data.card;
            }
            break;
          case CHOOSE_DATA_TYPE.MODEL3D:
            this.titleModal = 'Choose 3D Model';
            resApi = await this.getListModel3D(params);
            this.dataList = this.listDisplayModel.displayModels;
            break;
          default:
            // default statements
        }

        if (!_.isEmpty(resApi) && resApi.status == 200) {
          const pagination = { ...this.pagination };
          pagination.total = resApi.data.totalRecord;
          pagination.pageSize = resApi.data.pageSize;
          pagination.current = resApi.data.pageNumber;
          this.loading = false;
          this.pagination = pagination;
        }
      },
      handleCancel(e) {
        this.activeTabKey = TYPE_MEDIA.IMAGES;
        this.setShowModal(false);
        this.dataList = null;
        this.pagination = {};
        this.queryParams = {};
      },
      handleTableChange(pagination, filters, sorter) {
        const params = {
          ...this.queryParams,
          pageNumber: pagination.current
        };
        this.handleSearch(params);
      },
      handleSubmit(e) {
        e.preventDefault();
      },
      handleKeyUp(e) {
        const value = e.target.value;
        console.log(value);
        this.queryParams = {
          ...this.queryParams,
          search: value ? _.trim(value) : '',
          pageNumber: 1,
          locale: this.getLocaleDefault(this.listLanguage),
        };
        _.delay(() => {
          this.handleSearch(this.queryParams);
        }, 200)
      },
      customRow(record, index) {
        return {
          on: {
            click: async () => {
              switch (this.type) {
                case CHOOSE_DATA_TYPE.INSTRUCTIONS:
                  await this.getInstructionById(record.instructionId);
                  break;
                case CHOOSE_DATA_TYPE.MEDIA:
                  await this.getMediaInfo(record.imageId);
                  break;
                case CHOOSE_DATA_TYPE.BUTTONS:
                  await this.getButtonById(record.choiceCode);
                  break;
                case CHOOSE_DATA_TYPE.CARDS:
                  await this.getInfoDiagnosisCard({ cardId: record.cardId, locale: this.getLocaleDefault(this.listLanguage)});
                  break;
                case CHOOSE_DATA_TYPE.MODEL3D:
                  await this.getListPartModel({ displayModelId: record.displayModelId });
                  await this.getListColor();
                  this.setNameDisplayModel(record.identityName);
                  break;
                default:
                  // default statements
              }
              this.setShowModal(false);
              this.setShowPreview(true);
            }
          }
        }
      },
      async handleChangeTabs(key) {
        this.activeTabKey = key;
        let params = {
          search: '',
          type: key,
          pageNumber: 1,
          pageSize: PAGE_SIZE,
          locale: this.getLocaleDefault(this.listLanguage),
        };
        this.queryParams = params;
        this.handleSearch(params);
      },
      handleChangeFilterType(value) {
        this.queryParams = {
          ...this.queryParams,
          cardTypeId: (value && value != 'all') ? _.parseInt(value) : '',
          pageNumber: 1,
          locale: this.getLocaleDefault(this.listLanguage),
        };
        this.handleSearch(this.queryParams);
      }
    },
  };
</script>
