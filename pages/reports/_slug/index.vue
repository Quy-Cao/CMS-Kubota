<template>
  <div class="container">
    <a-row type="flex" align="middle">
      <a-col :span="12"  class="background-title-page">
        <h1 class="font-28px m-0 txt-main">
          <strong>{{ $t('reportDetail.titleDetailPage') + ` ${reportDetail.diagnosisSessionId}` }}</strong>
        </h1>
        <a-breadcrumb>
          <span slot="separator" class="ic-breadcrumb"><img src="../../../assets/images/line.svg"></span>
          <a-breadcrumb-item>
            <nuxt-link to="/reports">
              <u>{{ $t('reportDetail.titlePage') }}</u>
            </nuxt-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            {{ $t('reportDetail.titleDetailPage') + ` ${reportDetail.diagnosisSessionId}` }}
          </a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
      <a-col :span="12">
        <p class="export-detail m-0 d-flex align-item-center">
          <a @click="copyUrl"><span class="mr-2"><u>{{ $t('reportDetail.copyUrl') }}</u></span></a>
          <a-button type="primary" @click="exportReportDetail">
            <span class="font-weight-bold">
              {{ $t('reportDetail.btnExport')}}
            </span>
          </a-button>
        </p>
      </a-col>
    </a-row>
    <div class="pl-2 py-4 bg-white box-content">
      <div class="txt-main font-weight-bold">
        <a-row class="mb-3">
          <a-col :span="4" class="pl-2">
            <div><span class="font-12px txt-gray">{{ $t('reportDetail.startDate') }}</span></div>
            <div><span class="font-16px" v-if="reportDetail.occurence">{{ formatDate(reportDetail.occurence) }}</span></div>
          </a-col>
          <a-col :span="4" class="pl-2">
            <div><span class="font-12px txt-gray">{{ $t('reportDetail.model') }}</span></div>
            <div><span class="font-16px" v-if="reportDetail.modelName">{{ reportDetail.modelName }}</span></div>
          </a-col>
          <a-col :span="4" class="pl-2">
            <div><span class="font-12px txt-gray">{{ $t('reportDetail.serial') }}</span></div>
            <div><span class="font-16px" v-if="reportDetail.serialNo">{{ reportDetail.serialNo }}</span></div>
          </a-col>
          <a-col :span="4" class="pl-2">
            <div><span class="font-12px txt-gray">{{ $t('reportDetail.dealer') }}</span></div>
            <div><span class="font-16px" v-if="reportDetail.dealerId">{{ reportDetail.dealerId }}</span></div>
          </a-col>
        </a-row>
        <a-row class="mb-3">
          <a-col :span="4" class="pl-2">
            <div><span class="font-12px txt-gray">{{ $t('reportDetail.version') }}</span></div>
            <div><span class="font-16px" v-if="reportDetail.version">{{ reportDetail.version }}</span></div>
          </a-col>
          <a-col :span="4" class="pl-2">
            <div><span class="font-12px txt-gray">{{ $t('reportDetail.hoursOfOperation') }}</span></div>
            <div><span class="font-16px" v-if="reportDetail.hoursOfOperation">{{ `${reportDetail.hoursOfOperation} ${$t('reportDetail.hours')}` }}</span></div>
          </a-col>
          <a-col :span="4" class="pl-2">
            <div><span class="font-12px txt-gray">{{ $t('reportDetail.status') }}</span></div>
            <div><span class="font-16px" v-if="reportDetail">{{ REPORT_STATUSES[reportDetail.status] }}</span></div>
          </a-col>
          <a-col :span="4" class="pl-2">
            <div><span class="font-12px txt-gray">{{ $t('reportDetail.technicians') }}</span></div>
            <div><span class="font-16px" v-if="reportDetail.userId">{{ reportDetail.userId }}</span></div>
          </a-col>
        </a-row>
        <a-row class="mb-3">
          <a-col :span="4" class="pl-2">
            <div><span class="font-12px txt-gray">{{ $t('reportDetail.errorCode') }}</span></div>
            <div><span class="font-16px" v-if="reportDetail.errorCode">{{ reportDetail.errorCode }}</span></div>
          </a-col>
          <a-col :span="4" class="pl-2">
            <div><span class="font-12px txt-gray">{{ $t('reportDetail.errorName') }}</span></div>
            <div>
              <span class="font-16px" v-if="reportDetail.errorName">{{ reportDetail.errorName }}</span>
              <span class="font-16px" v-if="reportDetail.issueName">{{ reportDetail.issueName }}</span>
            </div>
          </a-col>
          <a-col :span="4" class="pl-2">
            <div><span class="font-12px txt-gray">{{ $t('reportDetail.gps') }}</span></div>
            <div><span class="font-16px" v-if="reportDetail.gpsInfo">{{ reportDetail.gpsInfo }}</span></div>
          </a-col>
          <a-col :span="4" class="pl-2">
            <div><span class="font-12px txt-gray">{{ $t('reportDetail.feedback') }}</span></div>
            <div v-if="reportDetail.feedback">
              <a href="#feedback" @click="viewFeedback">
                <span class="mr-1">
                  <img v-if="reportDetail.feedback.isLike" src="../../../assets/images/thumb-up.svg" alt="thumb-up">
                  <img v-else-if="reportDetail.feedback.isLike == 0" src="../../../assets/images/thumb-down.svg" alt="thumb-down">
                </span>
                <span>
                  <u>{{ $t('reportDetail.viewDetail') }}</u>
                </span>
              </a>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="mt-4">
        <div class="pl-2">
          <a-tabs type="editable-card" v-model="activeKey" @tabClick="handleChange" @edit="onEdit">
            <a-tab-pane v-for="(branch, index) in branches" :tab="branch ? `Branch ${index}` : 'Original branch'" :closable="isClosable(branch) ? true : false" :key="branch ? branch : 0">
            </a-tab-pane>
          </a-tabs>
          <div :key="timelineUpdate">
            <time-line v-if="stepsOfBranch.length" :initData="stepsOfBranch" :feedback="feedback" :newBranchIndex="getMaxBranchIndex() ? getMaxBranchIndex() + 1 : 1" :currentBranchIndex="activeKey"></time-line>
          </div>
        </div>
      </div>
    </div>
    <input type="text" id="copy-url">
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import { REPORT_STATUSES, BRANCH_ACTIONS } from '../../../plugins/constant';
import TimeLine from '~/components/reports/timeLine';
import exportExcel from '~/plugins/vue-json-excel';

export default {
  components: {
    TimeLine
  },
  data() {
    return {
      REPORT_STATUSES,
      stepsOfBranch: [],
      feedback: null,
      branches: [],
      activeKey: 0,
      timelineUpdate: 0,
      firstLoad: true,
      dataExports: [],
      json_meta: [
        [
          {
              'key': 'charset',
              'value': 'utf-8'
          }
        ]
      ],
      nameFileExport: ''
    }
  },
  async created() {
    let locale = this.getLocaleDefault(this.listLanuage);
    await this.getListProblems({
      locale: locale
    });
    await this.getReportDetail({
      id: this.$route.params.slug,
      locale: locale
    });
    await this.getListSteps({
      locale: locale,
      stepId: this.reportDetail.errorStepId ? this.reportDetail.errorStepId : this.reportDetail.issueStepId
    });
    if(this.firstLoad) {
      this.getListBranches();
      this.getStepData(this.activeKey);
    }
    this.firstLoad = false;
  },
  computed: {
    ...mapState({
      listLanuage: state => state.languages.listLanguage,
      reportDetail: state => state.reports.reportDetail,
      listSteps: state => state.reports.listSteps,
      actionType: state => state.reports.actionType,
      listProblems: state => state.reports.listProblems,
      listLanguage: state => state.languages.listLanguage
    })
  },
  watch: {
    reportDetail: {
      handler() {
        if(!this.firstLoad) {
          this.getListBranches();
          if(this.actionType !== BRANCH_ACTIONS.SAVE) {
            let branchIndex = this.getMaxBranchIndex();
            this.activeKey = branchIndex ? branchIndex : 0;
          }
          this.getStepData(this.activeKey);
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      getReportDetail: 'reports/getReportDetail',
      getListProblems: 'reports/getListProblems',
      deleteBranch: 'reports/deleteBranch',
      getListSteps: 'reports/getListSteps',
      changeActionType: 'reports/changeActionType',
      displayConfirmation: 'reports/displayConfirmation',
      getListProblems: 'reports/getListProblems'
    }),
    onEdit(key, action) {
      this[action](key);
    },
    getListBranches() {
      this.branches = [...new Set(this.reportDetail.diagnosisSteps.map(step => step.branchIndex))];
    },
    getStepData(branchIndex) {
      this.stepsOfBranch = [];
      this.feedback = null;
      if(!branchIndex) this.getOriginalSteps();
      else this.getBranchData(branchIndex);
      this.timelineUpdate -= 1;
    },
    getOriginalSteps() {
      let steps = this.reportDetail.diagnosisSteps;
      this.stepsOfBranch = steps.filter(step => step.branchIndex == null);
      this.feedback = this.reportDetail.feedback ? this.reportDetail.feedback : null;
    },
    getBranchData(branchIndex) {
      let step;
      let parentBranchIndex = null;
      let branchSteps = _.filter(this.reportDetail.diagnosisSteps, step => step.branchIndex == branchIndex);
      let i = 0;
      parentBranchIndex = branchSteps[0].parentBranchIndex == 0 ? null : branchSteps[0].parentBranchIndex;
      do {
        let parentBranchSteps = _.filter(this.reportDetail.diagnosisSteps, step => {
          return step.branchIndex == parentBranchIndex;
        });
        parentBranchIndex = parentBranchSteps[0].parentBranchIndex;
        if(parentBranchIndex === null) i++;
        let checkoutStepIndex = _.findIndex(parentBranchSteps, { flowStepId: branchSteps[0].flowStepId });

        if(checkoutStepIndex > -1) {
          parentBranchSteps = parentBranchSteps.slice(0, checkoutStepIndex);
        }
        if(parentBranchSteps.length) branchSteps.unshift(...parentBranchSteps);
      } while (i <= 2);
      let choice = _.find(branchSteps[branchSteps.length - 1].choiceDescs, {
        choiceCodeId: branchSteps[branchSteps.length - 1].choiceCodeId
      });
      let nextStep = _.find(this.listSteps, {
        parentId: branchSteps[branchSteps.length - 1].flowStepId,
        choiceOrder: choice ? choice.choiceOrder : null
      });
      if(nextStep) branchSteps.push({
        ...nextStep,
      });
      this.stepsOfBranch = branchSteps;
    },
    formatDate(date) {
      return this.moment(date).format('LL');
    },
    copyUrl() {
      let url = document.getElementById('copy-url');
      url.setAttribute('value', window.location.href);
      url.select();
      let res = document.execCommand('copy');
      if(res) this.$message.success(this.$t('reportDetail.copySuccess'));
      else this.$message.error(this.$t('reportDetail.copyError'));
    },
    handleChange(activeKey) {
      this.getStepData(activeKey);
    },
    getMaxBranchIndex() {
      return _.max(this.branches);
    },
    isClosable(branchIndex) {
      let child = _.find(this.reportDetail.diagnosisSteps, { parentBranchIndex: branchIndex });
      return child || branchIndex === null ? false : true;
    },
    async remove(branchIndex) {
      this.$confirm({
        title: this.$t('reportDetail.deleteConfirm'),
        onOk: async () => {
          let resDelete = await this.deleteBranch({
            diagnosisSessionId: this.reportDetail.diagnosisSessionId,
            branchIndex: branchIndex
            });
          if (resDelete.status == 200) {
            this.displayConfirmation(false);
            this.changeActionType(BRANCH_ACTIONS.DELETE);
            this.getReportDetail({
              id: this.$route.params.slug,
              locale: this.getLocaleDefault(this.listLanuage)
            });
          } else {
            this.$warning({
              title: this.$t('reportDetail.deleteFail'),
            });
          }
        },
      });
    },
    generateMedia(length) {
      let tempObj = {}
      for (let index = 0; index < length; index++) {
        tempObj[`Media${index+1}`] = '';
      }
      return tempObj;
    },
    viewFeedback(){
      if(this.activeKey) {
        this.activeKey = 0;
        this.getStepData(this.activeKey);
      }
    },
    async exportReportDetail() {
      await this.getListProblems({locale: this.getLocaleDefault(this.listLanguage)});
      this.nameFileExport = `${this.reportDetail.modelName}_${this.reportDetail.serialNo}_${this.reportDetail.hoursOfOperation}h`;
      if (this.reportDetail.errorCode) {
        this.nameFileExport = `${this.nameFileExport}_${this.reportDetail.errorCode}`;
      }
      this.nameFileExport = `${this.nameFileExport}_${this.reportDetail.errorName ? this.reportDetail.errorName : this.reportDetail.issueName}.xlsx`;
      let tempMediaObj = this.stepsOfBranch.reduce((obj, it, index) => {
        let length = Object.keys(obj).length;

        if(it.diagnosisImages.length > length){
          obj = this.generateMedia(it.diagnosisImages.length);
        }

        return obj
      }, {});
      let nameProblem = this.reportDetail.feedback ? _.isEmpty(this.reportDetail.feedback.feedbackProblems) ? null : (this.reportDetail.feedback.feedbackProblems.map(val => this.listProblems.find(item => item.problemId === val.problemId).name).join('\n')) : null;
      this.dataExports = this.stepsOfBranch.reduce((arr, it, index) => {
        let listDiagnosisImages = it.diagnosisImages.reduce((obj, current, index) => {
          obj[`Media${index+1}`] = current.fileName;
          return obj
        }, {...tempMediaObj})
        let selectButton = _.isEmpty(it.choiceDescs) ? null :
            _.isEmpty(it.choiceDescs.find(value => value.choiceCodeId === it.choiceCodeId)) ? null : it.choiceDescs.find(value => value.choiceCodeId === it.choiceCodeId).name;
        return [...arr, {
          'Report id': this.reportDetail.diagnosisSessionId,
          'Start Date': this.reportDetail.occurence ? this.moment(this.reportDetail.occurence).format('Do-MMM-YY') : '',
          'End Date': this.reportDetail.closeDate ? this.moment(this.reportDetail.closeDate).format('Do-MMM-YY') : '',
          'Model': this.reportDetail.modelName,
          'Serial': this.reportDetail.serialNo,
          'Dealer': this.reportDetail.dealerId,
          'Hours of operation': `${this.reportDetail.hoursOfOperation} hrs`,
          'Version': this.reportDetail.version,
          'Status': this.reportDetail.status ? this.$t('reports.statusOpen') : this.$t('reports.statusClose'),
          'Issue/Error code': this.reportDetail.errorCodeId === null ? this.reportDetail.issueName : `${this.reportDetail.errorCode} ${this.reportDetail.errorName}`,
          'Feedback How did it go?': this.reportDetail.feedback ? this.reportDetail.feedback.isLike ? this.$t('reports.txtIslikeGood') : this.$t('reports.txtIslikeBad') : null,
          'Feedback How helpful was the diagnosis?': this.reportDetail.feedback ? ['★','★★','★★★','★★★★','★★★★★'][this.reportDetail.feedback.helpful-1] : null,
          'What problem did you have?': nameProblem,
          'Anything else?': this.reportDetail.feedback ? this.reportDetail.feedback.description : null,
          'Card ID': it.cardId,
          'Card title': it.cardName,
          'Card type': it.cardTypeName,
          'Note': it.note ? it.note.content : null,
          'Instruction': it.instructionName,
          ...listDiagnosisImages,
          '3D/AR model': it.displayModelName,
          'Select button': selectButton,
          'Saved by': it.savedBy,
          'Device': it.device,
          'GPS': it.gps,
        }]
      },[]);
      await exportExcel(this.dataExports, this.nameFileExport, 'Report detail', 'reportDetail');
    }
  },
}
</script>

<style scoped>
  div.container >>> .ant-col-4 {
    width: 20%;
  }
  div.container >>> .ant-col-8 {
    width: 40%;
  }
</style>
