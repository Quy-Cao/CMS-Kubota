<template>
  <div>
    <a-form layout="inline" :form="form" @submit="handleSubmit" class="d-flex" :class="types == TYPE_MODELS.ISSUES ? 'form-action-issues' : 'form-action-err'">
      <div>
        <a-form-item class="mr-1">
          <a-select
            v-decorator="[
              'action',
              {
                initialValue: ''
              }
            ]"
            :placeholder="$t('listModel.txtBulkAction')"
            @change="handleChangeAction"
            @focus="handleFocusAction"
          >
            <a-select-option value="" disabled>
              {{ $t('issues.statusAction') }}
            </a-select-option>
            <a-select-option v-for="bulk in BULK_ACTION" :key="bulk.id">
              {{ bulk.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item class="mr-3">
          <a-button class="short" @click="handleChangeStatus" :disabled="actionId == null || selectedModel.length == 0">
            {{ $t('issues.btnApply') }}
          </a-button>
        </a-form-item>
      </div>
      <!-- Select Status -->
      <div :class="types == TYPE_MODELS.ISSUES ? 'form-status-issues' : 'form-status-err'">
        <a-form-item class="mx-1" :class="types == TYPE_MODELS.ISSUES ? 'form-select-isdraft-issues' : 'form-select-isdraft-err'">
          <a-select
            v-decorator="[
              'isDraft',
              {
                initialValue: queryParams.isDraft ? queryParams.isDraft : ''
              }
            ]"
            :placeholder="$t('listModel.txtStatus')"
            @change="handleChangeFilterStatus"
          >
            <a-select-option value="" disabled>
              {{ $t('issues.titleStatus') }}
            </a-select-option>
            <a-select-option v-for="status in IS_DRAFT" :value="status.id" :key="status.id" >
              {{ status.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <!-- Select category -->
        <a-form-item class="mx-1" v-if="types == TYPE_MODELS.ISSUES">
          <a-select
            v-decorator="[
              'categoryId',
              {
                initialValue: queryParams.categoryId ? queryParams.categoryId : ''
              }
            ]"
            :placeholder="$t('listModel.txtCategory')"
            @change="handleChangeFilterCategory"
          >
            <a-select-option value="" disabled>
              {{ $t('issues.titleCategory') }}
            </a-select-option>
            <a-select-option value="all">
              {{ $t('issues.statusAllCategory') }}
            </a-select-option>
            <a-select-option v-for="category in listCategory" :value="category.categoryId" :key="category.categoryId">
              {{ getContentLocale(category.names, getLocaleDefault(listLanguage)) }}
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
        <a-form-item class="m-0">
          <a-button class="short" html-type="submit" :type="!isNotFilter ? 'primary' : ''">
            {{ $t('commonText.btnFilter') }}
          </a-button>
        </a-form-item>
      </div>
      <div style="flex-grow: 1" >
        <a-form-item class="float-right m-0" :class="types == TYPE_MODELS.ISSUES ? 'form-button-add-issues' : 'form-button-add-err'">
          <nuxt-link :to="types == TYPE_MODELS.ERRORCODES ? `/errorCodes/add?modelId=${modelInfo.modelId}` : `/issues/add?modelId=${modelInfo.modelId}`">
            <a-button type="primary" :disabled="$route.query.version ? true : false">
              {{ types == TYPE_MODELS.ERRORCODES ? $t('errorCodes.btnAdd') : $t('issues.btnAdd') }}
            </a-button>
          </nuxt-link>
        </a-form-item>
      </div>
    </a-form>
    <div class="mt-3">
      <a-table
        :columns="columns"
        :data-source="listModels"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        :customRow="customRow"
        class="table-row"
      >
        <span slot="nameModel" class="font-16px font-weight-bold" slot-scope="text, record">{{ types == TYPE_MODELS.ERRORCODES ? record.errorCode : record.name }}</span>
        <span slot="name" class="font-16px" slot-scope="text, record">{{ types == TYPE_MODELS.ERRORCODES ? text : getContentLocale(record.mainCategoryNames, getLocaleDefault(listLanguage)) }}</span>
        <span slot="subCategoryName" class="font-16px" slot-scope="text">{{ text }}</span>
        <span slot="isDraft" class="font-16px" slot-scope="text">{{ getStatusName(text, 'name') }}</span>
        <span slot="savedBy" class="font-16px" slot-scope="text">{{ text }}</span>
        <span slot="publishVersion" class="font-16px" slot-scope="text">{{ text }}</span>
        <span slot="action" class="ic-row-right"></span>
      </a-table>
    </div>
    <a-modal v-model="visibleModalCopy" :title="$t('listModel.titleCopyModel')" on-ok="handleCopyError" :dialogStyle="{animationDuration: visibleModalCopy ? '0.4s' : '', display: visibleModalCopy ? '' : 'none'}">
      <a-form :form="formCopy" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
        <a-form-item :label="$t('listModel.lableCopy')">
          <a-select
            v-decorator="[
              'toModelId',
              {
                rules: [{ required: true, message: $t('messValidate.requiredModalCopy') }]
              },
            ]"
            :placeholder="$t('messValidate.requiredModalCopy')"
          >
          <a-select-option v-for="model in models" :key="model.modelId" v-if="model.modelId !== modelInfo.modelId">
              {{ getContentLocale(model.names, getLocaleDefault(listLanguage)) }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button key="back" @click="handleCancelCopy">
           {{ $t('commonText.txtCancel') }}
        </a-button>
        <a-button key="submit" type="primary" :disabled="isSubmitCopy" @click="handleCopyError">
           {{ $t('titleFormModal.txtOk') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
  import { mapActions, mapState, mapMutations } from "vuex";
  import { PAGE_SIZE, TYPE_MODELS, BULK_ACTION, IS_DRAFT, USER_ROLES } from "~/plugins/constant.js";
  import { getStatusName } from "~/plugins/utils.js";
  export default {
    layout: "default",
    props: ['columns', 'types', 'listLanguage', 'modelInfo', 'listCategory'],
    data() {
      return {
        form: this.$form.createForm(this, { name: 'issues' }),
        formCopy: this.$form.createForm(this, { name: 'formCopy' }),
        isSubmit: false,
        isSubmitCopy: false,
        loading: false,
        listModels: null,
        selectedRowKeys: [],
        pagination: {},
        queryParams: {},
        selectedModel: [],
        actionId: null,
        visibleModalCopy: false,
        models: null,
        isNotFilter: true,
        TYPE_MODELS,
        BULK_ACTION,
        IS_DRAFT,
        USER_ROLES
      };
    },
    computed: {
      ...mapState({
        seriesHasModel: state => state.series.seriesHasModel,
        totalModelsOfSeries: state => state.models.totalModelsOfSeries,
      }),
      hasSelected() {
        return this.selectedRowKeys.length > 0;
      }
    },
    watch: {
      '$route.query': '$fetch'
    },
    fetch() {
      this.initData();
    },
    methods: {
      ...mapActions({
        getListErrorCodes: 'errorCodes/getListErrorCodes',
        changeErrorStatus: 'errorCodes/changeErrorStatus',
        copyErrorsToOtherModel: 'errorCodes/copyErrorsToOtherModel',
        getListIssues: 'issues/getListIssues',
        changeIssueStatus: 'issues/changeIssueStatus',
        copyIssueToOtherModel: 'issues/copyIssueToOtherModel',
        getModelById: 'models/getModelById',
        countModelsOfSeries: 'models/countModelsOfSeries',
        getSeriesHasListModel: 'series/getSeriesHasListModel'
      }),
      initData() {
        const { isDraft, pageNumber, pageSize, search, categoryId, modelId, version } = this.$route.query
        const params = {
          isDraft: (isDraft !== 0 && !isDraft)  ? '' : _.parseInt(isDraft),
          pageNumber: _.isNil(pageNumber) ? 1 : pageNumber,
          pageSize:  _.isNil(pageSize) ? PAGE_SIZE : pageSize,
          search:  _.isNil(search) ? '' : search,
          modelId: modelId,
          version: _.isNil(version) ? '' : version,
          locale: this.getLocaleDefault(this.listLanguage),
        };
        this.isNotFilter = (params.isDraft ==='' && params.search === '');

        if(this.types == TYPE_MODELS.ISSUES) {
          Object.assign(params, {categoryId: !categoryId ? '' : parseInt(categoryId)});
          this.isNotFilter = this.isNotFilter && params.categoryId === '';
        }
        this.queryParams = params;
        this.handleSearch(params);
      },
      handleSubmit(e) {
        e.preventDefault();
        this.isSubmit = true;
        this.form.validateFields(async (err, values) => {
          values = {
            ...values,
            isDraft: (values.isDraft && values.isDraft != 'all') ? _.parseInt(values.isDraft) : '',
            search:  _.trim(values.search),
            pageNumber: 1,
            pageSize: PAGE_SIZE,
            modelId: this.modelInfo.modelId,
            version: this.$route.query.version ? this.$route.query.version : '',
            locale: this.getLocaleDefault(this.listLanguage),
          };
          if(this.types == TYPE_MODELS.ISSUES) {
            Object.assign(values, {categoryId: (values.categoryId && values.categoryId != 'all') ? _.parseInt(values.categoryId) : ''})
          }
          this.$router.push({path: this.$route.path, query: values });
        });
      },
      handleChangeFilterStatus(value) {
        this.queryParams = {
          ...
          this.queryParams,
          isDraft: (value != 'all') ? _.parseInt(value) : '',
          pageNumber: 1
        };
        this.$router.push({path: this.$route.path, query: this.queryParams });
      },
      handleChangeFilterCategory(value) {
        this.queryParams = {
          ...this.queryParams,
          categoryId: (value && value != 'all') ? _.parseInt(value) : '',
          pageNumber: 1
        };
        this.$router.push({path: this.$route.path, query: this.queryParams });
      },
      handleKeyUp(e) {
        const value = e.target.value;
        this.queryParams = {
          ...this.queryParams,
          search: value ? _.trim(value) : '',
          pageNumber: 1
        };
        _.delay(() => {
          this.$router.push({path: this.$route.path, query: this.queryParams });
        }, 1000)
      },
      async handleSearch(params) {
        const resApi = this.types == TYPE_MODELS.ERRORCODES ? await this.getListErrorCodes(params) : await this.getListIssues(params);
        if (resApi.status == 200) {
          const pagination = { ...this.pagination };
          pagination.total = resApi.data.totalRecord;
          pagination.pageSize = resApi.data.pageSize;
          pagination.current = resApi.data.pageNumber;
          this.loading = false;
          this.pagination = pagination;
          this.listModels = this.types == TYPE_MODELS.ERRORCODES ? resApi.data.errorDiagnosis : resApi.data.issueDiagnosis;
        }
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedModel = _.map(selectedRows, (row) => {
          return this.types == TYPE_MODELS.ERRORCODES ? row.errorCodeId : row.iCategoryId;
        });
        this.selectedRowKeys = selectedRowKeys;
      },
      handleTableChange(pagination, filters, sorter) {
        const params = {
          ...this.queryParams,
          pageNumber: pagination.current
        };
        this.selectedRowKeys = [];
        this.selectedModel = [];
        this.$router.push({path: this.$route.path, query: params });
      },
      handleFocusAction() {
        this.countModelsOfSeries(this.modelInfo.seriesId);
      },
      handleChangeAction(value) {
        this.actionId = value;
      },
      async handleChangeStatus() {
        if (this.actionId != BULK_ACTION.COPY_MODEL.id) {
          this.$confirm({
            title: this.$t('titleFormModal.titleConfirmBulkAction') + `${this.getStatusName(this.actionId, 'name')}?`,
            onOk: async () => {
              let findSelectModel = this.selectedModel.reduce((arr, current, index) => {
                return [...arr, this.listModels.find(item =>this.types == TYPE_MODELS.ERRORCODES ? item.errorCodeId == current : item.iCategoryId == current)]
              },[]);
              let checkIsDraft = findSelectModel.filter(it => (it.isDraft == IS_DRAFT.PUBLISH.id || it.isDraft == IS_DRAFT.DISABLE.id) && it.publishVersion);
              let checkPublishVersion = (findSelectModel.length >= 2 && !_.isEmpty(findSelectModel.find(it => it.publishVersion != null))) ? findSelectModel.every(it => it.publishVersion && findSelectModel[0].publishVersion) : true;
              if((!_.isEmpty(checkIsDraft) && this.actionId == IS_DRAFT.UNPUBLISH.id)) {
                this.$warning({
                  title: this.$t('titleFormModal.titleWarningIsDraft'),
                });
              } else {
                if(checkPublishVersion) {
                  let params = {
                    isDraft: _.parseInt(this.actionId),
                    savedBy: this.getUserName(this.$keycloak.token)
                  }
                  if (this.types == TYPE_MODELS.ERRORCODES) {
                    params = {
                      ...params,
                      errorCodeIds: this.selectedModel
                    }
                  } else {
                    params = {
                      ...params,
                      iCategoryIds: this.selectedModel
                    }
                  }
                  const resChangeStatus = this.types == TYPE_MODELS.ERRORCODES ? await this.changeErrorStatus(params) : await this.changeIssueStatus(params);
                  if (resChangeStatus.status == 200) {
                    this.$success({
                      title: this.$t('titleFormModal.titleSuccessBulkAction'),
                      onOk() {
                        /*window.location.reload(true);*/
                      }
                    });
                  } else {
                    this.$warning({
                      title: this.$t('titleFormModal.titleWarningBulkAction'),
                    });
                  }
                } else {
                  this.$warning({
                    title: this.$t('titleFormModal.titleWarningIsDraft'),
                  })
                }
              }
            },
            onCancel() {},
          });
        } else {
          await this.getSeriesHasListModel(this.modelInfo.seriesId);
          this.models = this.seriesHasModel.models;
          this.visibleModalCopy = true;
        }
      },
      customRow(record, index) {
        return {
          on: {
            click: () => {
              this.types == TYPE_MODELS.ERRORCODES
              ? this.$router.push(`/errorCodes/${record.errorCodeId}?modelId=${this.modelInfo.modelId}${this.$route.query.version ? `&version=${this.$route.query.version}` : ''}`)
              : this.$router.push(`/issues/${record.iCategoryId}${this.$route.query.version ? `?version=${this.$route.query.version}` : ''}`);
            }
          }
        }
      },
      handleCopyError(e) {
        e.preventDefault();
        this.isSubmitCopy = true;
        this.formCopy.validateFields(async (err, values) => {
          if (!err) {
            values = {
              ...values,
              fromModelId: this.modelInfo.modelId,
              savedBy: this.getUserName(this.$keycloak.token)
            }

            if (this.types == TYPE_MODELS.ERRORCODES) {
              values = {
                ...values,
                errorCodeIds: this.selectedModel
              }
            } else {
              values = {
                ...values,
                iCategoryIds: this.selectedModel
              }
            }

            const resCopy = this.types == TYPE_MODELS.ERRORCODES ? await this.copyErrorsToOtherModel(values) : await this.copyIssueToOtherModel(values);
            if (resCopy.status == 200) {
              this.$success({
                title: this.$t('titleFormModal.titleSuccessCopyErr'),
                onOk: () => {
                  this.visibleModalCopy = false;
                  window.location.reload(true);
                }
              });
            } else {
              this.$warning({
                title: this.$t('titleFormModal.titleWarningNotCopy'),
              });
              this.isSubmitCopy = false;
            }
          } else {
            this.isSubmitCopy = false;
          }
        });
      },
      handleCancelCopy() {
        this.visibleModalCopy = false;
      }
    }
  }
</script>
