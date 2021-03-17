import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import IconDropdown from '../assets/icons/icon_dropdown.svg';
import IconFilterHeader from '../assets/icons/icon_fillter_header.svg';
import IconClose from '../assets/icons/icon_close.svg';
import _ from 'lodash';
import {
  Popover
} from 'antd';
import {
  ACTIONS
} from '../common/const';

const HeaderFilter = ({ columns, filterData, changeFilterData }) => {
  const getLabelTitleFilter = (item) => {
    const col = columns.find(col => {
      return _.get(col, 'filterSource.field', '') === item;
    });

    return col && col.title ? col.title : item;
  };
  if (!filterData || _.isEmpty(filterData)) {
    return null;
  }
  return (
    <div id="fwork-resource-filter" className="fwork-resource-filter">
      <span>
        <img src={IconFilterHeader} />
        <span>Bộ Lọc:</span>
      </span>
      <ul className="fwork-list-item-filter">
        {
          Object.keys(filterData).map((item, index) => {
            return (
              <li key={index}>
                {getLabelTitleFilter(item)}
                {_.isArray(filterData[item])
                  ? <Fragment>
                    <span style={{ display: 'inline' }}>
                        : {_.get(filterData, [`${item}`, '0', 'refData'], '')}
                    </span>
                    <Popover
                      overlayClassName="fwork-overlay-filter-table"
                      content={<ul className="fwork-popover-clear-chexckbox">
                        {filterData[item] && filterData[item].length && filterData[item].map((obj, index) => {
                          return (
                            <li key={index}>{obj.refData}
                              <img
                                src={IconClose}
                                onClick={() => changeFilterData(
                                  {
                                    type: ACTIONS.REMOVE_BY_VALUE,
                                    payload: {
                                      value: obj.value,
                                      field: item
                                    }
                                  }
                                )
                                } style={{ cursor: 'pointer' }}
                              />
                            </li>);
                        }
                        )}
                      </ul>}
                      trigger="click"
                      placement="bottom"
                    >
                      <img src={IconDropdown} alt="icon Dropdown" />
                    </Popover>
                  </Fragment>
                  : <span style={{ display: 'inline' }}>
                      : {filterData[item]}
                  </span>}
                <img
                  src={IconClose}
                  onClick={
                    () => changeFilterData(
                      {
                        type: ACTIONS.REMOVE_BY_FIELD,
                        payload: { field: item }
                      })}
                />
              </li>
            );
          })
        }
      </ul>
      <a
        onClick={() => changeFilterData({ type: ACTIONS.REMOVE_ALL })}
      >Xóa tất cả</a>
    </div>
  );
};

HeaderFilter.propTypes = {
  filterData: PropTypes.object,
  changeFilterData: PropTypes.func
};

export default HeaderFilter;
