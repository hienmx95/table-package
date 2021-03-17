import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import IconDropdown from '../assets/icons/icon_dropdown.svg';
import IconFilterHeader from '../assets/icons/icon_fillter_header.svg';
import IconClose from '../assets/icons/icon_close.svg';
import _ from 'lodash';
import { Popover } from 'antd';
import { ACTIONS } from '../common/const';

var HeaderFilter = function HeaderFilter(_ref) {
  var columns = _ref.columns,
      filterData = _ref.filterData,
      changeFilterData = _ref.changeFilterData;

  var getLabelTitleFilter = function getLabelTitleFilter(item) {
    var col = columns.find(function (col) {
      return _.get(col, 'filterSource.field', '') === item;
    });

    return col && col.title ? col.title : item;
  };
  if (!filterData || _.isEmpty(filterData)) {
    return null;
  }
  return React.createElement(
    'div',
    { id: 'fwork-resource-filter', className: 'fwork-resource-filter' },
    React.createElement(
      'span',
      null,
      React.createElement('img', { src: IconFilterHeader }),
      React.createElement(
        'span',
        null,
        'B\u1ED9 L\u1ECDc:'
      )
    ),
    React.createElement(
      'ul',
      { className: 'fwork-list-item-filter' },
      Object.keys(filterData).map(function (item, index) {
        return React.createElement(
          'li',
          { key: index },
          getLabelTitleFilter(item),
          _.isArray(filterData[item]) ? React.createElement(
            Fragment,
            null,
            React.createElement(
              'span',
              { style: { display: 'inline' } },
              ': ',
              _.get(filterData, ['' + item, '0', 'refData'], '')
            ),
            React.createElement(
              Popover,
              {
                overlayClassName: 'fwork-overlay-filter-table',
                content: React.createElement(
                  'ul',
                  { className: 'fwork-popover-clear-chexckbox' },
                  filterData[item] && filterData[item].length && filterData[item].map(function (obj, index) {
                    return React.createElement(
                      'li',
                      { key: index },
                      obj.refData,
                      React.createElement('img', {
                        src: IconClose,
                        onClick: function onClick() {
                          return changeFilterData({
                            type: ACTIONS.REMOVE_BY_VALUE,
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
              React.createElement('img', { src: IconDropdown, alt: 'icon Dropdown' })
            )
          ) : React.createElement(
            'span',
            { style: { display: 'inline' } },
            ': ',
            filterData[item]
          ),
          React.createElement('img', {
            src: IconClose,
            onClick: function onClick() {
              return changeFilterData({
                type: ACTIONS.REMOVE_BY_FIELD,
                payload: { field: item }
              });
            }
          })
        );
      })
    ),
    React.createElement(
      'a',
      {
        onClick: function onClick() {
          return changeFilterData({ type: ACTIONS.REMOVE_ALL });
        }
      },
      'X\xF3a t\u1EA5t c\u1EA3'
    )
  );
};

HeaderFilter.propTypes = process.env.NODE_ENV !== "production" ? {
  filterData: PropTypes.object,
  changeFilterData: PropTypes.func
} : {};

export default HeaderFilter;