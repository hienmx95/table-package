'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _antd = require('antd');

var _Search = require('antd/lib/input/Search');

var _Search2 = _interopRequireDefault(_Search);

var _icon_setting = require('../assets/icons/icon_setting.svg');

var _icon_setting2 = _interopRequireDefault(_icon_setting);

var _icon_drag_handle = require('../assets/icons/icon_drag_handle.svg');

var _icon_drag_handle2 = _interopRequireDefault(_icon_drag_handle);

var _reactSortableHoc = require('react-sortable-hoc');

var _serviceWorker = require('./serviceWorker');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PopoverTableConfig = function (_Component) {
  _inherits(PopoverTableConfig, _Component);

  function PopoverTableConfig(props) {
    _classCallCheck(this, PopoverTableConfig);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.onChangeTableConfig = function (checkedValues) {
      var _this$props = _this.props,
          columnsInfo = _this$props.columnsInfo,
          setColumnsInfo = _this$props.setColumnsInfo;

      var newColumnsInfo = columnsInfo.map(function (item) {
        return _extends({}, item, { visible: checkedValues.includes(item.key) });
      });
      setColumnsInfo(newColumnsInfo);
    };

    _this.handleShowAll = function () {
      var _this$props2 = _this.props,
          columnsInfo = _this$props2.columnsInfo,
          setColumnsInfo = _this$props2.setColumnsInfo;

      var newColumnsInfo = columnsInfo.map(function (item) {
        return _extends({}, item, { visible: true });
      });
      setColumnsInfo(newColumnsInfo);
    };

    _this.handleSearch = (0, _serviceWorker.debounce)(function (searchValue) {
      _this.setState({ searchValue: searchValue });
    }, 300);

    _this.state = {
      searchValue: ''
    };
    return _this;
  }

  PopoverTableConfig.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        _props$columnsInfo = _props.columnsInfo,
        columnsInfo = _props$columnsInfo === undefined ? [] : _props$columnsInfo,
        onSortEnd = _props.onSortEnd,
        _props$columns = _props.columns,
        columns = _props$columns === undefined ? [] : _props$columns;
    var _state$searchValue = this.state.searchValue,
        searchValue = _state$searchValue === undefined ? '' : _state$searchValue;


    var DragHandle = (0, _reactSortableHoc.sortableHandle)(function () {
      return _react2.default.createElement('img', { src: _icon_drag_handle2.default });
    });
    var SortableItem = (0, _reactSortableHoc.SortableElement)(function (_ref) {
      var value = _ref.value;

      // only enable drag when search value empty
      var _value$title = value.title,
          title = _value$title === undefined ? '' : _value$title,
          disabled = value.default,
          key = value.key;

      var hidden = !title.toUpperCase().includes(searchValue.toUpperCase());
      return _react2.default.createElement(
        _antd.Row,
        { style: { display: hidden ? 'none' : 'block' } },
        _.isEmpty(searchValue) && _react2.default.createElement(DragHandle, null),
        _react2.default.createElement(
          _antd.Checkbox,
          { value: key, disabled: disabled },
          title
        )
      );
    });

    var Item = function Item(_ref2) {
      var value = _ref2.value;
      var _value$title2 = value.title,
          title = _value$title2 === undefined ? '' : _value$title2,
          disabled = value.default,
          key = value.key;

      var hidden = !title.toUpperCase().includes(searchValue.toUpperCase());
      return _react2.default.createElement(
        _antd.Row,
        { style: { display: hidden ? 'none' : 'block', paddingLeft: '27px' } },
        _react2.default.createElement(
          _antd.Checkbox,
          { value: key, disabled: disabled },
          title
        )
      );
    };

    var SortableList = (0, _reactSortableHoc.SortableContainer)(function (_ref3) {
      var columnsInfo = _ref3.columnsInfo,
          columns = _ref3.columns;

      return _react2.default.createElement(
        _antd.Checkbox.Group,
        {
          value: columnsInfo.filter(function (item) {
            return item.visible;
          }).map(function (item) {
            return item.key;
          }),
          style: { width: '100%' },
          onChange: _this2.onChangeTableConfig
        },
        columnsInfo.map(function (value, index) {
          var col = columns.find(function (col) {
            return col.key === value.key;
          }) || {};
          var _col$configTable = col.configTable,
              configTable = _col$configTable === undefined ? false : _col$configTable,
              _col$fixed = col.fixed,
              fixed = _col$fixed === undefined ? false : _col$fixed;

          return configTable || fixed ? _react2.default.createElement(Item, { key: value.key, value: value }) : _react2.default.createElement(SortableItem, { key: value.key, index: index, value: value });
        })
      );
    });

    return _react2.default.createElement(
      _react2.default.Fragment,
      null,
      _react2.default.createElement(
        _antd.Popover,
        {
          overlayClassName: 'fwork-config-table',
          placement: 'bottomRight',
          title: _react2.default.createElement(
            'div',
            { className: 'fwork-table-config-title' },
            _react2.default.createElement(
              'span',
              { className: 'fwork-title-left' },
              '\u1EA8n hi\u1EC7n/c\u1ED9t'
            ),
            _react2.default.createElement(
              'span',
              { className: 'fwork-title-right' },
              _react2.default.createElement(
                'a',
                { onClick: this.handleShowAll },
                'Hi\u1EC7n t\u1EA5t c\u1EA3'
              )
            )
          ),
          trigger: 'click',
          content: _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(_Search2.default, { placeholder: 'Nh\u1EADp th\xF4ng tin t\xECm ki\u1EBFm...', allowClear: true, onChange: function onChange(e) {
                var searchValue = e.target.value;
                _this2.handleSearch(searchValue);
              } }),
            _react2.default.createElement(SortableList, { axis: 'y', columnsInfo: columnsInfo, columns: columns, onSortEnd: onSortEnd, useDragHandle: true })
          ) },
        _react2.default.createElement(
          _antd.Button,
          { className: 'fwork-table-config-button' },
          _react2.default.createElement('img', { src: _icon_setting2.default })
        )
      )
    );
  };

  return PopoverTableConfig;
}(_react.Component);

exports.default = PopoverTableConfig;
module.exports = exports['default'];