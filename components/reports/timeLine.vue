<template>
  <div class="diagnosis-steps">
    <a-row>
      <a-col span="16">
        <a-timeline>
          <a-timeline-item v-for="(step, index) in branchData" color="gray" :key="step.diagnosisStepId" :class="`branch-${step.branchIndex ? step.branchIndex : 0}`" class="pb-4">
            <div><span :class="`${step.branchIndex || step.branchIndex === undefined ? '' : 'txt-gray'} font-12px font-weight-bold`">{{ step.cardTypeName }}</span></div>
            <p class="font-16px font-weight-bold nl2br">{{ step.cardName }}</p>
            <div v-if="step.diagnosisImages">
              <a-carousel v-if="step.diagnosisImages.length" class="mb-4">
                <div v-for="item in step.diagnosisImages" :key="item.imageId">
                  <video v-if="item.path.includes('video')" :src="item.path" preload="metada" controls class="report-media-thumb"></video>
                  <img v-else :src="item.path" :alt="item.fileName" class="report-media-thumb">
                </div>
              </a-carousel>
            </div>
              <div v-if="step.instructionName" v-html="step.instructionName" :class="`mb-3 font-16px ${step.branchIndex || step.branchIndex === undefined ? '' : 'txt-main'} style-column-instruction nl2br`"></div>
            <div v-if="step.choiceDescs.length">
              <div><span :class="`${step.branchIndex || step.branchIndex === undefined ? '' : 'txt-gray'} font-12px font-weight-bold`">{{ $t('reportDetail.answer') }}</span></div>
              <div>
                <a-select class="mr-2" :default-value="step.choiceCodeId" style="width: 395px" v-model="choiceCodeId[index]" @change="handleChange(step, index)">
                  <a-select-option v-for="choice in step.choiceDescs" :value="choice.choiceCodeId" :key="choice.choiceCodeId">
                    {{ choice.name }}
                  </a-select-option>
                </a-select>
                <a-button v-if="step.diagnosisSessionId" class="font-14px" type="primary" size="large" :style="{ 'min-width': '135px' }" @click="handleClick(reportDetail.diagnosisSessionId, step, choiceCodeId[index], newBranchIndex)" :disabled="!canCreateBranch(step.flowStepId, choiceCodeId[index]) || !choiceCodeId[index] || isButtonDisabled ? true : false">
                  <span class="font-weight-bold">
                    {{ $t('reportDetail.btnCreateBranch')}}
                  </span>
                </a-button>
              </div>
            </div>
            <div v-if="step.note && (step.note.content || step.note.noteImages.length)" class="mt-4">
              <a-card :title="$t('reportDetail.note')" style="width: 395px" v-if="step.note.content || step.note.noteImages.length" :bordered="false">
                <div v-if="step.note.content"><span class="nl2br">{{ step.note.content }}</span></div>
                <div v-if="step.note.noteImages.length">
                  <img v-for="image in step.note.noteImages" class="note-thumb-img" :src="image.imageUrl" :alt="image.imageName" :key="image.noteImageId" :style="{ margin: 0 }">
                </div>
              </a-card>
            </div>
          </a-timeline-item>
          <a-timeline-item v-if="feedback" color="gray" id="feedback">
            <div><span class="font-16px font-weight-bold">{{ $t('reportDetail.feedback') }}</span></div>
            <a-card style="width: 395px" :bordered="false">
              <div>
                <div><span class="font-16px font-weight-bold txt-main">{{ $t('reportDetail.howItGo') }}</span></div>
                <div>
                  <img v-if="feedback.isLike" src="../../assets/images/thumb-up.svg" alt="thumb-up">
                  <img v-else-if="feedback.isLike == 0" src="../../assets/images/thumb-down.svg" alt="thumb-down">
                </div>
              </div>
              <div class="mb-2">
                <div><span class="font-16px font-weight-bold txt-main">{{ $t('reportDetail.howHelpful') }}</span></div>
                <div><a-rate :default-value="feedback.helpful" disabled allow-half /></div>
              </div>
              <div class="txt-main">
                <div class="mb-1"><span class="font-16px font-weight-bold">{{ $t('reportDetail.whatProblem') }}</span></div>
                <div v-for="problem in listProblems" :key="problem.problemId" class="ml-1">
                  <span v-if="isCheckedProblems(problem.problemId)"><a-icon type="check" /></span>
                  <span :style="isCheckedProblems(problem.problemId) ? '': 'margin-left: 17px'">{{ problem.name }}</span>
                </div>
              </div>
              <div class=" mt-2 txt-main">
                <div class="font-16px font-weight-bold"><span>{{ $t('reportDetail.anythingElse') }}</span></div>
                <div><span class="nl2br">{{ feedback.description }}</span></div>
              </div>
            </a-card>
          </a-timeline-item>
        </a-timeline>
        <div v-if="!branchData[branchData.length - 1].diagnosisSessionId">
          <a-button type="primary" size="large"
          class="font-14px" 
          :style="{ 'min-width': '135px', 'margin-left': '23px' }"
          @click="handleSaveBranch"
          :disabled="isButtonDisabled || !this.getUnSavedSteps().length">
            <span class="font-weight-bold">
              {{ $t('reportDetail.btnSaveBranch')}}
            </span>
          </a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { BRANCH_ACTIONS } from '../../plugins/constant';

export default {
  props: ['initData', 'feedback', 'newBranchIndex', 'currentBranchIndex'],
  data() {
    return {
      choiceCodeId: {
        ...this.initData.map(step => step.choiceCodeId)
      },
      isButtonDisabled: false,
      branchData: this.initData,
    }
  },
  mounted() {
    window.addEventListener('beforeunload', this.confirmLeavingPage);
    this.displayConfirmation(true);
  },
  computed: {
    ...mapState({
      listLanuage: state => state.languages.listLanguage,
      listProblems: state => state.reports.listProblems,
      reportDetail: state => state.reports.reportDetail,
      listSteps: state => state.reports.listSteps,
      showConfirmation: state => state.reports.showConfirmation
    })
  },
  methods: {
    ...mapActions({
      getReportDetail: 'reports/getReportDetail',
      createNewBranch: 'reports/createNewBranch',
      changeActionType: 'reports/changeActionType',
      displayConfirmation: 'reports/displayConfirmation'
    }),
    isCheckedProblems(problemId) {
      if(_.find(this.feedback.feedbackProblems, { problemId: problemId }))
        return true;
      return false;
    },
    async handleClick(diagnosisSessionId, step, choiceCodeId, branchIndex) {
      this.isButtonDisabled = true;
      const res = await this.createNewBranch([{
        diagnosisSessionId: diagnosisSessionId,
        cardId: step.cardId,
        flowStepId: step.flowStepId,
        choiceCodeId: choiceCodeId,
        branchIndex: branchIndex,
        occurence: new Date(),
        parentBranchIndex: step.branchIndex === undefined ? this.currentBranchIndex : step.branchIndex,
        savedBy: this.getUserName(this.$keycloak.token)
      }]);
      if(res.status == 200) {
        this.changeActionType(BRANCH_ACTIONS.CREATE);
        this.getReportDetail({
          id: this.$route.params.slug,
          locale: this.getLocaleDefault(this.listLanuage)
        });
      } else {
        this.$warning({
          title: this.$t('reportDetail.createFail'),
        });
      }
      this.isButtonDisabled = false;
    },
    handleChange(step, index) {
      if(!step.diagnosisSessionId) {
        this.branchData = this.branchData.slice(0, parseInt(index) + 1);
        this.branchData[index].choiceCodeId = this.choiceCodeId[index];
        this.branchData[index].branchIndex = this.currentBranchIndex;
        this.branchData[index].occurence = new Date()
        let choice = _.find(this.branchData[index].choiceDescs, { 
          choiceCodeId: this.choiceCodeId[index] 
        });
        let nextStep = this.getNextSteps(this.branchData[index].stepId, choice);
        if(nextStep) {
          nextStep.branchIndex = this.currentBranchIndex;
          nextStep.occurence = new Date();
          this.branchData.push(nextStep);
          this.choiceCodeId = {
            ...this.branchData.map(step => step.choiceCodeId)
          };
        }
      }
    },
    async handleSaveBranch() {
      this.displayConfirmation(false);
      this.isButtonDisabled = true;
      let data = this.getUnSavedSteps();
      await this.saveBranch(data);
      this.isButtonDisabled = false; 
    },
    async saveBranch(data) {
      if(data.length > 0) {
        const res = await this.createNewBranch(data);
        if(res.status == 200) {
          this.changeActionType(BRANCH_ACTIONS.SAVE);
          this.getReportDetail({
            id: this.$route.params.slug,
            locale: this.getLocaleDefault(this.listLanuage)
          });
        } else {
          this.$warning({
            title: this.$t('reportDetail.createFail'),
          });
        }
      }
    },
    getUnSavedSteps() {
      let unSavedSteps = this.branchData
          .filter(step => !step.diagnosisSessionId);
      if(unSavedSteps[unSavedSteps.length - 1] 
        && unSavedSteps[unSavedSteps.length - 1].choiceDescs.length > 0 
        && !unSavedSteps[unSavedSteps.length - 1].choiceCodeId)
        unSavedSteps.pop();
      return unSavedSteps.map(step => {
            return {
              diagnosisSessionId: this.reportDetail.diagnosisSessionId,
              cardId: step.cardId,
              flowStepId: step.stepId,
              choiceCodeId: step.choiceCodeId,
              branchIndex: step.branchIndex ? step.branchIndex : this.currentBranchIndex,
              occurence: step.occurence ? step.occurence : new Date(),
              savedBy: this.getUserName(this.$keycloak.token)
            }
          });
    },
    getNextSteps(parentId, choice) {
      let nextStep = _.find(this.listSteps, { 
        parentId: parentId,
        choiceOrder: choice ? choice.choiceOrder : null
      });
      return { ...nextStep };
    },
    canCreateBranch(flowStepId, choiceCodeId) {
      let chosenIDs = _.filter(this.reportDetail.diagnosisSteps, { flowStepId: flowStepId }).map(step => step.choiceCodeId);
      return !chosenIDs.includes(choiceCodeId);
    },
    confirmLeavingPage(event) {
        if(!this.getUnSavedSteps().length) return;
        event.preventDefault();
        event.returnValue = '';
    }
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.confirmLeavingPage);
    if(this.showConfirmation && this.currentBranchIndex && this.getUnSavedSteps().length > 0) {
      this.$confirm({
        title: this.$t('reportDetail.saveBranch'),
        onOk: async () => {
          this.handleSaveBranch();
        },
      });
    };
  },
}
</script>
