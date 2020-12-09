<template>
  <div class="container">
    <div class="background-title-page">
      <h1 class="font-28px m-0"><strong>{{ $t('reports.titlePage') }}</strong></h1>
      <div v-if="!isFormSearch">
        <a-breadcrumb>
          <span slot="separator" class="ic-breadcrumb"><img src="../../assets/images/line.svg"></span>
          <a-breadcrumb-item>
            <a href="/reports"><u>{{ $t('reports.titlePage') }}</u></a>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            {{ $t('reports.txtAdvanced') }}
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </div>
    <div class="bg-white px-3 py-4 box-content">
      <!-- Input Search -->
      <div v-if="isFormSearch">
        <a-form layout="inline" :form="form" @submit="handleSubmit" >
          <a-form-item class="mr-1">
            <a-input
              class="input-search-instruction"
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
          <a-form-item class="m-0">
            <a-button class="short" html-type="submit" :type="!isNotFilter ? 'primary' : ''">
              {{ $t('commonText.btnFilter') }}
            </a-button>
          </a-form-item>
        </a-form>
        <div class="mt-3">
          <a href="javascript:void(0)"><u><span @click="advancedSearch">{{ $t('reports.txtAdvanced') }}</span></u></a>
        </div>
      </div>
      <!-- Form Advance Search -->
      <div v-else>
        <a-form-model ref="advanceParams" :model="advanceParams" layout="inline" >
          <a-row class="mb-3">
            <a-col :span="11" >
              <a-form-model-item :label="$t('reports.titleModel')" class="w-100 font-weight-bold " :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
                <a-select v-model="advanceParams.modelId" :placeholder="$t('reports.messModel')" class="font-weight-400">
                  <a-select-option value="">
                    {{ $t('reports.txtAllModel') }}
                  </a-select-option>
                  <a-select-option v-for="model in allModel" :key="model.modelId">
                    ({{ getContentLocale(model.distributorNames, getLocaleDefault(listLanguage)) }}) {{ getContentLocale(model.names, getLocaleDefault(listLanguage)) }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="11" :offset="1">
              <a-form-model-item :label="$t('reports.txtReport')" class="w-100 font-weight-bold" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
                <a-input v-model="advanceParams.reportNo" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row class="mb-3" >
            <a-radio-group v-model="advanceParams.checkModel" class="w-100 d-flex" @change="handleChangRadio" >
              <a-col :span="12">
                <a-row  class="d-flex">
                  <a-col :span="1">
                    <a-radio :value="CHECK_RADIO_REPORTS.ERRORCODES">

                    </a-radio>
                  </a-col>
                  <a-col :span="22">
                    <a-form-model-item :label="$t('reports.txtErrorCode')" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" class="w-100 font-weight-bold report-form" >
                      <a-input
                        v-model="advanceParams.errorName"
                        :disabled="advanceParams.checkModel ? advanceParams.checkModel !== CHECK_RADIO_REPORTS.ERRORCODES : false"
                        :placeholder="$t('reports.messErrorCode')"
                      />
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="12" >
                <a-row  class="d-flex">
                  <a-col :span="1">
                    <a-radio :value="CHECK_RADIO_REPORTS.ISSUES">

                    </a-radio>
                  </a-col>
                  <a-col :span="22">
                    <a-form-model-item :label="$t('reports.txtIssue')" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" class="w-100 font-weight-bold report-form">
                      <a-input
                        v-model="advanceParams.issueName"
                        :disabled="advanceParams.checkModel ? advanceParams.checkModel !== CHECK_RADIO_REPORTS.ISSUES : false"
                        :placeholder="$t('reports.messIssue')"
                      />
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-col>
            </a-radio-group>
          </a-row>

          <a-row class="mb-3" >
            <a-col :span="11">
              <a-row>
                <a-col :span="3" class="pt-2">
                  <span class="mr-3 font-weight-bold">{{ $t('reports.txtDate') }}</span>
                </a-col>
                <a-col :span="4" class="pt-2">
                  <div class="float-right mr-2">{{ $t('reports.txtSince') }}</div>
                </a-col>
                <a-col :span="6" >
                  <a-date-picker v-model="advanceParams.fromDate" class="w-100"/>
                </a-col>
                <a-col  :span="4" class="pt-2">
                  <div class="float-right mr-2">{{ $t('reports.txtUntil') }}</div>
                </a-col>
                <a-col :span="6" >
                  <a-date-picker v-model="advanceParams.toDate" class="w-100" />
                </a-col>
              </a-row>
            </a-col>
            <a-col :offset="1" :span="11">
              <a-row>
                <a-col>
                  <a-form-model-item label="Technician" class="w-100 font-weight-bold" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
                    <a-input v-model="advanceParams.userId" />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-col>
          </a-row>

          <a-row class="mb-3">
            <a-col :span="11">
              <a-form-model-item label="Dealer" class="w-100 font-weight-bold" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
                <a-input v-model="advanceParams.dealerId" />
              </a-form-model-item>
            </a-col>
            <a-col :span="11" offset="1">
              <a-form-model-item label="Status" class="w-100 font-weight-bold" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
                <a-select v-model="advanceParams.status" :placeholder="$t('reports.messStatus')" class="font-weight-400">
                  <a-select-option value="">
                    {{ $t('reports.txtAllStatus') }}
                  </a-select-option>
                  <a-select-option v-for="status in STATUS_REPORTS" :key="status.id">
                    {{ status.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-form-model-item :wrapper-col="{ offset: 10 }" class="w-100 mt-3">
            <a-button :type="isTableData ? 'primary' : 'none'" html-type="submit" @click="onSubmitAdvance">{{ $t('reports.btnSearch') }}</a-button>
          </a-form-model-item>
        </a-form-model>

      </div>
      <!-- Table Show Data -->
      <div v-if="isTableData">
        <div class="mt-4" v-if="!isLoading">
          <div class="d-flex mb-2">
            <span class="font-22px font-weight-500  txt-main mr-2">{{ (queryParams.search || !isFormSearch) ? `${pagination.total} ` + $t('reports.txtResult') : $t('reports.txtRecent') }}</span>
            <a-button type="link" :disabled="isExporting" @click="handleExportData" v-if="queryParams.search || !isFormSearch">
              <span>{{ $t('reports.txtExportResult').replace('%result%', pagination.total) }}</span>
            </a-button>
            <div class="pt-2 ml-2" v-if="isExporting">
              <a-spin />
            </div>
          </div>
        </div>
        <div class="d-flex justify-center align-item-center" style="min-height: 250px" v-if="isLoading">
          <a-spin size="large" />
        </div>
        <div class="mt-3" v-if="!isLoading">
          <a-table
            :columns="columns"
            :data-source="listReports"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
            :customRow="customRow"
          >
            <span slot="occurence" class="font-16px" slot-scope="text" >{{ moment(text).format('YYYY-MM-DD') }}</span>
            <span slot="issueNames" class="font-16px font-weight-bold" slot-scope="text, record" v-if="record.iCategoryId">
              <a-tooltip>
                <template slot="title">
                  {{ getContentLocale(record.issueNames, getLocaleDefault(listLanguage)) }}
                </template>
                {{ getContentLocale(record.issueNames, getLocaleDefault(listLanguage)) }}
              </a-tooltip>
            </span>
            <span slot="issueNames" class="font-16px font-weight-bold" slot-scope="text, record" v-else>
              <a-tooltip>
                <template slot="title">
                  {{ record.errorCode }} {{ getContentLocale(record.errorNames, getLocaleDefault(listLanguage)) }}
                </template>
                {{ record.errorCode }} {{ getContentLocale(record.errorNames, getLocaleDefault(listLanguage)) }}
              </a-tooltip>
            </span>
            <span slot="modelNames" class="font-16px" slot-scope="text, record" >{{ getContentLocale(record.modelNames, getLocaleDefault(listLanguage)) }}</span>
            <span slot="diagnosisSessionId" class="font-16px" slot-scope="text" >{{ text }}</span>
            <span slot="dealerId" class="font-16px" slot-scope="text" >{{ text }}</span>
            <span slot="userId" class="font-16px" slot-scope="text" >{{ text }}</span>
            <span slot="status" class="font-16px" slot-scope="text" >{{ text ? $t('reports.statusOpen') : $t('reports.statusClose') }}</span>
            <span slot="action" class="ic-row-right"></span>
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import exportExcel from '../../plugins/vue-json-excel';
  import { mapActions, mapState, mapMutations } from "vuex";
  import { PAGE_SIZE, STATUS_REPORTS, CHECK_RADIO_REPORTS } from "~/plugins/constant.js";
  export default {
    layout: "default",
    data() {
      const columns = [
        {
          title: this.$t('reports.titleDate'),
          dataIndex: 'occurence',
          key: 'occurence',
          scopedSlots: { customRender: 'occurence' },
        },
        {
          title: this.$t('reports.titleIssues'),
          dataIndex: 'issueNames',
          key: 'issueNames',
          scopedSlots: { customRender: 'issueNames' },
          ellipsis: true,
          width: '25%'
        },
        {
          title: this.$t('reports.titleModel'),
          dataIndex: 'modelNames',
          key: 'modelNames',
          scopedSlots: { customRender: 'modelNames' },
        },
        {
          title: this.$t('reports.titleReport'),
          dataIndex: 'diagnosisSessionId',
          key: 'diagnosisSessionId',
          scopedSlots: { customRender: 'diagnosisSessionId' },
        },
        {
          title: this.$t('reports.titleDealer'),
          dataIndex: 'dealerId',
          key: 'dealerId',
          scopedSlots: { customRender: 'dealerId' },
        },
        {
          title: this.$t('reports.titleTechnician'),
          dataIndex: 'userId',
          key: 'userId',
          scopedSlots: { customRender: 'userId' },
        },
        {
          title: this.$t('reports.titleStatus'),
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          width: '50px'
        },
      ]
      return {
        form: this.$form.createForm(this, { name: 'Report' }),
        isSubmit: false,
        loading: false,
        isNotFilter: true,
        listReports: null,
        columns,
        pagination: {},
        queryParams: {},
        isTableData: true,
        isFormSearch: true,
        advanceParams: {
          checkModel: CHECK_RADIO_REPORTS.ERRORCODES,
          modelId: undefined,
          reportNo: '',
          errorName: '',
          issueName: '',
          fromDate: '',
          toDate: '',
          status: undefined,
        },
        STATUS_REPORTS,
        CHECK_RADIO_REPORTS,
        resetValue: false,
        isLoading: true,
        isAdvancedSearch: false,
        json_fields: {},
        json_meta: [
          [
            {
                'key': 'charset',
                'value': 'utf-8'
            }
          ]
        ],
        isExporting: false
      };
    },
    watch: {
    '$route.query': '$fetch'
    },
    fetch() {
      if (_.isEmpty(this.$route.query)) {
        this.isFormSearch = true;
        this.isTableData = true;
      }
      (this.isAdvancedSearch && _.isEmpty(this.$route.query)) ? this.isTableData ? (this.resetForm() && this.initData()) : '' : this.initData();
    },
    computed: {
      ...mapState({
        listLanguage: state => state.languages.listLanguage,
        allModel: state => state.reports.allModel,
        listLanguage: state => state.languages.listLanguage,
        listProblems: state => state.reports.listProblems,
      })
    },
    methods: {
      ...mapActions({
        getListReports: 'reports/getListReports',
        getListAdvanceSearch: 'reports/getListAdvanceSearch',
        getAllModel: 'reports/getAllModel',
        getListProblems: 'reports/getListProblems',
      }),
      initData() {
        const { pageNumber, pageSize, search, modelId, reportNo, errorName, issueName, userId, dealerId, status, fromDate, toDate } = this.$route.query;
        this.queryParams = {
          pageNumber: _.isNil(pageNumber) ? 1 : pageNumber,
          pageSize: _.isNil(pageSize) ? PAGE_SIZE : pageSize,
          search: _.isNil(search) ? '' : search,
        };
        if(!this.isFormSearch) {
          this.queryParams = {
            ...this.queryParams,
            fromDate,
            toDate,
            modelId,
            reportNo,
            errorName,
            issueName,
            userId,
            dealerId,
            status,
            search: ''
          }
        }
        this.isNotFilter = (this.queryParams.search === '');
        this.handleSearch(this.queryParams);
      },
      handleSubmit(e) {
        e.preventDefault();
        this.isSubmit = true;
        this.form.validateFields(async (err, values) => {
          values = {
          search:  _.trim(values.search),
          pageNumber: 1,
          pageSize: PAGE_SIZE,
        };
        this.$router.push({path: this.$route.path, query: values });
        })
      },
      async handleSearch(params) {
        const resApi = (this.isAdvancedSearch) ? await this.getListAdvanceSearch(params) : await this.getListReports(params);
        if (resApi.status == 200) {
          const pagination = { ...this.pagination };
          pagination.total = resApi.data.totalRecord;
          pagination.pageSize = resApi.data.pageSize;
          pagination.current = resApi.data.pageNumber;
          this.loading = false;
          this.pagination = pagination;
          this.listReports = resApi.data.reports;
          this.isLoading = false;
        };
      },
      handleTableChange(pagination, filters, sorter) {
        const params = {
          ...this.queryParams,
          pageNumber: pagination.current
        };
        this.$router.push({path: this.$route.path, query: params });
      },
      handleKeyUp: _.debounce(function(e) {
        this.handleKeyUp.cancel;
        if(e.key === 'Enter') {
          return
        }
        const value = e.target.value;
        this.queryParams = {
          ...this.queryParams,
          pageNumber: 1,
          search: value ? _.trim(value) : ''
        };
        this.isLoading = true;
        this.$router.push({path: this.$route.path, query: this.queryParams });
      }, 800),
      advancedSearch() {
        this.isFormSearch = false;
        this.isTableData = false;
        this.getAllModel();
        this.isAdvancedSearch = true;
        this.$router.push({path: this.$route.path, query: { searchAdvanced: true } });
      },
      async onSubmitAdvance() {
        const values = {
          ...this.advanceParams,
          fromDate: this.advanceParams.fromDate ?  this.moment(this.advanceParams.fromDate._d).format('YYYY-MM-DD') : '',
          toDate: this.advanceParams.toDate ? this.moment(this.advanceParams.toDate._d).format('YYYY-MM-DD') : '',
          pageSize: PAGE_SIZE,
          pageNumber: 1,
        };
        this.$router.push({path: this.$route.path, query: values });
        this.isTableData = true;
      },
      async handleChangRadio(e) {
        e.target.value == CHECK_RADIO_REPORTS.ISSUES ? this.advanceParams.errorName = '' : this.advanceParams.issueName = '';
      },
      resetForm() {
        this.isFormSearch = true;
        return this.advanceParams = {checkModel: CHECK_RADIO_REPORTS.ERRORCODES};
      },
      customRow(record) {
        return {
          on: {
            click: () => {
              this.$router.push(`/reports/${record.diagnosisSessionId}`);
            }
          }
        }
      },
      async handleExportData() {
        this.isExporting = true;
        let data = [];
        let exportData = [];
        let resApi = null;
        if (this.isAdvancedSearch) {
          resApi = await this.getListAdvanceSearch({
            ...this.advanceParams,
            pageNumber: -1,
            pageSize: -1
          });
        } else {
          resApi = await this.getListReports({
            search: this.queryParams.search,
            pageNumber: -1,
            pageSize: -1
          });
        }
        if(!_.isNull(resApi) && resApi.status === 200) {
          data = resApi.data.reports;
        }
        if(!this.listProblems.length) await this.getListProblems({locale: this.getLocaleDefault(this.listLanguage)});
        for(let session of data) {
          let maxBranch = _.maxBy(session.diagnosisSteps, 'branchIndex');
          let startDate = session.occurence ? this.moment(session.occurence).format('Do-MMM-YY') : '';
          let endDate = session.closeDate ? this.moment(session.closeDate).format('Do-MMM-YY') : '';
          let status = session.status ? this.$t('reports.statusOpen') : this.$t('reports.statusClose');
          let issue = session.errorCodeId === null ? session.issueNames[0].content : `${session.errorCode} ${session.errorNames[0].content}`;
          let feedbackLike = session.feedback ? session.feedback.isLike ? this.$t('reports.txtIslikeGood') : this.$t('reports.txtIslikeBad') : null;
          let feedbackStar = session.feedback ? ['★','★★','★★★','★★★★','★★★★★'][session.feedback.helpful-1] : null;
          let problems = _.isEmpty(session.feedbackProblems) ? null : (session.feedbackProblems.map(val => this.listProblems.find(item => item.problemId === val.problemId).name).join('\n'));
          let anythingElse = session.feedback ? session.feedback.description : null;
          maxBranch = maxBranch ? maxBranch.branchIndex : 0;
          for(let i = 0; i <= maxBranch; i++) {
            exportData.push({
              'Report id': session.diagnosisSessionId,
              'Start Date': startDate,
              'End Date': endDate,
              'Model': session.modelNames[0].content,
              'Serial': session.serialNo,
              'Dealer': session.dealerId,
              'Hours of operation': `${session.hoursOfOperation} hrs`,
              'Version': session.version,
              'Status': status,
              'Technicians': session.userId,
              'Device': session.terminalInfo,
              'GPS': session.gpsInfo,
              'Issue/Error code': issue,
              'Feedback How did it go?': feedbackLike,
              'Feedback How helpful was the diagnosis?': feedbackStar,
              'What problem did you have?': problems,
              'Anything else?': anythingElse,
              'Branch': i,
              'Card IDs': this.getBranchData(session, i == 0 ? null : i).join(' -> ')
            })
          }
        }
        await exportExcel(exportData, `list_report_${this.moment().format('YYYYMMDD')}.xlsx`, 'reports');
        this.isExporting = false;
      },
      getBranchData(session, branchIndex) {
        let step;
        let parentBranchIndex = null;
        let branchSteps = _.filter(session.diagnosisSteps, step => step.branchIndex == branchIndex);
        if(branchSteps.length) {
          let i = 0;
          parentBranchIndex = branchSteps[0].parentBranchIndex == 0 ? null : branchSteps[0].parentBranchIndex;
          do {
            let parentBranchSteps = _.filter(session.diagnosisSteps, step => {
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
        }
        
        return branchSteps.map(step => step.cardId);
      },
    }
  }
</script>

<style scoped>
  div.container >>> .ant-btn-link {
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;
    font-size: 14px;
    font-weight: normal;
    padding: 0;
    min-width: unset;
  }
  div.container >>> .ant-btn-link > span {
    text-decoration: underline;
  }
</style>
