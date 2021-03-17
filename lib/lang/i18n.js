'use strict';

exports.__esModule = true;

var _i18next = require('i18next');

var _i18next2 = _interopRequireDefault(_i18next);

var _i18nextBrowserLanguagedetector = require('i18next-browser-languagedetector');

var _i18nextBrowserLanguagedetector2 = _interopRequireDefault(_i18nextBrowserLanguagedetector);

var _en = require('./locales/en');

var _en2 = _interopRequireDefault(_en);

var _vi = require('./locales/vi');

var _vi2 = _interopRequireDefault(_vi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var detectorOptions = {
  order: ['localStorage'],
  lookupLocalStorage: 'lng'
};

_i18next2.default.use(_i18nextBrowserLanguagedetector2.default).init({
  resources: {
    en: _en2.default,
    vi: _vi2.default
  },
  detection: detectorOptions,

  fallbackLng: 'en',

  interpolation: {
    escapeValue: false
  },

  react: {
    wait: true
  }
});

exports.default = _i18next2.default;
module.exports = exports['default'];