import React, { useCallback, useEffect, useState } from 'react';
import { Popover, Col, Checkbox } from 'antd';
import Search from 'antd/lib/input/Search';
import iconFilter from '../assets/icons/icon_fillter.svg';
import { fetchAPI } from '@fwork/frontend-helper';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { debounce } from './serviceWorker';
import { TypeSearch, ACTIONS } from '../common/const';

var DEFAULT_PAGESIZE = 10;
var PopoverSearch = React.memo(function (_ref) {
  var type = _ref.type,
      field = _ref.field,
      filterData = _ref.filterData,
      dataSearch = _ref.dataSearch,
      path = _ref.path,
      url = _ref.url,
      dataKey = _ref.dataKey,
      title = _ref.title,
      changeFilterData = _ref.changeFilterData;

  var _useState = useState([]),
      data = _useState[0],
      setData = _useState[1];

  var _useState2 = useState(type === TypeSearch.SEARCH && filterData ? filterData[field] : ''),
      keySearch = _useState2[0],
      setKeySearch = _useState2[1];

  useEffect(function () {
    if (type === TypeSearch.SEARCH_CHECKBOX) {
      var params = {
        field: field,
        pageSize: DEFAULT_PAGESIZE
      };
      fetchAPI({
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

  useEffect(function () {
    if (type === TypeSearch.CHECKBOX) {
      setData(dataSearch);
    }
  }, [dataSearch]);

  var handleSearch = useCallback(debounce(function (searchValue) {
    if (type === TypeSearch.SEARCH_CHECKBOX) {
      var params = {
        path: path.join('.'),
        pageSize: DEFAULT_PAGESIZE,
        searchValue: searchValue
      };
      fetchAPI({
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
    } else if (TypeSearch.SEARCH) {
      changeFilterData({ type: ACTIONS.ADD, payload: { type: type, field: field, value: searchValue } });
    }
  }, 500), []);

  var handleCheckBox = function handleCheckBox(e) {
    var _e$target = e.target,
        value = _e$target.value,
        refData = _e$target.refData;

    if (e.target.checked) {
      changeFilterData({ type: ACTIONS.ADD, payload: { type: type, field: field, value: value, refData: refData } });
    } else {
      changeFilterData({ type: ACTIONS.REMOVE_BY_VALUE, payload: { field: field, value: value } });
    }
  };

  var handleChangeKeySearch = function handleChangeKeySearch(keySearch) {
    setKeySearch(keySearch);
  };

  useEffect(function () {
    if (type === TypeSearch.SEARCH) {
      handleChangeKeySearch(filterData[field]);
    } else if (type === TypeSearch.SEARCH_CHECKBOX) {
      if (_.isEmpty(filterData[field])) {
        handleChangeKeySearch('');
      }
    }
  }, [filterData]);

  var getCheckedProp = function getCheckedProp(value) {
    return filterData[field] && filterData[field].find(function (filter) {
      return filter.value === value;
    });
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      Popover,
      {
        overlayClassName: 'fwork-overlay-filter-table',
        content: React.createElement(
          'div',
          null,
          type === TypeSearch.SEARCH || type === TypeSearch.SEARCH_CHECKBOX ? React.createElement(Search, { placeholder: 'T\xECm ki\u1EBFm', value: keySearch, onChange: function onChange(e) {
              var searchValue = e.target.value;
              handleSearch(searchValue);
              handleChangeKeySearch(searchValue);
            } }) : null,
          React.createElement(
            'div',
            { className: 'fwork-popover-checkbox-group' },
            _.isArray(data) && data.map(function (item) {
              if (_.has(item, 'value') && _.has(item, 'refData')) {
                var value = item.value,
                    refData = item.refData;

                return React.createElement(
                  Col,
                  { span: 24, key: item.value },
                  React.createElement(
                    Checkbox,
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
                return React.createElement(
                  Col,
                  { span: 24, key: item._id },
                  React.createElement(
                    Checkbox,
                    {
                      defaultChecked: false,
                      value: item._id,
                      onChange: handleCheckBox,
                      refData: _.get(item, path),
                      checked: getCheckedProp(item._id)
                    },
                    _.get(item, path)
                  )
                );
              }
            })
          )
        ),
        trigger: 'click',
        placement: 'bottomLeft'
      },
      React.createElement(
        'span',
        { style: { display: 'flex' } },
        React.createElement(
          'span',
          { className: 'fwork-title-column' },
          title
        ),
        React.createElement('img', { className: 'fwork-icon-filter-table', src: iconFilter, alt: 'icon filter' })
      )
    )
  );
});

PopoverSearch.propTypes = process.env.NODE_ENV !== "production" ? {
  field: PropTypes.string,
  url: PropTypes.string,
  path: PropTypes.array,
  dataKey: PropTypes.string,
  filterData: PropTypes.object,
  changeFilterData: PropTypes.func
} : {};

export default PopoverSearch;