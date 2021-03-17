import _regeneratorRuntime from 'babel-runtime/regenerator';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var getColumnsInfo = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(code) {
    var url, _ref5, resp;

    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            url = '' + TABLE_CONFIG_BACKEND;
            _context.next = 4;
            return fetchAPI({
              url: url,
              method: 'GET',
              params: { tableCode: code }
            });

          case 4:
            _ref5 = _context.sent;
            resp = _ref5.data;

            if (!resp.success) {
              _context.next = 8;
              break;
            }

            return _context.abrupt('return', resp.data.columnsInfo || []);

          case 8:
            return _context.abrupt('return', []);

          case 11:
            _context.prev = 11;
            _context.t0 = _context['catch'](0);
            return _context.abrupt('return', []);

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 11]]);
  }));

  return function getColumnsInfo(_x6) {
    return _ref4.apply(this, arguments);
  };
}();

var updateColumnsInfo = function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(code, columnsInfo) {
    var url, _ref7, resp;

    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            url = TABLE_CONFIG_BACKEND + '/' + code;
            _context2.next = 4;
            return fetchAPI({
              url: url,
              method: 'PATCH',
              body: { columnsInfo: columnsInfo }
            });

          case 4:
            _ref7 = _context2.sent;
            resp = _ref7.data;

            if (!resp.success) {
              _context2.next = 8;
              break;
            }

            return _context2.abrupt('return', resp.data.columnsInfo || []);

          case 8:
            _context2.next = 13;
            break;

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2['catch'](0);
            return _context2.abrupt('return', columnsInfo);

          case 13:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 10]]);
  }));

  return function updateColumnsInfo(_x7, _x8) {
    return _ref6.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import queryString from 'query-string';
import { fetchAPI } from '@fwork/frontend-helper';
import _ from 'lodash';

var CURRENT_DEFAULT = 1;
var PAGESIZE_DEFAULT = 20;
var COLUMN_WIDTH_DEFAULT = '100px';
var SCROLL_WIDTH = 8;
var TABLE_CONFIG_BACKEND = (process.env.FWORK_API_ENDPOINT || 'https://dev.fpt.work/api/v1') + '/table-config';

function applyDataCallServer(filterData) {
  var temp = _.cloneDeep(filterData);
  for (var key in temp) {
    if (Array.isArray(temp[key])) {
      temp[key] = temp[key].map(function (item) {
        return item.value;
      });
    }
  }
  return temp;
}

function debounce(a, b, c) {
  var d = void 0,
      e = void 0;
  return function () {
    function h() {
      d = null;
      c || (e = a.apply(f, g));
    }
    var f = this;
    var g = arguments;
    return clearTimeout(d), d = setTimeout(h, b), c && !d && (e = a.apply(f, g)), e;
  };
}

function parseData(filterData, fields) {
  var temp = _.cloneDeep(filterData);
  for (var key in temp) {
    if (Array.isArray(temp[key])) {
      temp[key] = temp[key].map(function (item) {
        return JSON.parse(item);
      });
    } else if (!fields.includes(key)) {
      delete temp[key];
    }
  }
  return temp;
}

function stringifyData(filterData) {
  var temp = _.cloneDeep(filterData);
  for (var key in temp) {
    if (Array.isArray(temp[key])) {
      temp[key] = temp[key].map(function (item) {
        return JSON.stringify(item);
      });
    }
  }
  return temp;
}

function getDefaultFilterData(_ref) {
  var _ref$history = _ref.history,
      history = _ref$history === undefined ? {} : _ref$history,
      _ref$fixedParam = _ref.fixedParam,
      fixedParam = _ref$fixedParam === undefined ? '' : _ref$fixedParam,
      _ref$columns = _ref.columns,
      columns = _ref$columns === undefined ? [] : _ref$columns;

  try {
    var fields = columns.filter(function (col) {
      return col.filterSource;
    }).map(function (col) {
      return col.filterSource.field;
    });
    var search = _.get(history, 'location.search', '');
    var searchRemoveFixedParam = _.replace(search, fixedParam, '');
    var urlParams = queryString.parse(searchRemoveFixedParam, { arrayFormat: 'bracket' });
    return parseData(urlParams, fields);
  } catch (error) {
    console.log(error);
    return {};
  }
}

function getDefaultFilterDataOnlyFixed(_ref2) {
  var _ref2$history = _ref2.history,
      history = _ref2$history === undefined ? {} : _ref2$history,
      _ref2$fixedParam = _ref2.fixedParam,
      fixedParam = _ref2$fixedParam === undefined ? '' : _ref2$fixedParam,
      _ref2$columns = _ref2.columns,
      columns = _ref2$columns === undefined ? [] : _ref2$columns;

  try {
    var fields = columns.filter(function (col) {
      return col.filterSource;
    }).map(function (col) {
      return col.filterSource.field;
    });
    var search = _.get(history, 'location.search', '');
    var searchRemoveFixedParam = _.replace(search, fixedParam, '');
    var urlParams = queryString.parse(searchRemoveFixedParam, { arrayFormat: 'bracket' });
    return parseData(urlParams, fields);
  } catch (error) {
    console.log(error);
    return {};
  }
}

function getDefaultPagination() {
  var history = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  try {
    var search = _.get(history, 'location.search', '');
    var urlParams = queryString.parse(search, { arrayFormat: 'bracket' });
    var _urlParams$pageSize = urlParams.pageSize,
        pageSize = _urlParams$pageSize === undefined ? PAGESIZE_DEFAULT : _urlParams$pageSize,
        _urlParams$current = urlParams.current,
        current = _urlParams$current === undefined ? CURRENT_DEFAULT : _urlParams$current;

    return { pageSize: pageSize, current: current };
  } catch (error) {
    console.log(error);
    return { current: CURRENT_DEFAULT, pageSize: PAGESIZE_DEFAULT };
  }
}

function setUrlParams(_ref3) {
  var _ref3$history = _ref3.history,
      history = _ref3$history === undefined ? {} : _ref3$history,
      _ref3$filterData = _ref3.filterData,
      filterData = _ref3$filterData === undefined ? {} : _ref3$filterData,
      _ref3$searchValue = _ref3.searchValue,
      searchValue = _ref3$searchValue === undefined ? '' : _ref3$searchValue,
      _ref3$extendCondition = _ref3.extendCondition,
      extendCondition = _ref3$extendCondition === undefined ? {} : _ref3$extendCondition,
      _ref3$fixedParam = _ref3.fixedParam,
      fixedParam = _ref3$fixedParam === undefined ? '' : _ref3$fixedParam,
      _ref3$current = _ref3.current,
      current = _ref3$current === undefined ? CURRENT_DEFAULT : _ref3$current,
      _ref3$pageSize = _ref3.pageSize,
      pageSize = _ref3$pageSize === undefined ? PAGESIZE_DEFAULT : _ref3$pageSize;

  try {
    var params = _extends({}, stringifyData(filterData), stringifyData(extendCondition), {
      searchValue: searchValue,
      current: current,
      pageSize: pageSize
    });
    // remove empty param
    for (var key in params) {
      if (_.isEmpty(params[key]) && !_.isNumber(params[key])) {
        delete params[key];
      }
    }

    var urlParam = queryString.stringify(params, { arrayFormat: 'bracket' });

    if (!_.isEmpty(fixedParam)) {
      urlParam = urlParam.replace(/(?!=^.{0})/, fixedParam + '&');
    }
    history.push({ search: urlParam });
  } catch (error) {
    console.log(error);
  }
}

function getUrlParams(history) {
  try {
    var paramsOuter = ['pageSize', 'current', 'searchValue', 'extendCondition'];
    var search = _.get(history, 'location.search', '');
    var urlParams = queryString.parse(search, { arrayFormat: 'bracket' });
    var filterData = {};
    for (var key in urlParams) {
      if (_.isArray(urlParams[key])) {
        urlParams[key] = urlParams[key].map(function (item) {
          return JSON.parse(item).value;
        });
      }
      if (['pageSize', 'current'].includes(key)) {
        urlParams[key] = parseInt(urlParams[key]);
      }
      if (!paramsOuter.includes(key)) {
        filterData[key] = urlParams[key];
        delete urlParams[key];
      }
    }

    urlParams.filterData = filterData;
    return urlParams;
  } catch (error) {
    console.log(error);
    return {};
  }
}

function isPercentWidth() {
  var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  return width[width.length - 1] === '%';
}
function getColumnsWidth() {
  var columns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var oldColumnsWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var widthScreen = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  widthScreen -= SCROLL_WIDTH;
  try {
    if (_.isEmpty(oldColumnsWidth)) {
      oldColumnsWidth = columns.map(function (col) {
        var minWidth = _.get(col, 'minWidth', COLUMN_WIDTH_DEFAULT);
        return _.get(col, 'width', minWidth);
      });
    }
    var abstractWidth = oldColumnsWidth.reduce(function (total, next) {
      if (isPercentWidth(next)) {
        var percentThisColumn = parseFloat(next.substring(0, next.length - 1));
        var thisWidth = widthScreen * percentThisColumn / 100;
        return total + thisWidth;
      } else {
        return total + parseFloat(next);
      }
    }, 0);
    var columnsWidth = [];
    if (abstractWidth > widthScreen) {
      // case 1:
      var totalPercentColumn = oldColumnsWidth.filter(function (width) {
        return isPercentWidth(width);
      }).reduce(function (total, next) {
        return total + parseFloat(next.substring(0, next.length - 1));
      }, 0);

      var totalPixel = oldColumnsWidth.filter(function (width) {
        return !isPercentWidth(width);
      }).reduce(function (total, next) {
        return total + parseFloat(next);
      }, 0);

      columnsWidth = columns.map(function (col, index) {
        var _col$width = col.width,
            width = _col$width === undefined ? 0 : _col$width,
            _col$minWidth = col.minWidth,
            minWidth = _col$minWidth === undefined ? COLUMN_WIDTH_DEFAULT : _col$minWidth;

        if (isPercentWidth(width)) {
          var percentThisColumn = parseFloat(width.substring(0, width.length - 1));
          var pixelWidth = (widthScreen - totalPixel) * percentThisColumn / totalPercentColumn;
          return parseFloat(pixelWidth) > parseFloat(minWidth) ? width : minWidth;
        } else {
          return parseFloat(width) > parseFloat(minWidth) ? width : minWidth;
        }
      });
    } else {
      // case 2:
      var rate = widthScreen / abstractWidth;
      columnsWidth = columns.map(function (col, index) {
        var _col$width2 = col.width,
            width = _col$width2 === undefined ? 0 : _col$width2,
            _col$minWidth2 = col.minWidth,
            minWidth = _col$minWidth2 === undefined ? COLUMN_WIDTH_DEFAULT : _col$minWidth2;

        if (isPercentWidth(width)) {
          var percentThisColumn = parseFloat(width.substring(0, width.length - 1));
          var pixelWidth = widthScreen * percentThisColumn / 100;
          var realWidth = pixelWidth * rate;
          return parseFloat(realWidth) > parseFloat(minWidth) ? width : minWidth;
        } else {
          var _realWidth = parseFloat(width) * rate;
          return parseFloat(_realWidth) > parseFloat(minWidth) ? _realWidth : minWidth;
        }
      });
    }

    if (!_.isEqual(columnsWidth, oldColumnsWidth)) {
      return getColumnsWidth(columns, columnsWidth, widthScreen);
    }
    return columnsWidth;
  } catch (error) {
    console.log(error);
    return columns.map(function (col) {
      return COLUMN_WIDTH_DEFAULT;
    });
  }
}

function arrayMove(array, oldIndex, newIndex) {
  if (!array[oldIndex] || !array[newIndex]) return array;
  var newArray = [];
  try {
    if (oldIndex < newIndex) {
      newArray = array.map(function (o, index) {
        if (index > oldIndex && index <= newIndex) {
          return _extends({}, o, { sort: o.sort - 1 });
        } else if (index === oldIndex) {
          return _extends({}, o, { sort: newIndex + 1 });
        }
        return o;
      });
    } else {
      newArray = array.map(function (o, index) {
        if (index < oldIndex && index >= newIndex) {
          return _extends({}, o, { sort: o.sort + 1 });
        } else if (index === oldIndex) {
          return _extends({}, o, { sort: newIndex + 1 });
        }
        return o;
      });
    }
    return newArray.sort(function (a, b) {
      return a.sort - b.sort;
    });
  } catch (error) {
    console.log(error);
    return array;
  }
}

export { applyDataCallServer, debounce, getDefaultFilterData, setUrlParams, getDefaultPagination, getUrlParams, getColumnsWidth, arrayMove, getColumnsInfo, updateColumnsInfo, getDefaultFilterDataOnlyFixed };