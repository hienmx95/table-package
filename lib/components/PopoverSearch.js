'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _antd = require('antd');

var _Search = require('antd/lib/input/Search');

var _Search2 = _interopRequireDefault(_Search);

var _icon_fillter = require('../assets/icons/icon_fillter.svg');

var _icon_fillter2 = _interopRequireDefault(_icon_fillter);

var _frontendHelper = require('@fwork/frontend-helper');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _serviceWorker = require('./serviceWorker');

var _const = require('../common/const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_PAGESIZE = 10;
var PopoverSearch = _react2.default.memo(function (_ref) {
  var type = _ref.type,
      field = _ref.field,
      filterData = _ref.filterData,
      dataSearch = _ref.dataSearch,
      path = _ref.path,
      url = _ref.url,
      dataKey = _ref.dataKey,
      title = _ref.title,
      changeFilterData = _ref.changeFilterData;

  var _useState = (0, _react.useState)([]),
      data = _useState[0],
      setData = _useState[1];

  var _useState2 = (0, _react.useState)(type === _const.TypeSearch.SEARCH && filterData ? filterData[field] : ''),
      keySearch = _useState2[0],
      setKeySearch = _useState2[1];

  (0, _react.useEffect)(function () {
    if (type === _const.TypeSearch.SEARCH_CHECKBOX) {
      var params = {
        field: field,
        pageSize: DEFAULT_PAGESIZE
      };
      (0, _frontendHelper.fetchAPI)({
        url: url,
        method: 'GET',
        params: params
      }).then(function (resp) {
        if (resp.data.success) {
          if (dataKey) {
            setData(resp.data.data[dataKey]);
          } else {
            setData(resp.data.data);
          }
        }
      });
    }
  }, []);

  (0, _react.useEffect)(function () {
    if (type === _const.TypeSearch.CHECKBOX) {
      setData(dataSearch);
    }
  }, [dataSearch]);

  var handleSearch = (0, _react.useCallback)((0, _serviceWorker.debounce)(function (searchValue) {
    if (type === _const.TypeSearch.SEARCH_CHECKBOX) {
      var params = {
        path: path.join('.'),
        pageSize: DEFAULT_PAGESIZE,
        searchValue: searchValue
      };
      (0, _frontendHelper.fetchAPI)({
        url: url,
        method: 'GET',
        params: params
      }).then(function (value) {
        if (dataKey) {
          setData(value.data.data[dataKey]);
        } else {
          setData(value.data.data);
        }
      });
    } else if (_const.TypeSearch.SEARCH) {
      changeFilterData({ type: _const.ACTIONS.ADD, payload: { type: type, field: field, value: searchValue } });
    }
  }, 500), []);

  var handleCheckBox = function handleCheckBox(e) {
    var _e$target = e.target,
        value = _e$target.value,
        refData = _e$target.refData;

    if (e.target.checked) {
      changeFilterData({ type: _const.ACTIONS.ADD, payload: { type: type, field: field, value: value, refData: refData } });
    } else {
      changeFilterData({ type: _const.ACTIONS.REMOVE_BY_VALUE, payload: { field: field, value: value } });
    }
  };

  var handleChangeKeySearch = function handleChangeKeySearch(keySearch) {
    setKeySearch(keySearch);
  };

  (0, _react.useEffect)(function () {
    if (type === _const.TypeSearch.SEARCH) {
      handleChangeKeySearch(filterData[field]);
    } else if (type === _const.TypeSearch.SEARCH_CHECKBOX) {
      if (_lodash2.default.isEmpty(filterData[field])) {
        handleChangeKeySearch('');
      }
    }
  }, [filterData]);

  var getCheckedProp = function getCheckedProp(value) {
    return filterData[field] && filterData[field].find(function (filter) {
      return filter.value === value;
    });
  };

  return _react2.default.createElement(
    _react2.default.Fragment,
    null,
    _react2.default.createElement(
      _antd.Popover,
      {
        overlayClassName: 'fwork-overlay-filter-table',
        content: _react2.default.createElement(
          'div',
          null,
          type === _const.TypeSearch.SEARCH || type === _const.TypeSearch.SEARCH_CHECKBOX ? _react2.default.createElement(_Search2.default, { placeholder: 'T\xECm ki\u1EBFm', value: keySearch, onChange: function onChange(e) {
              var searchValue = e.target.value;
              handleSearch(searchValue);
              handleChangeKeySearch(searchValue);
            } }) : null,
          _react2.default.createElement(
            'div',
            { className: 'fwork-popover-checkbox-group' },
            _lodash2.default.isArray(data) && data.map(function (item) {
              if (_lodash2.default.has(item, 'value') && _lodash2.default.has(item, 'refData')) {
                var value = item.value,
                    refData = item.refData;

                return _react2.default.createElement(
                  _antd.Col,
                  { span: 24, key: item.value },
                  _react2.default.createElement(
                    _antd.Checkbox,
                    {
                      defaultChecked: false,
                      value: value,
                      refData: refData,
                      onChange: handleCheckBox,
                      checked: getCheckedProp(value)
                    },
                    refData
                  )
                );
              } else {
                return _react2.default.createElement(
                  _antd.Col,
                  { span: 24, key: item._id },
                  _react2.default.createElement(
                    _antd.Checkbox,
                    {
                      defaultChecked: false,
                      value: item._id,
                      onChange: handleCheckBox,
                      refData: _lodash2.default.get(item, path),
                      checked: getCheckedProp(item._id)
                    },
                    _lodash2.default.get(item, path)
                  )
                );
              }
            })
          )
        ),
        trigger: 'click',
        placement: 'bottomLeft'
      },
      _react2.default.createElement(
        'span',
        { style: { display: 'flex' } },
        _react2.default.createElement(
          'span',
          { className: 'fwork-title-column' },
          title
        ),
        _react2.default.createElement('img', { className: 'fwork-icon-filter-table', src: _icon_fillter2.default, alt: 'icon filter' })
      )
    )
  );
});

PopoverSearch.propTypes = process.env.NODE_ENV !== "production" ? {
  field: _propTypes2.default.string,
  url: _propTypes2.default.string,
  path: _propTypes2.default.array,
  dataKey: _propTypes2.default.string,
  filterData: _propTypes2.default.object,
  changeFilterData: _propTypes2.default.func
} : {};

exports.default = PopoverSearch;
module.exports = exports['default'];