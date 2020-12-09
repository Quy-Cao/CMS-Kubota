<template>
  <div>
    <div class="d-flex justify-center align-item-center" style="min-height: 500px" v-if="$fetchState.pending">
      <a-spin size="large" />
    </div>
    <a-form-model ref="formDiagnosisCard" :model="formDiagnosisCard" v-else>
      <div class="mb-3 d-flex justify-space-between align-item-center">
        <div>
          <h1 class="m-0">
            <strong class="font-28px mr-3">{{ getContentLocale(formDiagnosisCard.cardNames, getLocaleDefault(listLanguage)) }}</strong>
            <nuxt-link :to="`/cards/${formDiagnosisCard.cardId}/edit`" class="font-14px ml-2"><u>{{ $t('commonText.actionEdit') }}</u></nuxt-link>
            <a class="font-14px ml-2" @click="handleDuplicate"><u>{{ $t('commonText.actionDuplicate') }}</u></a>
          </h1>
          <a-breadcrumb>
            <span slot="separator" class="ic-breadcrumb"><img src="../../../assets/images/line.svg"></span>
            <a-breadcrumb-item>
              <nuxt-link to="/cards"><u>{{ $t('cards.titlePage') }}</u></nuxt-link>
              </a-breadcrumb-item>
            <a-breadcrumb-item>
              {{ getContentLocale(formDiagnosisCard.cardNames, getLocaleDefault(listLanguage)) }}
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div>
          <a-button type="primary" @click="handleSave" :disabled="formDiagnosisCard.publishVersion ? true : false">{{ $t('commonText.btnSave') }}</a-button>
        </div>
      </div>
      <div class="p-4 pb-5 bg-white box-content">
        <a-form-model-item
          :label="$t('cards.titleCardId')"
          :label-col="{ span: 4 }" :wrapper-col="{ span: 10 }"
          class="mb-2"
        >
          <span>{{ formDiagnosisCard.cardId }}</span>
        </a-form-model-item>
        <a-form-model-item
          :label="$t('cards.lableCardType')"
          :label-col="{ span: 4 }" :wrapper-col="{ span: 10 }"
          class="mb-2"
          prop="cardTypeId"
        >
          <div class="d-flex justify-space-between w-100">
            <div class="mr-3" style="flex-grow: 1;">
              <a-select v-model="formDiagnosisCard.cardTypeId" @change="handleSelectCardType" :disabled="!formDiagnosisCard.canEdit">
                <a-select-option v-for="(cardType, index) in cardTypes" :key="cardType.cardTypeId">
                  {{ cardType.name }}
                </a-select-option>
              </a-select>
            </div>
            <nuxt-link to="/cardTypes/add"><u>{{ $t('cardTypes.btnAdd') }}</u></nuxt-link>
          </div>
        </a-form-model-item>
        <a-form-model-item
          :label="$t('cards.titleCaption')"
          :label-col="{ span: 4 }" :wrapper-col="{ span: 10 }"
          class="mb-5"
        >
          <p class="nl2br">{{ getContentLocale(formDiagnosisCard.cardNotes, getLocaleDefault(listLanguage)) }}</p>
        </a-form-model-item>
        <div class="mb-5" v-if="diagnosisCardData.instructionNames">
          <p><b>{{ $t('instructions.titleInstruction') }}</b></p>
          <a-row>
            <a-col :span="15">
              <div v-if="diagnosisCardData.instructionNames.length != 0">
                <div class="box-preview p-4">
                  <p v-html="getContentLocale(diagnosisCardData.instructionNames, getLocaleDefault(listLanguage))" class="nl2br"></p>
                </div>
                <p class="mt-2" v-if="!formDiagnosisCard.publishVersion">
                  <a class="mr-3" @click="handleChoose(CHOOSE_DATA_TYPE.INSTRUCTIONS)" ><u>{{ $t('commonText.actionReplace') }}</u></a>
                  <a class="txt-danger mr-3" @click="handleRemove(CHOOSE_DATA_TYPE.INSTRUCTIONS)"><u>{{ $t('commonText.actionRemove') }}</u></a>
                </p>
              </div>
              <a-button @click="handleChoose(CHOOSE_DATA_TYPE.INSTRUCTIONS)" v-else :disabled="formDiagnosisCard.publishVersion ? true : false">{{ $t('cards.chooseInstruction') }}</a-button>
            </a-col>
          </a-row>
        </div>
        <div class="mb-5" v-if="diagnosisCardData.diagnosisImages">
          <p><b>{{ $t('medias.titlePage') }}</b></p>
          <a-row>
            <a-col :span="15">
              <div v-if="diagnosisCardData.diagnosisImages.length != 0">
                <div class="pr-4 mt-3 mb-3" v-for="media in diagnosisCardData.diagnosisImages" :key="media.imageId">
                  <div class="d-flex">
                    <div v-if="media.type == TYPE_MEDIA.IMAGES"><img :src="media.path" alt="" class="uri-file"></div>
                    <div v-else><video :src="media.path" controls class="uri-file"></video></div>
                    <div class="ml-3">
                      <p>{{ media.fileName }}</p>
                      <p class="mt-2" v-if="!formDiagnosisCard.publishVersion">
                        <a class="mr-3" @click="handleChoose(CHOOSE_DATA_TYPE.MEDIA, media.imageId)" ><u>{{ $t('commonText.actionReplace') }}</u></a>
                        <a class="txt-danger mr-3" @click="handleRemove(CHOOSE_DATA_TYPE.MEDIA, media.imageId)"><u>{{ $t('commonText.actionRemove') }}</u></a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <a-button @click="handleChoose(CHOOSE_DATA_TYPE.MEDIA)" :disabled="formDiagnosisCard.publishVersion ? true : false">{{ $t('cards.chooseMedia') }}</a-button>
            </a-col>
          </a-row>
        </div>
        <div class="mb-5" v-if="diagnosisCardData.dispObjectMetaDatas">
          <p><b>{{ $t('cards.ar3D') }}</b></p>
          <div v-if="diagnosisCardData.dispObjectMetaDatas.length != 0">
            <p>{{ diagnosisCardData.dispObjectMetaDatas ? diagnosisCardData.dispObjectMetaDatas[0].displayModel.identityName : '' }}</p>
            <p class="mt-2" v-if="!formDiagnosisCard.publishVersion">
              <a class="mr-3" @click="handleChoose(CHOOSE_DATA_TYPE.MODEL3D)" ><u>{{ $t('commonText.actionReplace') }}</u></a>
              <a class="txt-danger mr-3" @click="handleRemove(CHOOSE_DATA_TYPE.MODEL3D)"><u>{{ $t('commonText.actionRemove') }}</u></a>
              <a class="mr-3" @click="handleEditHighlight()"><u>{{ $t('commonText.actionEditHighlight') }}</u></a>
            </p>
            <p class="mt-2" v-else>
              <a @click="handleEditHighlight()"><u>{{ $t('commonText.actionViewHighlight') }}</u></a>
            </p>
          </div>
          <a-button v-else @click="handleChoose(CHOOSE_DATA_TYPE.MODEL3D)" :disabled="formDiagnosisCard.publishVersion ? true : false">{{ $t('cards.chooseAr') }}</a-button>
        </div>
        <div v-if="diagnosisCardData.choiceDesc">
          <p><b>{{ $t('cards.txtButton') }}</b></p>
            <div v-if="diagnosisCardData.choiceDesc.length != 0">
              <a-form-model-item label="">
                <a-radio-group v-model="formDiagnosisCard.isEndOfDiagnosis" >
                  <a-radio v-for="item in IS_END_DIAGNOSIS" :key="item.id" :value="item.id" :disabled="disabledSettingDianosis">
                    {{ item.id == IS_END_DIAGNOSIS.END_DIAGNOSIS.id ? 'No button; end of diagnosis' : 'Button(s) to proceed' }}
                  </a-radio>
                </a-radio-group>
              </a-form-model-item>
              <div>
                <a-row>
                  <a-col :span="13">
                    <div class="box-preview py-1 px-4">
                      <div v-for="(button, index) in diagnosisCardData.choiceDesc" :key="button.bodyKey">
                        <a-row class="my-3">
                          <a-col :span="3">
                            <b>{{ $t('buttons.txtButton') }} {{ index + 1}}</b>
                          </a-col>
                          <a-col :span="20">
                            <span>{{ getContentLocale(button.names, getLocaleDefault(listLanguage)) }}</span>
                          </a-col>
                        </a-row>
                      </div>
                    </div>
                  </a-col>
                </a-row>
                <div>
                  <p class="mt-2" v-if="formDiagnosisCard.canEdit">
                    <a class="mr-3" @click="handleChoose(CHOOSE_DATA_TYPE.BUTTONS)" ><u>{{ $t('commonText.actionReplace') }}</u></a>
                    <a class="txt-danger mb-1 mr-3" @click="handleRemove(CHOOSE_DATA_TYPE.BUTTONS)"><u>{{ $t('commonText.actionRemove') }}</u></a>
                  </p>
                </div>
              </div>
            </div>
            <a-button v-else @click="handleChoose(CHOOSE_DATA_TYPE.BUTTONS)" :disabled="!formDiagnosisCard.canEdit">{{ $t('cards.chooseButton') }}</a-button>
        </div>
      </div>
      <div class="mt-3" v-if="!formDiagnosisCard.publishVersion">
        <span @click="showConfirmDelete" style="cursor: pointer"><u class="txt-danger-bold">{{ $t('cards.txtDelete')}}</u></span>
      </div>
      <ModalChoose :type="type" :columnData="columnData" ></ModalChoose>
      <ModalPreview :type="type" :replaceInfo="replaceInfo" :dataModel3D="dataModel3D" :isEditModel="isEditModel" :isPublishVersion="isPublishVersion"></ModalPreview>
    </a-form-model>
  </div>
</template>
<script>
  import { mapActions, mapState, mapMutations } from "vuex";
  import ModalChoose from "~/components/modal-choose";
  import ModalPreview from "~/components/modal-preview";
  import { CHOOSE_DATA_TYPE, IS_END_DIAGNOSIS, TYPE_MEDIA} from "~/plugins/constant";

  export default {
    middleware: ['ktcUsers'],
    components: {
      ModalChoose,
      ModalPreview
    },
    data() {
      return {
        CHOOSE_DATA_TYPE,
        IS_END_DIAGNOSIS,
        TYPE_MEDIA,
        formDiagnosisCard: {},
        isShowModal: false,
        type: null,
        columnData: [],
        replaceInfo: null,
        dataModel3D: null,
        isEditModel: false,
        disabledSettingDianosis: false,
        isPublishVersion: null
      }
    },
    computed: {
      ...mapState({
        diagnosisCardInfo: state => state.cards.diagnosisCardInfo,
        diagnosisCardData: state => state.cards.diagnosisCardData,
        cardTypes: state => state.cardTypes.cardTypes,
        listLanguage: state => state.languages.listLanguage,
      })
    },
    async fetch() {
      await this.$store.dispatch('cardTypes/getListCardType', { locale: this.getLocaleDefault(this.listLanguage) });
      await this.$store.dispatch('cards/getInfoDiagnosisCard', { cardId: this.$route.params.slug, locale: this.getLocaleDefault(this.listLanguage) } );
      this.formDiagnosisCard = _.cloneDeep(this.diagnosisCardInfo);
      if (this.diagnosisCardInfo.cardTypeIsEndOfDiagnosis) {
        this.formDiagnosisCard.isEndOfDiagnosis = _.toString(this.diagnosisCardInfo.cardTypeIsEndOfDiagnosis);
      } else {
        this.formDiagnosisCard.isEndOfDiagnosis = _.isNull(this.formDiagnosisCard.isEndOfDiagnosis) ? IS_END_DIAGNOSIS.NOT_END_DIAGNOSIS.id : _.toString(this.diagnosisCardInfo.isEndOfDiagnosis);
      }
      this.disabledSettingDianosis = this.diagnosisCardInfo.cardTypeIsEndOfDiagnosis == IS_END_DIAGNOSIS.END_DIAGNOSIS.id;
      this.setDiagnosisCardData({ ...this.diagnosisCardInfo });
      this.isPublishVersion = this.formDiagnosisCard.publishVersion;
    },
    methods: {
      ...mapActions({
        getInfoDiagnosisCard: 'cards/getInfoDiagnosisCard',
        saveDiagnosisCard: 'cards/saveDiagnosisCard',
        duplicateCard: 'cards/duplicateCard',
        deleteCard: 'cards/deleteCard',
        getListColor: 'model3D/getListColor',
        getListCardType: 'cardTypes/getListCardType',
      }),
      ...mapMutations({
        setShowModal: 'common/setShowModal',
        setDiagnosisCardData: 'cards/setDiagnosisCardData',
        setShowPreview: 'common/setShowPreview'
      }),
      handleRemove(type, imageId = null) {
        let data = {
          ...this.diagnosisCardData
        };
        let messageDelete = '';
        switch (type) {
          case CHOOSE_DATA_TYPE.INSTRUCTIONS:
            data = {
              ...data,
              bodyKey: "",
              instructionNames: []
            }
            messageDelete = this.$t('titleFormModal.messDeleteIntruction');
            break;
          case CHOOSE_DATA_TYPE.MEDIA:
            _.remove(this.diagnosisCardData.diagnosisImages, it => it.imageId == imageId);
            data = {
              ...data,
              diagnosisImages: [...this.diagnosisCardData.diagnosisImages]
            }
            messageDelete = this.$t('titleFormModal.messDeleteMedia');
            break;
          case CHOOSE_DATA_TYPE.MODEL3D:
            data = {
              ...data,
              dispObjectMetaDatas: []
            }
            messageDelete = this.$t('titleFormModal.messDeleteModel3D');
            break;
          case CHOOSE_DATA_TYPE.BUTTONS:
            data = {
              ...data,
              choiceDesc: []
            }
            messageDelete = this.$t('titleFormModal.messDeleteButton');
            break;
          default:
            // default statements
        }
        this.$confirm({
          title: messageDelete,
          onOk: () => {
            this.setDiagnosisCardData(data);
          }
        });
      },
      handleChoose(type, imageId = null) {
        this.setShowModal(true);
        switch (type) {
          case CHOOSE_DATA_TYPE.INSTRUCTIONS:
            this.type = CHOOSE_DATA_TYPE.INSTRUCTIONS;
            this.columnData = [
              {
                title: this.$t('instructions.titleInstruction'),
                dataIndex: 'names',
                key: 'name',
                scopedSlots: { customRender: 'names' }
              },
              {
                title: '',
                key: 'action',
                scopedSlots: { customRender: 'action' },
                width: '50px'
              }
            ];
            break;
          case CHOOSE_DATA_TYPE.MEDIA:
            this.type = CHOOSE_DATA_TYPE.MEDIA;
            this.replaceInfo = imageId;
            this.columnData = [
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
                ellipsis: true,
              },
              // {
              //   title: this.$t('medias.titleCaption'),
              //   dataIndex: 'names',
              //   key: 'names',
              //   scopedSlots: { customRender: 'names' },
              //   className: 'media-row-table',
              //   width: '50%',
              //   ellipsis: true,
              // },
              {
                title: '',
                key: 'action',
                scopedSlots: { customRender: 'action' },
                width: '50px',
                className: 'media-row-table'
              },
            ];
            break;
          case CHOOSE_DATA_TYPE.BUTTONS:
            this.type = CHOOSE_DATA_TYPE.BUTTONS;
            this.columnData = [
              {
                title: this.$t('buttons.titleButton1'),
                dataIndex: 'button1',
                key: 'button1',
                scopedSlots: { customRender: 'button1' },
              },
              {
                title: this.$t('buttons.titlebutton2'),
                dataIndex: 'button2',
                key: 'button2',
                scopedSlots: { customRender: 'button2' },
              },
              {
                title: this.$t('buttons.titleButton3'),
                dataIndex: 'button3',
                key: 'button3',
                scopedSlots: { customRender: 'button3' },
              },
              {
                title: '',
                key: 'action',
                scopedSlots: { customRender: 'action' },
                width: '50px',
              }
            ];
            break;
          case CHOOSE_DATA_TYPE.MODEL3D:
            this.type = CHOOSE_DATA_TYPE.MODEL3D;
            this.isEditModel = false;
            this.columnData = [
              {
                title: this.$t('model3D.titleFileName'),
                dataIndex: 'identityName',
                key: 'identityName',
                scopedSlots: { customRender: 'identityName' },
              },
              {
                title: '',
                key: 'action',
                scopedSlots: { customRender: 'action' },
                width: '50px',
              }
            ];
            break;
          default:
            // default statements
        }
      },
      async handleSave() {
        const { isEndOfDiagnosis, cardTypeId, cardId } = this.formDiagnosisCard;
        const { choiceDesc, diagnosisImages, dispObjectMetaDatas } = this.diagnosisCardData;
        const choicesData = _.map(choiceDesc, item => {
          return {
            choiceCodeId: item.choiceCodeId,
          }
        });
        const params =  {
          cardId,
          cardTypeId,
          isEndOfDiagnosis: _.parseInt(isEndOfDiagnosis),
          bodyKey: _.toString(this.diagnosisCardData.bodyKey),
          cardImages: _.isEmpty(diagnosisImages) ? null :
            diagnosisImages.reduce((arr, currentImg, index) => {
              return [...arr, {imageId: currentImg.imageId, order: index + 1}]
            }, []),
          cardChoiceDescs: _.isEmpty(choicesData) ? null : choicesData,
          dispObjectMetaDatas: _.isEmpty(dispObjectMetaDatas) ? null : dispObjectMetaDatas.map(it => ({...it, displayModel: null})),
          savedBy: this.getUserName(this.$keycloak.token)
        };
        const resApi = await this.saveDiagnosisCard(params);
        if (resApi.status == 200) {
          this.$router.push('/cards');
        }
      },
      handleDuplicate() {
        this.$confirm({
          title: this.$t('titleFormModal.messDuplicateCard'),
          onOk: async () => {
            const resDelete = await this.duplicateCard({
              cardId: this.diagnosisCardInfo.cardId,
              savedBy: this.getUserName(this.$keycloak.token)
            });
            if (resDelete.status == 200) {
              this.$router.push('/cards');
            } else {
              this.$warning({
                title: this.$t('titleFormModal.errorDuplicate'),
              });
            }
          }
        });
      },
      showConfirmDelete() {
        this.$confirm({
          title: this.$t('titleFormModal.messDeleteCard'),
          onOk: async () => {
            const resDelete = await this.deleteCard({ cardId: this.diagnosisCardInfo.cardId });
            if (resDelete.status == 200) {
              this.$router.push('/cards');
            } else {
              this.$warning({
                title: this.$t('titleFormModal.errorDeleteCard'),
              });
            }
          }
        });
      },
      async handleEditHighlight() {
        this.setShowPreview(true);
        this.isEditModel = true;
        this.dataModel3D = this.diagnosisCardData.dispObjectMetaDatas;
        this.type = CHOOSE_DATA_TYPE.MODEL3D;
        await this.getListColor();

      },
      handleSelectCardType(value) {
        const cardType = _.filter(this.cardTypes, cardType => {
          return cardType.cardTypeId == value;
        });
        if (!_.isEmpty(cardType)) {
          this.formDiagnosisCard.isEndOfDiagnosis = cardType[0].isEndOfDiagnosis ? IS_END_DIAGNOSIS.END_DIAGNOSIS.id : IS_END_DIAGNOSIS.NOT_END_DIAGNOSIS.id;
          this.disabledSettingDianosis = cardType[0].isEndOfDiagnosis == IS_END_DIAGNOSIS.END_DIAGNOSIS.id;
        }
      }
    }
  }
</script>