import Vue from 'vue';
import { IS_DRAFT } from "~/plugins/constant.js";
import jwtDecode from 'jwt-decode';

Vue.mixin({
  methods: {
    getStatusName(status, nameType) {
      return _.get(this.getObject(IS_DRAFT, 'id', status), nameType, '');
    },

    getObject (arr, keyName, keyValue) {
      const obj = _.filter(arr, item => item[keyName] == keyValue);
      if (obj.length > 0) {
        return obj[0];
      }
      return {};
    },

    getContentLocale(contents, locale) {
      return _.get(this.getObject(contents, 'locale', locale), 'content', '');
    },

    setMenuActive(arrPath, path) {
      const isMenu = _.filter(arrPath, pathItem => {
        return _.startsWith(path, pathItem);
      });
      return !_.isEmpty(isMenu);
    },

    getError(errors, nameField, isChange = false) {
      if (!_.isEmpty(errors)) {
        if (isChange) {
          errors.errors = _.omit(errors.errors, [nameField]);
        }
        if(!_.isUndefined(errors.errors[nameField])) {
          return errors.errors[nameField];
        }
      }
      return '';
    },

    getLocaleDefault(languages) {
      const languageDefault = _.filter(languages, language => {
        return language.isDefault == 1;
      });

      if (!_.isEmpty(languageDefault)) {
        return languageDefault[0].locale;
      }

      return '';
    },

    getNameLocale(locale, languages) {
      return _.get(this.getObject(languages, 'locale', locale), 'name', '');
    },

    findChildStepPath(obj, stepId, path = ['flowStep']) {
      if (obj.stepId === stepId) return path;
      const childSteps = obj.flowStepChilds || [];
      for (let i = 0; i < childSteps.length; i++) {
        const found = this.findChildStepPath(childSteps[i], stepId, [...path, 'flowStepChilds', i]);
        if (found) return found;
      }
    },

    findStepByChoiceOrder(dataStep, choiceOrder) {
     return _.findIndex(dataStep, step => {
        return step.choiceOrder == choiceOrder;
      })
    },

    formatDataStep(flowStep) {
      if (_.isNull(flowStep)) return null;
      return {
        cardId: flowStep.cardId,
        choiceOrder: flowStep.choiceOrder,
        flowStepChilds: flowStep.flowStepChilds && flowStep.flowStepChilds.length ? flowStep.flowStepChilds.map(child => this.formatDataStep(child)) : null
      };
    },

    getUserName(token) {
      return jwtDecode(token).name;
    },

    getUserRoles(token) {
      return jwtDecode(token).resource_access['kmaa-app'].roles;
    },
  }
});
