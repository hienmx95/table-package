'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _icon_dropdown = require('../assets/icons/icon_dropdown.svg');

var _icon_dropdown2 = _interopRequireDefault(_icon_dropdown);

var _icon_fillter_header = require('../assets/icons/icon_fillter_header.svg');

var _icon_fillter_header2 = _interopRequireDefault(_icon_fillter_header);

var _icon_close = require('../assets/icons/icon_close.svg');

var _icon_close2 = _interopRequireDefault(_icon_close);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _antd = require('antd');

var _const = require('../common/const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HeaderFilter = function HeaderFilter(_ref) {
  var columns = _ref.columns,
      filterData = _ref.filterData,
      changeFilterData = _ref.changeFilterData;

  var getLabelTitleFilter = function getLabelTitleFilter(item) {
    var col = columns.find(function (col) {
      return _lodash2.default.get(col, 'filterSource.field', '') === item;
    });

    return col && col.title ? col.title : item;
  };
  if (!filterData || _lodash2.default.isEmpty(filterData)) {
    return null;
  }
  return _react2.default.createElement(
    'div',
    { id: 'fwork-resource-filter', className: 'fwork-resource-filter' },
    _react2.default.createElement(
      'span',
      null,
      _react2.default.createElement('img', { src: _icon_fillter_header2.default }),
      _react2.default.createElement(
        'span',
        null,
        'B\u1ED9 L\u1ECDc:'
      )
    ),
    _react2.default.createElement(
      'ul',
      { className: 'fwork-list-item-filter' },
      Object.keys(filterData).map(function (item, index) {
        return _react2.default.createElement(
          'li',
          { key: index },
          getLabelTitleFilter(item),
          _lodash2.default.isArray(filterData[item]) ? _react2.default.createElement(
            _react.Fragment,
            null,
            _react2.default.createElement(
              'span',
              { style: { display: 'inline' } },
              ': ',
              _lodash2.default.get(filterData, ['' + item, '0', 'refData'], '')
            ),
            _react2.default.createElement(
              _antd.Popover,
              {
                overlayClassName: 'fwork-overlay-filter-table',
                content: _react2.default.createElement(
                  'ul',
                  { className: 'fwork-popover-clear-chexckbox' },
                  filterData[item] && filterData[item].length && filterData[item].map(function (obj, index) {
                    return _react2.default.createElement(
                      'li',
                      { key: index },
                      obj.refData,
                      _react2.default.createElement('img', {
                        src: _icon_close2.default,
                        onClick: function onClick() {
                          return changeFilterData({
                            type: _const.ACTIONS.REMOVE_BY_VALUE,
                            payload: {
                              value: obj.value,
                              field: item
                            }
                          });
                        }, style: { cursor: 'pointer' }
                      })
                    );
                  })
                ),
                trigger: 'click',
                placement: 'bottom'
              },
              _react2.default.createElement('img', { src: _icon_dropdown2.default, alt: 'icon Dropdown' })
            )
          ) : _react2.default.createElement(
            'span',
            { style: { display: 'inline' } },
            ': ',
            filterData[item]
          ),
          _react2.default.createElement('img', {
            src: _icon_close2.default,
            onClick: function onClick() {
              return changeFilterData({
                type: _const.ACTIONS.REMOVE_BY_FIELD,
                payload: { field: item }
              });
            }
          })
        );
      })
    ),
    _react2.default.createElement(
      'a',
      {
        onClick: function onClick() {
          return changeFilterData({ type: _const.ACTIONS.REMOVE_ALL });
        }
      },
      'X\xF3a t\u1EA5t c\u1EA3'
    )
  );
};

HeaderFilter.propTypes = process.env.NODE_ENV !== "production" ? {
  filterData: _propTypes2.default.object,
  changeFilterData: _propTypes2.default.func
} : {};

exports.default = HeaderFilter;
module.exports = exports['default'];