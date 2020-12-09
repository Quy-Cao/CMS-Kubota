<template>
  <div>
    <a-modal :visible="isShowPreview" title="" @cancel="handleCancel" width="70%" :footer="null" :dialogStyle="{animationDuration: isShowPreview ? '0.4s' : '', display: isShowPreview ? '' : 'none'}" >
      <div class="d-flex justify-center align-item-center" style="min-height: 250px" v-if="isLoading">
        <a-spin size="large" />
      </div>
      <div class="px-5 pt-2 pb-4 mx-5" v-if="!isLoading">
        <p class="font-28px mb-2 pb-1 position-relative txt-main">
          <b>{{ type === CHOOSE_DATA_TYPE.MODEL3D ? nameDisplayModel ? nameDisplayModel : nameEditModel3D : $t('commonText.txtPreview') }}</b>
          <i class="icon-back" @click="handleCancel"></i>
        </p>
        <p class="font-16px txt-danger txt-center" v-if="!isMediaChosen">{{ $t('messValidate.messChooseData')}}</p>
        <div class="box-preview p-4" v-if="dataInfo">
          <div v-if="type == CHOOSE_DATA_TYPE.INSTRUCTIONS">
            <a-row v-for="name in dataInfo.names" :key="name.locale">
              <a-col :span="3">
                <span>{{ getNameLocale(name.locale, listLanguage) }}</span>
              </a-col>
              <a-col :span="20">
                <p v-html="name.content" class="nl2br"></p>
              </a-col>
            </a-row>
          </div>
          <div v-else-if="type == CHOOSE_DATA_TYPE.MEDIA">
            <div v-if="dataInfo.type == TYPE_MEDIA.IMAGES"><img :src="dataInfo.path" alt="" class="uri-file"></div>
            <div v-else><video :src="dataInfo.path" controls class="uri-file"></video></div>
            <a-row class="mt-3">
              <a-col :span="3">
                <span>{{ $t('medias.titleFileName') }}</span>
              </a-col>
              <a-col :span="20">
                <span>{{ dataInfo.fileName }}</span>
              </a-col>
            </a-row>
            <!-- <p class="mt-5 font-16px"><b>{{ $t('medias.titleCaption') }}</b></p>
            <a-row v-for="name in dataInfo.names" :key="name.locale">
              <a-col :span="3">
                <span>{{ getNameLocale(name.locale, listLanguage) }}</span>
              </a-col>
              <a-col :span="20">
                <p v-html="getContentLocale(dataInfo.names, getLocaleDefault(listLanguage))"></p>
              </a-col>
            </a-row> -->
          </div>
          <!-- Model 3D -->
          <div v-if="type == CHOOSE_DATA_TYPE.MODEL3D">
            <p class="mb-2 font-28px txt-main"><b>{{ $t('model3D.titleChoosePart') }}</b></p>
            <div class="d-flex">
              <div class="mr-3 d-flex flex-row">
                <a-form-item class="mr-1 mb-0">
                  <a-input
                    :value="keyWord"
                    @change="changeKeyWord"
                    :placeholder="$t('commonText.txtSearch')"
                    @keyup="handleKeyUp"
                  >
                  </a-input>
                </a-form-item>
                <a-form-item class="m-0">
                  <a-button class="short" @click="searchPathModel" :type="!isNotFilter ? 'primary' : ''">
                    {{ $t('commonText.btnFilter') }}
                  </a-button>
                </a-form-item>
              </div>
              <div>
                <a-select
                  v-model="bulkActionId"
                  :placeholder="$t('model3D.txtBulkAction')"
                  @change="handlechangeBulkColor"
                  class="mr-1"
                  :disabled="isPublishVersion ? true : false"
                >
                  <a-select-option value="" >
                    <div class="d-flex">
                      <div class="ic-color "></div>
                      <div><span class="ml-2">{{ $t('model3D.txtNoHighlight') }}</span></div>
                    </div>
                  </a-select-option>
                  <a-select-option v-for="color in listColor" :key="color.colorTypeId">
                    <div class="d-flex">
                      <div class="ic-color " :style="{background: color.colorHex, borderStyle: 'solid', borderColor: color.colorHex}"></div>
                      <div><span class="ml-2">{{ getContentLocale(color.names, getLocaleDefault(listLanguage)) }}</span></div>
                    </div>
                  </a-select-option>
                </a-select>
                <a-button class="short" @click="handleClickBulkAction" :disabled="(selectedRowKeys.length && bulkActionId != undefined) ? false : true">
                  {{ $t('issues.btnApply') }}
                </a-button>
              </div>
            </div>
            <div>
              <div class="mt-3">
                <a-table
                  :columns="columns"
                  :data-source="dataInfo"
                  :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                  :loading="loading"
                  class="table-row"
                  :rowKey="record => record.partModelId"
                >
                  <span slot="identityName" class="font-16px font-weight-bold" slot-scope="text">{{ text }}</span>
                  <span slot="pathHighlight" class="font-16px" slot-scope="text">{{ text }}</span>
                  <div slot="action" slot-scope="record">
                    <a-form-model :model="selectColorPart" layout="inline">
                      <a-form-model-item>
                        <a-select
                          v-model="record.colorTypeId"
                          :placeholder="$t('model3D.txtBulkAction')"
                          class="custom-select-model3d"
                          style="display: block;"
                          @change="handleChangeColor($event, record.partModelId)"
                          :disabled="isPublishVersion ? true : false"
                        >
                          <a-select-option value="" >
                            <div class="d-flex">
                              <div class="ic-color"></div>
                              <div class="ml-2 text-color">{{ $t('model3D.txtNoHighlight') }}</div>
                            </div>
                          </a-select-option>
                          <a-select-option v-for="color in listColor" :key="color.colorTypeId">
                            <div class="d-flex">
                              <div class="ic-color " :style="{background: color.colorHex, borderStyle: 'solid', borderColor: color.colorHex}"></div>
                              <div class="text-color"><span class="ml-2">{{ getContentLocale(color.names, getLocaleDefault(listLanguage)) }}</span></div>
                            </div>
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-form-model>
                  </div>
                </a-table>
              </div>
            </div>
          </div>
          <!-- Button -->
          <div v-if="type == CHOOSE_DATA_TYPE.BUTTONS">
            <div v-for="(button, index) in dataInfo.choiceDescs" class="mb-3" :key="index">
              <p><b>{{ $t('buttons.txtButton') }} {{ index + 1 }}</b></p>
              <a-row v-for="name in button.names" :key="name.locale">
                <a-col :span="3">
                  <span>{{ getNameLocale(name.locale, listLanguage) }}</span>
                </a-col>
                <a-col :span="20">
                  <p v-html="name.content"></p>
                </a-col>
              </a-row>
            </div>
          </div>
          <div v-if="type == CHOOSE_DATA_TYPE.CARDS && dataInfo != null">
            <a-row class="mb-3 d-flex align-item-center">
              <a-col :span="3">
                <span>Title</span>
              </a-col>
              <a-col :span="20">
                <p class="font-24px txt-main mb-0 nl2br"><b>{{ getContentLocale(dataInfo.cardNames, getLocaleDefault(listLanguage)) }}</b></p>
              </a-col>
            </a-row>
            <a-row class="mb-3">
              <a-col :span="3">
                <span>Card ID</span>
              </a-col>
              <a-col :span="20">
                <span class="font-16px txt-main"><b>{{ dataInfo.cardId }}</b></span>
              </a-col>
            </a-row>
            <a-row class="mb-3">
              <a-col :span="3">
                <span>Card type</span>
              </a-col>
              <a-col :span="20">
                <span class="font-16px txt-main"><b>{{ getContentLocale(dataInfo.cardTypeNames, getLocaleDefault(listLanguage)) }}</b></span>
              </a-col>
            </a-row>
            <a-row class="mb-3">
              <a-col :span="3">
                <span>Instruction</span>
              </a-col>
              <a-col :span="20">
                <span v-if="!dataInfo.instructionNames.length" >-</span>
                <p v-else v-html="getContentLocale(dataInfo.instructionNames, getLocaleDefault(listLanguage))" class="font-weight-bold font-16px txt-main nl2br"></p>
              </a-col>
            </a-row>
            <a-row class="mb-3">
              <a-col :span="3">
                <span>Media</span>
              </a-col>
              <a-col :span="20">
                <div v-if="dataInfo.diagnosisImages.length != 0">
                  <div class="d-flex" style="flex-wrap: wrap">
                    <div class="d-flex flex-column mb-3" style="flex-grow: 0.5" v-for="media in dataInfo.diagnosisImages" :key="media.imageId">
                      <span class="font-16px txt-main mb-1"><b>{{ media.fileName }}</b></span>
                      <img v-if="media.type === TYPE_MEDIA.IMAGES" :src="media.path" alt="" class="uri-file">
                      <div v-else><video :src="media.path" controls class="uri-file"></video></div>
                    </div>
                  </div>
                </div>
                <span v-else>-</span>
              </a-col>
            </a-row>
            <a-row v-for="(button, index) in dataInfo.choiceDesc" class="mb-3" :key="index">
                <a-col :span="3">
                  {{ $t('buttons.txtButton') }} {{ index + 1}}
                </a-col>
                <a-col :span="20">
                  <span class="font-16px txt-main"><b>{{ getContentLocale(button.names, getLocaleDefault(listLanguage)) }}</b></span>
                </a-col>
            </a-row>
          </div>
        </div>
        <p class="txt-center mt-4 pt-2 mb-1">
          <a-button :disabled="(isMediaChosen ? false : true) || (isPublishVersion ? true : false)" type="primary" @click="handleChoose">{{ type == CHOOSE_DATA_TYPE.MODEL3D ? $t('commonText.btnSave') : $t('commonText.actionChoose') }}</a-button>
        </p>
      </div>
    </a-modal>
  </div>
</template>
<script>
  import { mapActions, mapState, mapMutations } from "vuex";
  import { CHOOSE_DATA_TYPE, PAGE_SIZE, TYPE_MEDIA } from "~/plugins/constant";

  export default {
    props: ['type', 'isModel', 'replaceInfo', 'dataModel3D', 'isEditModel', 'isPublishVersion'],
    data() {
      const columns = [
        {
          title: this.$t('model3D.titlePart'),
          dataIndex: 'identityName',
          key: 'identityName',
          scopedSlots: { customRender: 'identityName' }
        },
        {
          title: this.$t('model3D.txtPartDetail'),
          dataIndex: 'pathHighlight',
          key: 'pathHighlight',
          scopedSlots: { customRender: 'pathHighlight' },
          width: '50%'
        },
        {
          title: '',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          width: '50px'
        },
      ];
      return {
        form: this.$form.createForm(this, { name: 'Model 3D' }),
        CHOOSE_DATA_TYPE,
        TYPE_MEDIA,
        dataInfo: null,
        isMediaChosen: true,
        columns,
        loading: false,
        selectedRowKeys: [],
        selectedModel: [],
        bulkActionId: undefined,
        selectColorPart: {
          colorPart: ''
        },
        nameEditModel3D: '',
        isLoading: false,
        keyWord: '',
        isNotFilter: true,
        oldListData: [],
        isChangeColor: false
      };
    },
    computed: {
      ...mapState({
        isShow: state => state.common.isShow,
        isShowPreview: state => state.common.isShowPreview,
        listLanguage: state => state.languages.listLanguage,
        instructionInfo: state => state.instructions.instructionInfo,
        mediaInfo: state => state.medias.mediaInfo,
        buttonInfo: state => state.buttons.buttonInfo,
        diagnosisCardInfo: state => state.cards.diagnosisCardInfo,
        diagnosisCardData: state => state.cards.diagnosisCardData,
        diagnosisModelData: state => state.models.diagnosisModelData,
        stepId: state => state.models.stepId,
        choiceOrder: state => state.models.choiceOrder,
        featureStepId: state => state.models.featureStepId,
        isReplace: state => state.models.isReplace,
        Model3DInfo: state => state.model3D.Model3DInfo,
        listColor: state => state.model3D.listColor,
        listDisplayModel: state => state.model3D.listDisplayModel,
        nameDisplayModel: state => state.model3D.nameDisplayModel,
      })
    },
    watch: {
      isShowPreview: function() {
        if (this.isShowPreview) {
          this.initData();
        }
      }
    },
    methods: {
      ...mapActions({
        getListPartModel: 'model3D/getListPartModel',
      }),
      ...mapMutations({
        setShowModal: 'common/setShowModal',
        setShowPreview: 'common/setShowPreview',
        setDiagnosisCardData: 'cards/setDiagnosisCardData',
        setDiagnosisModelData: 'models/setDiagnosisModelData',
        setIsReplace: 'models/setIsReplace',
        getListModel3D: 'model3D/getListModel3D',
      }),
      async initData() {
        this.isLoading = true;
        switch (this.type) {
          case CHOOSE_DATA_TYPE.INSTRUCTIONS:
            this.dataInfo = this.instructionInfo;
            break;
          case CHOOSE_DATA_TYPE.MEDIA:
            this.dataInfo = this.mediaInfo;
            let value = _.findIndex(this.diagnosisCardData.diagnosisImages,it => it.imageId === this.dataInfo.imageId);
            value == -1 ? this.isMediaChosen = true : this.isMediaChosen = false
            break;
          case CHOOSE_DATA_TYPE.MODEL3D:
              if(this.isEditModel) {
                await this.getListPartModel({ displayModelId: this.diagnosisCardData.dispObjectMetaDatas[0].displayModelId });
              }
              this.setData3DModel();
              this.isEditModel
              ? this.oldListData = this.dataInfo.map(it => ({...it, colorTypeId: (this.diagnosisCardData.dispObjectMetaDatas.find(item => item.partModelId === it.partModelId) ?? {colorTypeId: ''}).colorTypeId}))
              : this.oldListData = this.dataInfo;
            break;
          case CHOOSE_DATA_TYPE.BUTTONS:
            this.dataInfo = this.buttonInfo;
            break;
          case CHOOSE_DATA_TYPE.CARDS:
            this.dataInfo = this.diagnosisCardInfo;
            break;
          default:
            // default statements
        }
        this.isLoading = false;
      },
      handleChoose() {
        let data = {};
        if (this.isModel) {
          data = {
            ...this.diagnosisModelData
          }
        } else {
          data = {
            ...this.diagnosisCardData
          };
        }
        switch (this.type) {
          case CHOOSE_DATA_TYPE.INSTRUCTIONS:
            data = {
              ...data,
              bodyKey: this.dataInfo.causesKey,
              causesKey: this.dataInfo.causesKey,
              instructionNames: this.dataInfo.names
            };
            this.isModel ? this.setDiagnosisModelData(data) : this.setDiagnosisCardData(data);
            this.setShowModal(false);
            this.setShowPreview(false);
            this.dataInfo = null;
            break;
          case CHOOSE_DATA_TYPE.MEDIA:
            let imageData= this.diagnosisCardData.diagnosisImages ? _.cloneDeep(this.diagnosisCardData.diagnosisImages) : [];
            let indexReplace = imageData.findIndex(it => it.imageId == this.replaceInfo);
            this.replaceInfo ? imageData[indexReplace] = this.dataInfo : imageData.push(this.dataInfo);
            data = {
              ...data,
              diagnosisImages: [...imageData]
            };
            this.isModel ? this.setDiagnosisModelData(data) : this.setDiagnosisCardData(data);
            this.setShowModal(false);
            this.setShowPreview(false);
            this.dataInfo = null;
            break;
          case CHOOSE_DATA_TYPE.MODEL3D:
            let removeNoColor = _.remove(this.oldListData, it => it.colorTypeId == '');
            data = {
              ...data,
              dispObjectMetaDatas: this.oldListData,
            };
            this.isModel ? this.setDiagnosisModelData(data) : this.setDiagnosisCardData(data);
            this.setShowModal(false);
            this.setShowPreview(false);
            this.dataInfo = null;
            this.selectedRowKeys = [];
            this.bulkActionId = undefined;
            this.keyWord = '';
            break;
          case CHOOSE_DATA_TYPE.BUTTONS:
            data = {
              ...data,
              choiceDesc: this.dataInfo.choiceDescs
            };
            this.isModel ? this.setDiagnosisModelData(data) : this.setDiagnosisCardData(data);
            this.setShowModal(false);
            this.setShowPreview(false);
            this.dataInfo = null;
            break;
          case CHOOSE_DATA_TYPE.CARDS:
            let dataStep = {
              ...this.dataInfo,
              keyStep: `${Date.now()}${parseInt((1000 * Math.random()) / 1)}`,
              activeKeys: []
            }; //Selected data
            if (_.isNull(data.flowStep)) {
              // Add the first card
              dataStep = {
                ...dataStep,
                flowStepChilds: null,
                parentId: null,
                stepId: this.featureStepId,
              }

              data.flowStep = ({...dataStep, choiceDesc: dataStep.choiceDesc ? dataStep.choiceDesc.map(it => ({...it, keyStep: `${Date.now()}${parseInt((1000 * Math.random()) / 1)}`, activeKeys: []})) : []});
              this.isModel ? this.setDiagnosisModelData(data) : this.setDiagnosisCardData(data);
              this.setShowModal(false);
              this.setShowPreview(false);
              this.dataInfo = null;
            } else {
              // Find replacing position
              const replacingIndexs = this.findChildStepPath(this.diagnosisModelData.flowStep, this.stepId);
              if (replacingIndexs) {
                const foundItem = _.get(data, replacingIndexs);
                //Replace data
                if (this.isReplace) {
                  let dataUpdate = {
                    ...dataStep,
                    flowStepChilds: null,
                    parentId: foundItem.parentId,
                    stepId: foundItem.stepId,
                    choiceOrder: foundItem.choiceOrder
                  }
                  if (foundItem.choiceDesc.length === this.dataInfo.choiceDesc.length) {
                    dataUpdate = {
                      ...dataUpdate,
                      flowStepChilds: foundItem.flowStepChilds
                    }
                    this.changeData(data, replacingIndexs, dataUpdate);
                  } else {
                    this.$confirm({
                      title: this.$t('titleFormModal.noteReplaceCard'),
                      onOk: () => {
                        this.changeData(data, replacingIndexs, dataUpdate);
                      }
                    });
                  }
                } else {
                  dataStep = {
                    ...dataStep,
                    flowStepChilds: null,
                    choiceOrder: this.choiceOrder,
                    parentId: foundItem.stepId,
                    stepId: this.featureStepId
                  };
                  let dataChild = foundItem.flowStepChilds;
                  if (_.isNull(foundItem.flowStepChilds)) {
                    dataChild = [{...dataStep, choiceDesc: dataStep.choiceDesc ? dataStep.choiceDesc.map(it => ({...it, keyStep: `${Date.now()}${parseInt((1000 * Math.random()) / 1)}`, activeKeys: []})) : []}];
                  } else {
                    const indexChild = this.findStepByChoiceOrder(foundItem.flowStepChilds, this.choiceOrder);
                    if (indexChild == -1) {
                      dataChild[foundItem.flowStepChilds.length] = dataStep;
                    } else {
                      dataChild[indexChild] = dataStep;
                    }
                  }

                  const dataCreate = {
                    ...foundItem,
                    flowStepChilds: dataChild
                  }
                  this.changeData(data, replacingIndexs, dataCreate);
                }
              }
            }
            break;
          default:
            // default statements
        }
      },
      handleCancel() {
        this.setShowPreview(false);
        this.isEditModel ? this.setShowModal(false) : this.setShowModal(true);
        this.dataInfo = null;
        this.selectedRowKeys = [];
        this.selectedModel = [];
        this.bulkActionId = undefined;
        this.isMediaChosen = true;
        this.keyWord = '';
        this.isChangeColor = false;
      },
      changeData(data, replacingIndexs, dataCreate) {
        const dataUpdate = _.cloneDeep(data);
        _.set(dataUpdate, replacingIndexs, dataCreate);
        this.isModel ? this.setDiagnosisModelData(dataUpdate) : this.setDiagnosisCardData(dataUpdate);
        this.setShowModal(false);
        this.setShowPreview(false);
        this.dataInfo = null;
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedModel = selectedRows;
        this.selectedRowKeys = selectedRowKeys;
      },
      handleClickBulkAction() {
        let newSelectColor = this.selectedModel.map(it => ({...it, colorTypeId: this.bulkActionId}));
        this.dataInfo = this.dataInfo.reduce((arr, current) => {
          return [...arr, newSelectColor.find(it =>  it.partModelId === current.partModelId) || current]
        }, []);
        this.oldListData = this.oldListData.map(it=> ({...it, colorTypeId: this.selectedRowKeys.find(el => el == it.partModelId) ? this.bulkActionId : it.colorTypeId}));
        this.selectedRowKeys = [];
        this.bulkActionId = undefined;
      },
      handlechangeBulkColor(value) {
        this.bulkActionId = value
      },
      async searchPathModel() {
        await this.getListPartModel({
          displayModelId: this.oldListData[0].displayModelId,
          search: this.keyWord
        });
        this.setData3DModel();
      },
      changeKeyWord(e) {
        this.keyWord = e.target.value;
      },
      handleKeyUp(e) {
        this.keyWord = e.target.value;
        this.searchPathModel();
      },
      handleChangeColor(e, partModelId) {
        this.oldListData = this.oldListData.map(it=> ({...it, colorTypeId: it.partModelId == partModelId ? e : it.colorTypeId}));
        this.isChangeColor = true;
      },
      setData3DModel() {
        if(this.isEditModel) {
          this.dataInfo = this.Model3DInfo.map(it => ({
            ...it,
            displayModel: this.diagnosisCardData.dispObjectMetaDatas[0].displayModel,
            colorTypeId: this.isChangeColor
            ? (this.oldListData.find(item => item.partModelId == it.partModelId) ?? {colorTypeId: ''}).colorTypeId
            : (this.diagnosisCardData.dispObjectMetaDatas.find(item => item.partModelId === it.partModelId) ?? {colorTypeId: ''}).colorTypeId,
          }))
          this.nameEditModel3D = this.diagnosisCardData.dispObjectMetaDatas[0].displayModel.identityName;
          this.bulkActionId = undefined;
        } else {
          this.dataInfo = this.Model3DInfo.map(model => ({
            ...model,
            displayModel: this.listDisplayModel ? this.listDisplayModel.displayModels.find(it => it.displayModelId === model.displayModelId) : '',
            colorTypeId: (this.oldListData.find(it => it.partModelId == model.partModelId) ?? {colorTypeId: ''}).colorTypeId
          }));
        }
      }
    }
  };
</script>
