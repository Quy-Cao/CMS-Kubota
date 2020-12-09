<template>
  <div class="px-2 pt-3 pb-5 bg-white box-content">
    <a-form-model v-bind="layout" ref="dataDiagnosis" :model="dataDiagnosis">
      <div class="pl-2 ml-1">
        <div class="txt-right">
          <a-button
            type="primary"
            @click="submitForm('dataDiagnosis')"
            :disabled="isSubmit || $route.query.version ? true : false"
          >{{ $t("commonText.btnSave") }}</a-button>
        </div>
        <div class="mb-4">
          <span class="font-18px txt-main mr-5">
            <b>{{ $t("diagnosisFlow.txtStatus") }}</b>
          </span>
          <a-radio-group v-model="dataDiagnosis.isDraft">
            <a-radio v-for="item in STATUS_ERROR" :value="item.id" :key="item.id" :disabled="checkDisableStatus(item.id)">
              <span v-if="item.id == STATUS_ERROR.PUBLISH.id">
                {{ $t('issues.statusPublish') }}
              </span>
              <span v-if="item.id == STATUS_ERROR.UNPUBLISH.id">
                {{ $t('issues.statusUnpublish') }}
              </span>
              <span v-if="item.id == STATUS_ERROR.DISABLE.id">
                {{ $t('issues.statusDisable') }}
              </span>
            </a-radio>
          </a-radio-group>
        </div>
        <div class="mb-4">
          <p class="font-18px txt-main">
            <b>{{ $t("instructions.titleInstruction") }}</b>
          </p>
          <a-row>
            <a-col :span="15">
              <div
                v-if="
                  diagnosisModelData != null &&
                    diagnosisModelData.instructionNames.length != 0
                "
              >
                <div class="box-preview p-4">
                  <p class="nl2br" v-html="getContentLocale(diagnosisModelData.instructionNames, getLocaleDefault(listLanguage))"></p>
                </div>
                <p class="mt-2" v-if="!dataDiagnosis.publishVersion">
                  <a class="mr-3" @click="handleChoose(CHOOSE_DATA_TYPE.INSTRUCTIONS)" ><u>{{ $t('commonText.actionReplace') }}</u></a>
                  <a class="txt-danger mr-3" @click="handleRemoveIntruction(CHOOSE_DATA_TYPE.INSTRUCTIONS)"><u>{{ $t('commonText.actionRemove') }}</u></a>
                </p>
              </div>
              <a-button @click="handleChoose(CHOOSE_DATA_TYPE.INSTRUCTIONS)" v-else :disabled="dataDiagnosis.publishVersion ? true : false">{{ $t('cards.chooseInstruction') }}</a-button>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="mb-4">
        <p class="font-18px txt-main pl-2 ml-1">
          <b>{{ $t("diagnosisFlow.txtDiagnosisFlow") }}</b>
        </p>
        <div :class="ischeckWidthScroll ? 'collapse-scroll' : ''">
          <div class="pl-2 ml-1 box-card-title">
            <div>
              <p class="txt-gray d-flex justify-space-between">
                <span class="flow-card">
                  <b>{{ $t("diagnosisFlow.txtCard") }}</b>
                </span>
                <span class="child-action">
                  <span class="mr-5 child-action-type">
                    <b>{{ $t("diagnosisFlow.txtType") }}</b>
                  </span>
                  <span>
                    <b class="pl-3">{{ $t("diagnosisFlow.txtCardId") }}</b>
                  </span>
                </span>
              </p>
            </div>
          </div>
          <hr class="hr mt-2 mb-3 hr-box-card" />
          <div v-if="diagnosisModelData != null">
            <div class="list-step">
              <p class="pl-2 ml-1" v-if="diagnosisModelData.flowStep == null">
                <a-button @click="handleChoose(CHOOSE_DATA_TYPE.CARDS)" :disabled="dataDiagnosis.publishVersion ? true : false">{{ $t('cards.chooseCard') }}</a-button>
              </p>
              <ul v-else>
                <ChildStep
                  :data-child="diagnosisModelDataFlowStep || dataDiagnosis.flowStep"
                  :activeKeys="diagnosisModelDataFlowStep ? diagnosisModelDataFlowStep.activeKeys :null"
                  :updateActivekeyAt="updateActivekeyAt"
                  :ischeckWidthScroll="ischeckWidthScroll"
                  :updateCheckWidth="updateCheckWidth"
                  :key="JSON.stringify(diagnosisModelData.flowStep)"
                ></ChildStep>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </a-form-model>
    <ModalChoose :type="type" :columnData="columnData"></ModalChoose>
    <ModalPreview :type="type" :isModel="true"></ModalPreview>
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from "vuex";
import ModalChoose from "~/components/modal-choose";
import ModalPreview from "~/components/modal-preview";
import ChildStep from "~/components/models/childStep";
import {
  CHOOSE_DATA_TYPE,
  STATUS_ERROR,
  TYPE_MODELS,
  USER_ROLES,
} from "~/plugins/constant";

export default {
  components: {
    ModalChoose,
    ModalPreview,
    ChildStep,
  },
  props: ["typeModel"],
  data() {
    return {
      CHOOSE_DATA_TYPE,
      STATUS_ERROR,
      TYPE_MODELS,
      type: null,
      isShowModal: false,
      columnData: [],
      layout: {
        labelCol: { span: 2 },
        wrapperCol: { span: 14 },
      },
      dataDiagnosis: null,
      diagnosisModelDataFlowStep: null,
      isSubmit: false,
      USER_ROLES,
      ischeckWidthScroll: false
    };
  },
  computed: {
    ...mapState({
      errorCodeDiagnosis: (state) => state.errorCodes.errorCodeDiagnosis,
      issueDiagnosis: (state) => state.issues.issueDiagnosis,
      diagnosisModelData: (state) => state.models.diagnosisModelData,
      listLanguage: (state) => state.languages.listLanguage,
    }),
  },
  watch: {
    "diagnosisModelData.flowStep": function (val) {
      if (val) {
        if (!this.diagnosisModelDataFlowStep) {
          this.diagnosisModelDataFlowStep = _.cloneDeep(val);
          return;
        }
        let _originData = _.cloneDeep(this.diagnosisModelDataFlowStep);
        this.diagnosisModelDataFlowStep = _.cloneDeep(val);
        let self = this;

        revertActiveKey(this.diagnosisModelDataFlowStep, _originData);

        function revertActiveKey(data, originData) {
          self.updateFlowStepActiveKeysByKeyRecursion(data,originData.keyStep, originData.activeKeys);
          if(originData.flowStepChilds && data.flowStepChilds && originData.flowStepChilds.length > 0 && data.flowStepChilds.length > 0 ){
            originData.flowStepChilds.forEach((it, index) => {
              revertActiveKey(data.flowStepChilds[index], it)
            })
          }
        }
      }
    },
  },
  created() {
    this.dataDiagnosis =
      this.typeModel == TYPE_MODELS.ERRORCODES
        ? _.cloneDeep(this.errorCodeDiagnosis)
        : _.cloneDeep(this.issueDiagnosis);

    let newDiagnosisModelData = this.typeModel == TYPE_MODELS.ERRORCODES
        ? _.cloneDeep(this.errorCodeDiagnosis)
        : _.cloneDeep(this.issueDiagnosis);

    generateKeyAndActiveKey(newDiagnosisModelData.flowStep)

    function generateKeyAndActiveKey(data){
      if(data) {
        data.activeKeys = [];
        data.keyStep = `${Date.now()}${parseInt((1000 * Math.random()) / 1)}`;
        data.flowStepChilds.forEach(it => {
          generateKeyAndActiveKey(it);
        })
      } else {
        return data;
      }
    }

    this.setDiagnosisModelData(newDiagnosisModelData);
    this.$nuxt.$on("handle", (type) => {
      this.handleChoose(type);
    });
  },
  methods: {
    ...mapMutations({
      setShowModal: "common/setShowModal",
      setDiagnosisModelData: "models/setDiagnosisModelData",
    }),
    ...mapActions({
      getListCardType: "cardTypes/getListCardType",
      updateErrorDiagnosisFlow: "errorCodes/updateErrorDiagnosisFlow",
      updateIssueDiagnosisFlow: "issues/updateIssueDiagnosisFlow",
      changeErrorStatus: 'errorCodes/changeErrorStatus',
      changeIssueStatus: 'issues/changeIssueStatus'
    }),
    updateActivekeyAt(keyStep, activeKey) {
      this.updateFlowStepActiveKeysByKeyRecursion(this.diagnosisModelDataFlowStep, keyStep,activeKey);
    },
    updateCheckWidth(ischeckWidthScroll) {
      this.ischeckWidthScroll = ischeckWidthScroll;
    },
    updateFlowStepActiveKeysByKeyRecursion (data, key, activeKey) {
      if (_.isArray(data)) {
        data.forEach((_data) => {
          this.updateFlowStepActiveKeysByKeyRecursion(_data,key,activeKey);
        });
      } else {
        if (data.keyStep == key) {
          data.activeKeys = [...activeKey];
          return;
        } else {
          if (data.flowStepChilds && data.flowStepChilds.length != 0) {
              this.updateFlowStepActiveKeysByKeyRecursion(data.flowStepChilds,key,activeKey);
          }
        }
      }
    },
    handleChoose(type) {
      this.setShowModal(true);
      switch (type) {
        case CHOOSE_DATA_TYPE.INSTRUCTIONS:
          this.type = CHOOSE_DATA_TYPE.INSTRUCTIONS;
          this.columnData = [
            {
              title: this.$t("instructions.titleInstruction"),
              dataIndex: "names",
              key: "name",
              scopedSlots: { customRender: "names" },
            },
            {
              title: "",
              key: "action",
              scopedSlots: { customRender: "action" },
              width: "50px",
            },
          ];
          break;
        case CHOOSE_DATA_TYPE.CARDS:
          this.type = CHOOSE_DATA_TYPE.CARDS;
          this.getListCardType();
          this.columnData = [
            {
              title: this.$t("cards.titleCardId"),
              dataIndex: "cardId",
              key: "cardId",
              scopedSlots: { customRender: "cardId" },
              width: "100px",
            },
            {
              title: this.$t("cards.titleCard"),
              dataIndex: "name",
              key: "name",
              scopedSlots: { customRender: "name" },
            },
            {
              title: this.$t("cards.titleType"),
              dataIndex: "cardTypeName",
              key: "cardTypeName",
              scopedSlots: { customRender: "cardTypeName" },
            },
            {
              title: "",
              key: "action",
              scopedSlots: { customRender: "action" },
              width: "50px",
            },
          ];
          break;
        default:
        // default statements
      }
    },
    handleRemoveIntruction(type) {
      let data = {
        ...this.diagnosisModelData,
        causesKey: "",
        instructionNames: [],
      };
      this.$confirm({
        title: this.$t("titleFormModal.messDeleteIntruction"),
        onOk: () => {
          this.setDiagnosisModelData(data);
        },
      });
    },
    async submitForm(formName) {
      this.isSubmit = true;
      const { errorCodeId, causesKey } = this.diagnosisModelData;
      let data = {
        errorCodeId,
        isDraft: this.dataDiagnosis.isDraft,
        causesKey,
        savedBy: this.getUserName(this.$keycloak.token),
        isStartDiagnosis: 1 // todo change
      }
      if (this.typeModel == TYPE_MODELS.ISSUES) {
        data = {
          ...data,
          iCategoryId: this.diagnosisModelData.iCategoryId
        }
      }
      const dataStepFormat = this.formatDataStep(this.diagnosisModelData.flowStep);
      data = {
        ...data,
        flowStep: dataStepFormat
      };
      let res = null;
      if (this.dataDiagnosis.publishVersion) {
        const params = {
          isDraft: data.isDraft,
          savedBy: this.getUserName(this.$keycloak.token)
        };
        res = this.typeModel == TYPE_MODELS.ERRORCODES ? await this.changeErrorStatus({ ...params, errorCodeIds: [errorCodeId]}) : await this.changeIssueStatus({...params, iCategoryIds: [this.diagnosisModelData.iCategoryId]});
      } else {
        res = this.typeModel == TYPE_MODELS.ERRORCODES ? await this.updateErrorDiagnosisFlow(data) : await this.updateIssueDiagnosisFlow(data);
      }
      if (!_.isNull(res) && res.status == 200) {
        this.typeModel == TYPE_MODELS.ERRORCODES ?
          this.$router.push(`/errorCodes?modelId=${this.dataDiagnosis.modelId}`) :
          this.$router.push(`/issues?modelId=${this.dataDiagnosis.modelId}`);
      } else {
        this.$warning({
          title: 'Can not update this diagnosis!',
        });
        this.isSubmit = false;
      }
    },
    checkDisableStatus(item) {
      if (this.dataDiagnosis.publishVersion) {
        if ( this.typeModel == TYPE_MODELS.ERRORCODES ? this.errorCodeDiagnosis.isDraft == STATUS_ERROR.UNPUBLISH.id : this.issueDiagnosis.isDraft == STATUS_ERROR.UNPUBLISH.id) {
          return false;
        }
        if (( this.typeModel == TYPE_MODELS.ERRORCODES ? this.errorCodeDiagnosis.isDraft == STATUS_ERROR.PUBLISH.id : this.issueDiagnosis.isDraft == STATUS_ERROR.PUBLISH.id) && item == STATUS_ERROR.UNPUBLISH.id) {
          return true;
        }
        if (( this.typeModel == TYPE_MODELS.ERRORCODES ? this.errorCodeDiagnosis.isDraft == STATUS_ERROR.DISABLE.id : this.issueDiagnosis.isDraft == STATUS_ERROR.DISABLE.id) && item == STATUS_ERROR.UNPUBLISH.id) {
          return true;
        }
        return false;
      }
      return false;
    }
  },
};
</script>
