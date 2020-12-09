<template>
  <li :class="dataChild.parentId == null ? '' : 'pl-4'" v-if="dataChild">
    <div v-if="dataChild.flowStepChilds && dataChild.flowStepChilds.length > 0" class="pl-2"  >
      <div :class="ischeckWidthScroll ? 'collapse-width' : ''">
        <div class="d-flex justify-space-between" >
          <p class="txt-main d-flex align-item-baseline font-16px flow-card" :class="dataChild.choiceDesc.length > 0 ? '' : 'mb-0'">
            <b class="nl2br">{{ getContentLocale(dataChild.cardNames, getLocaleDefault(listLanguage)) }} </b>
          </p>

          <div class="child-action d-flex justify-space-between pr-3">
            <div>
              <span class="mr-2 child-action-type">{{ getContentLocale(dataChild.cardTypeNames, getLocaleDefault(listLanguage)) }}</span>
            </div>
            <div>
              <span class="mr-2">{{ dataChild.cardId }}</span>
            </div>
            <div style="width: 125px">
              <template v-if="!diagnosisModelData.publishVersion">
                <a class="mr-3"  @click="handleChoose(CHOOSE_DATA_TYPE.CARDS, dataChild.stepId, dataChild.choiceOrder, true)"><u>Replace</u></a>
                <a class="txt-danger" @click="handleRemove(dataChild.stepId, dataChild.parentId, dataChild.cardId)"><u>Remove</u></a>
              </template>
            </div>
          </div>
        </div>
        <div>
          <a-button @click="handleShowMedia" v-if="!isShowMedia && (dataChild.diagnosisImages.length > 0 || (dataChild.dispObjectMetaDatas ? dataChild.dispObjectMetaDatas.length > 0 : dataChild.displayModelName == ''))" class="mb-2">
            {{ $t('diagnosisFlow.txtShowMedia') }}
          </a-button>
          <a-button @click="handleSHideMedia" v-if="isShowMedia" class="mb-2">{{ $t('diagnosisFlow.txtHideMedia') }}</a-button>
          <transition name="height-transition">
            <div v-if="isShowMedia" class="mt-1" style="overflow: hidden">
              <div class="box-preview p-4" >
                <div class="d-flex flex-column" :class="(dataChild.diagnosisImages.length > 0 && (dataChild.dispObjectMetaDatas ? dataChild.dispObjectMetaDatas.length > 0 : dataChild.displayModelName !== null)) ? 'mb-3' : ''">
                  <div class="mb-2" v-if="dataChild.diagnosisImages.length > 0">
                    <b class="font-16px">{{ $t('medias.titlePage') }}</b>
                  </div>
                  <div class="d-flex" style="flex-wrap: wrap;">
                    <div v-for="media in dataChild.diagnosisImages" :key="media.imageId" class="d-flex flex-column mr-4" >
                      <span class="txt-main mb-1">{{ media.fileName }}</span>
                      <img v-if="media.type === TYPE_MEDIA.IMAGES" :src="media.path" alt="" class="uri-file">
                      <video v-else :src="media.path" controls class="uri-file"></video>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="dataChild.dispObjectMetaDatas && dataChild.dispObjectMetaDatas.length > 0">
                <div class="d-flex flex-column">
                  <div class="mb-2">
                    <b class="font-16px">{{ $t('cards.ar3D') }}</b>
                  </div>
                  <span>{{ dataChild.dispObjectMetaDatas[0].displayModel.identityName }}</span>
                </div>
              </div>
              <div class="d-flex flex-column" v-if="dataChild.displayModelName">
                <div class="mb-2" >
                  <b class="font-16px">{{ $t('cards.ar3D') }}</b>
                </div>
                <span>{{ dataChild.displayModelName }}</span>
              </div>
            </div>
          </transition>
        </div>
        <div :class="(dataChild.diagnosisImages.length > 0) ? 'pt-2' : ''">
          <a-collapse  v-model="activeKey" :id="dataChild.keyStep">
            <template #expandIcon="props">
              <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
            </template>
            <a-collapse-panel v-for="(child, index) in flowStepChilds" :key="child.keyStep" :header="getContentLocale(child.names, getLocaleDefault(listLanguage))">
              <div v-if="child.stepChild">
                <ChildStep 
                  :data-child="child.stepChild" 
                  :activeKeys="child.stepChild.activeKeys"
                  :updateActivekeyAt="updateActivekeyAt"
                  :updateCheckWidth="updateCheckWidth"
                  :key="JSON.stringify(child.stepChild.cardId) + index">
                </ChildStep>
              </div>
              <div v-else class="pl-3">
                <a-button @click="handleChoose(CHOOSE_DATA_TYPE.CARDS, dataChild.stepId, child.choiceOrder, false)" :disabled="diagnosisModelData.publishVersion ? true : false">{{ $t('cards.chooseCard') }}</a-button>
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </div>
    </div>
    <div v-else class="pl-2">
      <div class="d-flex justify-space-between">
        <p class="txt-main d-flex align-item-baseline font-16px flow-card" :class="dataChild.choiceDesc.length > 0 ? '' : 'mb-0'">
          <b class="nl2br">{{ getContentLocale(dataChild.cardNames, getLocaleDefault(listLanguage)) }} </b>
        </p>
        
        <div class="child-action d-flex justify-space-between pr-3">
          <div>
            <span class="mr-2 child-action-type">{{ getContentLocale(dataChild.cardTypeNames, getLocaleDefault(listLanguage)) }}</span>
          </div>
          <div>
            <span class="mr-2 ">{{ dataChild.cardId }}</span>
          </div>
          <div style="width: 125px">
            <template v-if="!diagnosisModelData.publishVersion">
              <a class="mr-3" @click="handleChoose(CHOOSE_DATA_TYPE.CARDS, dataChild.stepId, null, true)"><u>Replace</u></a>
              <a class="txt-danger" @click="handleRemove(dataChild.stepId, dataChild.parentId, dataChild.cardId)"><u>Remove</u></a>
            </template>
          </div>
        </div>
      </div>
      <div>
        <a-button @click="handleShowMedia" v-if="!isShowMedia && (dataChild.diagnosisImages.length > 0 || (dataChild.dispObjectMetaDatas ? dataChild.dispObjectMetaDatas.length > 0 : dataChild.displayModelName == ''))" class="mb-2">
          {{ $t('diagnosisFlow.txtShowMedia') }}
        </a-button>
        <a-button @click="handleSHideMedia" v-if="isShowMedia" class="mb-2">{{ $t('diagnosisFlow.txtHideMedia') }}</a-button>
        <transition name="height-transition">
          <div v-if="isShowMedia" class="mt-1" style="overflow: hidden">
            <div class="box-preview p-4" >
              <div class="d-flex flex-column" :class="(dataChild.diagnosisImages.length > 0 && (dataChild.dispObjectMetaDatas ? dataChild.dispObjectMetaDatas.length > 0 : dataChild.displayModelName != null)) ? 'mb-3' : ''">
                <div class="mb-2" v-if="dataChild.diagnosisImages.length > 0">
                  <b class="font-16px">{{ $t('medias.titlePage') }}</b>
                </div>
                <div class="d-flex" style="flex-wrap: wrap;">
                  <div v-for="media in dataChild.diagnosisImages" :key="media.imageId" class="d-flex flex-column mr-4" >
                    <span class="txt-main mb-1">{{ media.fileName }}</span>
                    <img v-if="media.type === TYPE_MEDIA.IMAGES" :src="media.path" alt="" class="uri-file">
                    <video v-else :src="media.path" controls class="uri-file"></video>
                  </div>
                </div>
              </div>
              <div v-if="dataChild.dispObjectMetaDatas && dataChild.dispObjectMetaDatas.length > 0">
                <div class="d-flex flex-column">
                  <div class="mb-2">
                    <b class="font-16px">{{ $t('cards.ar3D') }}</b>
                  </div>
                  <span>{{ dataChild.dispObjectMetaDatas[0].displayModel.identityName }}</span>
                </div>
              </div>
              <div class="d-flex flex-column" v-if="dataChild.displayModelName">
                <div class="mb-2" >
                  <b class="font-16px">{{ $t('cards.ar3D') }}</b>
                </div>
                <span>{{ dataChild.displayModelName }}</span>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div :class="(dataChild.diagnosisImages.length > 0) ? 'pt-2' : ''">
        <a-collapse  v-if="dataChild.choiceDesc.length > 0" v-model="activeKey" :id="dataChild.keyStep">
          <template #expandIcon="props">
            <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
          </template>
          <a-collapse-panel v-for="(button) in dataChild.choiceDesc" :key="button.keyStep" :header="getContentLocale(button.names, getLocaleDefault(listLanguage))">
            <div class="pl-3">
              <a-button @click="handleChoose(CHOOSE_DATA_TYPE.CARDS, dataChild.stepId, button.choiceOrder, false)" :disabled="diagnosisModelData.publishVersion ? true : false">{{ $t('cards.chooseCard') }}</a-button>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>
    <a-modal v-model="visible" @cancel="handleCancel" title="" width="80%" :footer="null" :dialogStyle="{animationDuration: visible ? '0.4s' : '', display: visible ? '' : 'none'}">
      <div class="px-5 pt-2 pb-4 mx-5">
        <p class="font-18px m-0 txt-center">
          <b>{{ $t('titleFormModal.messRemoveCard') }}</b>
        </p>
        <p class="font-12px txt-center mb-3">{{ $t('titleFormModal.noteRemoveCard') }}</p>
        <div v-if="diagnosisCardInfo != null" class="box-preview p-4">
          <a-row class="mb-3 d-flex align-item-center">
            <a-col :span="3">
              <span>{{ $t('diagnosisFlow.txtTitle') }}</span>
            </a-col>
            <a-col :span="20">
              <p class="font-24px txt-main mb-0 nl2br"><b>{{ getContentLocale(diagnosisCardInfo.cardNames, getLocaleDefault(listLanguage)) }}</b></p>
            </a-col>
          </a-row>
          <a-row class="mb-3">
            <a-col :span="3">
              <span>{{ $t('cards.titleCardId') }}</span>
            </a-col>
            <a-col :span="20">
              <span class="font-16px txt-main"><b>{{ diagnosisCardInfo.cardId }}</b></span>
            </a-col>
          </a-row>
          <a-row class="mb-3">
            <a-col :span="3">
              <span>{{ $t('cards.lableCardType') }}</span>
            </a-col>
            <a-col :span="20">
              <span class="font-16px txt-main"><b>{{ getContentLocale(diagnosisCardInfo.cardTypeNames, getLocaleDefault(listLanguage)) }}</b></span>
            </a-col>
          </a-row>
          <a-row class="mb-3">
            <a-col :span="3">
              <span>{{ $t('instructions.titlePage') }}</span>
            </a-col>
            <a-col :span="20">
              <span v-if="!diagnosisCardInfo.instructionNames.length" >-</span>
              <p v-else v-html="getContentLocale(diagnosisCardInfo.instructionNames, getLocaleDefault(listLanguage))" class="font-weight-bold font-16px txt-main nl2br"></p>
            </a-col>
          </a-row>
          <a-row class="mb-3">
            <a-col :span="3">
              <span>{{ $t('medias.titlePage') }}</span>
            </a-col>
            <a-col :span="20">
              <div v-if="diagnosisCardInfo.diagnosisImages.length != 0 && diagnosisCardInfo.diagnosisImages[0]">
                <div v-if="diagnosisCardInfo.diagnosisImages[0].type == TYPE_MEDIA.IMAGES"><img :src="diagnosisCardInfo.diagnosisImages[0].path" alt="" class="uri-file"></div>
                <div v-else><video :src="diagnosisCardInfo.diagnosisImages[0].path" controls class="uri-file"></video></div>
              </div>
              <span v-else>-</span>
            </a-col>
          </a-row>
          <a-row v-for="(button, index) in diagnosisCardInfo.choiceDesc" :key="button.choiceCodeId" class="mb-3">
              <a-col :span="3">
                {{ $t('buttons.txtButton') }} {{ index + 1}}
              </a-col>
              <a-col :span="20">
                <span class="font-16px txt-main"><b>{{ getContentLocale(button.names, getLocaleDefault(listLanguage)) }}</b></span>
              </a-col>
          </a-row>
        </div>
        <p class="txt-center mt-3">
          <a-button type="primary" @click="removeCard" class="mr-2">{{ $t('commonText.actionRemove') }}</a-button>
          <a-button @click="handleCancel" >{{ $t('commonText.txtCancel') }}</a-button>
        </p>
      </div>
    </a-modal>
  </li>
</template>
<script>
  import { mapActions, mapState, mapMutations } from "vuex";
  import { CHOOSE_DATA_TYPE, TYPE_MEDIA } from "~/plugins/constant";
  export default {
    name: "ChildStep",
    props: ['dataChild', 'activeKeys', 'updateActivekeyAt', 'ischeckWidthScroll','updateCheckWidth'],
    data() {
      return {
        CHOOSE_DATA_TYPE,
        TYPE_MEDIA,
        cardInfor: null,
        visible: false,
        dataRemove: null,
        isShowMedia: false,
        isWidthScroll: false
      }
    },
    computed: {
      ...mapState({
        diagnosisModelData: state => state.models.diagnosisModelData,
        listLanguage: state => state.languages.listLanguage,
        diagnosisCardInfo: state => state.cards.diagnosisCardInfo,
        featureStepId: state => state.models.featureStepId
      }),
      flowStepChilds() {
        if(!this.dataChild.flowStepChilds) {
          return this.dataChild.choiceDesc
        }
        const stepChildren = _.clone(this.dataChild.flowStepChilds)
        return this.dataChild.choiceDesc && this.dataChild.choiceDesc.map(desc => {
          const stepChild = stepChildren.find(child => child.choiceOrder === desc.choiceOrder) || null;
          return {
            ...desc,
            stepChild
          }
        })
      },
      key() {
        return JSON.stringify(this.dataChild)
      },
      activeKey: {
        get(){
          return this.activeKeys
        },
        set(val){
          this.updateActivekeyAt(this.dataChild.keyStep, val)
        }
      }
    }, 
    updated() {
      let idCheckWidth = document.getElementById(this.dataChild.keyStep);
      if(idCheckWidth && idCheckWidth.offsetWidth < 800) {
        this.isWidthScroll = true;
      }
      if(!this.isWidthScroll) return;
      this.updateCheckWidth(this.isWidthScroll);
    },
    methods: {
      ...mapMutations({
        setShowModal: 'common/setShowModal',
        setStepId: 'models/setStepId',
        setChoiceOder: 'models/setChoiceOder',
        setDiagnosisModelData: 'models/setDiagnosisModelData',
        setFeatureStepId: 'models/setFeatureStepId',
        setIsReplace: 'models/setIsReplace'
      }),
      ...mapActions({
        getInfoDiagnosisCard: 'cards/getInfoDiagnosisCard'
      }),
      findStepOfButton(buttonId, steps) {
        const index = _.findIndex(steps, step => {
          if (!_.isNull(step)) {
            return step.choiceOrder == buttonId;
          }
        })
        const dataStep = index != -1 ? steps[index] : null;
        return dataStep;
      },
      handleChoose(type, stepId, choiceOder, isReplace) {
        this.setStepId(!_.isNil(stepId) ? stepId : 1);
        this.setFeatureStepId(this.featureStepId + 1);
        this.setChoiceOder(choiceOder);
        this.setIsReplace(isReplace);
        this.$nuxt.$emit('handle', type);
      },
      async handleRemove(stepId, parentId, cardId) {
        await this.getInfoDiagnosisCard({ cardId, locale: this.getLocaleDefault(this.listLanguage)});
        this.visible = true;
        this.dataRemove = {
          stepId,
          parentId
        };
      },
      removeCard() {
        let data = _.cloneDeep(this.diagnosisModelData);
        if (_.isNull(this.dataRemove.parentId)) {
          data = {
            ...data,
            flowStep: null
          }
          this.setDiagnosisModelData(data);
        } else {
          const parentIndex = this.findChildStepPath(data.flowStep, this.dataRemove.parentId);
          if (parentIndex) {
            const parent = _.get(data, parentIndex);
            parent.flowStepChilds = parent.flowStepChilds.filter(child => child.stepId !== this.dataRemove.stepId)
            this.setDiagnosisModelData(_.set(data, parentIndex, parent));
          }
        }
      },
      handleCancel() {
        this.visible = false;
      },
      handleShowMedia() {
        this.isShowMedia = true;
      },
      handleSHideMedia() {
        this.isShowMedia = false;
      }
    }
  };
</script>