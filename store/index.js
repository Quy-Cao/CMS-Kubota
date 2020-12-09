import Vue from 'vue';
import Vuex from 'vuex';
import series from './modules/series';
import models from './modules/models';
import distributors from './modules/distributors';
import errorCodes from './modules/errorCodes';
import cards from './modules/cards';
import cardTypes from './modules/cardTypes';
import languages from './modules/languages';
import instructions from './modules/instructions';
import buttons from './modules/buttons';
import medias from './modules/medias';
import issues from './modules/issues';
import common from './modules/common';
import issueCategories from './modules/issueCategories';
import reports from './modules/reports';
import model3D from './modules/model3D';
import versions from './modules/versions';

// const cookieparser = process.server ? require('cookie-parser') : undefined;

Vue.use(Vuex);
const store = () => {
  return new Vuex.Store({
    modules: {
      series,
      models,
      distributors,
      errorCodes,
      languages,
      cards,
      cardTypes,
      instructions,
      buttons,
      medias,
      issues,
      common,
      issueCategories,
      reports,
      model3D,
      versions
    },
    strict: process.env.NODE_ENV !== 'production',
    actions: {
      nuxtServerInit({ commit }, { req }) {
        let auth = null;
        if (req.headers.cookie) {
          /*const parsed = cookieparser.parse(req.headers.cookie);
            try {
              auth = parsed.auth ? JSON.parse(parsed.auth) : null;
            } catch (err) {
              console.warn('Error', err);
              // No valid cookie found
            }*/
        }
        // commit('auth/setUser', auth);
      },
    },
  });
};

export default store;
