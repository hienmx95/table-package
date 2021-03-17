var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import { Popover, Row, Checkbox, Button } from 'antd';
import Search from 'antd/lib/input/Search';
import IconSetting from '../assets/icons/icon_setting.svg';
import IconDragHandle from '../assets/icons/icon_drag_handle.svg';
import { SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
import { debounce } from './serviceWorker';

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

    _this.handleSearch = debounce(function (searchValue) {
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


    var DragHandle = sortableHandle(function () {
      return React.createElement('img', { src: IconDragHandle });
    });
    var SortableItem = SortableElement(function (_ref) {
      var value = _ref.value;

      // only enable drag when search value empty
      var _value$title = value.title,
          title = _value$title === undefined ? '' : _value$title,
          disabled = value.default,
          key = value.key;

      var hidden = !title.toUpperCase().includes(searchValue.toUpperCase());
      return React.createElement(
        Row,
        { style: { display: hidden ? 'none' : 'block' } },
        _.isEmpty(searchValue) && React.createElement(DragHandle, null),
        React.createElement(
          Checkbox,
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
      return React.createElement(
        Row,
        { style: { display: hidden ? 'none' : 'block', paddingLeft: '27px' } },
        React.createElement(
          Checkbox,
          { value: key, disabled: disabled },
          title
        )
      );
    };

    var SortableList = SortableContainer(function (_ref3) {
      var columnsInfo = _ref3.columnsInfo,
          columns = _ref3.columns;

      return React.createElement(
        Checkbox.Group,
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

          return configTable || fixed ? React.createElement(Item, { key: value.key, value: value }) : React.createElement(SortableItem, { key: value.key, index: index, value: value });
        })
      );
    });

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        Popover,
        {
          overlayClassName: 'fwork-config-table',
          placement: 'bottomRight',
          title: React.createElement(
            'div',
            { className: 'fwork-table-config-title' },
            React.createElement(
              'span',
              { className: 'fwork-title-left' },
              '\u1EA8n hi\u1EC7n/c\u1ED9t'
            ),
            React.createElement(
              'span',
              { className: 'fwork-title-right' },
              React.createElement(
                'a',
                { onClick: this.handleShowAll },
                'Hi\u1EC7n t\u1EA5t c\u1EA3'
              )
            )
          ),
          trigger: 'click',
          content: React.createElement(
            'div',
            null,
            React.createElement(Search, { placeholder: 'Nh\u1EADp th\xF4ng tin t\xECm ki\u1EBFm...', allowClear: true, onChange: function onChange(e) {
                var searchValue = e.target.value;
                _this2.handleSearch(searchValue);
              } }),
            React.createElement(SortableList, { axis: 'y', columnsInfo: columnsInfo, columns: columns, onSortEnd: onSortEnd, useDragHandle: true })
          ) },
        React.createElement(
          Button,
          { className: 'fwork-table-config-button' },
          React.createElement('img', { src: IconSetting })
        )
      )
    );
  };

  return PopoverTableConfig;
}(Component);

export default PopoverTableConfig;