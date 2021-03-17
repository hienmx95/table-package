import React, { useCallback, useEffect, useState } from 'react';
import {
  Popover,
  Col,
  Checkbox
} from 'antd';
import Search from 'antd/lib/input/Search';
import iconFilter from '../assets/icons/icon_fillter.svg';
import { fetchAPI } from '@fwork/frontend-helper';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { debounce } from './serviceWorker';
import { TypeSearch, ACTIONS } from '../common/const';

const DEFAULT_PAGESIZE = 10;
const PopoverSearch = React.memo(({ type, field, filterData, dataSearch, path, url, dataKey, title, changeFilterData }) => {
  const [data, setData] = useState([]);
  const [keySearch, setKeySearch] = useState(type === TypeSearch.SEARCH && filterData ? filterData[field] : '');

  useEffect(() => {
    if (type === TypeSearch.SEARCH_CHECKBOX) {
      const params = {
        field,
        pageSize: DEFAULT_PAGESIZE
      };
      fetchAPI({
        url: url,
        method: 'GET',
        params
      })
        .then(resp => {
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

  useEffect(() => {
    if (type === TypeSearch.CHECKBOX) {
      setData(dataSearch);
    }
  }, [dataSearch]);

  const handleSearch = useCallback(debounce(searchValue => {
    if (type === TypeSearch.SEARCH_CHECKBOX) {
      const params = {
        path: path.join('.'),
        pageSize: DEFAULT_PAGESIZE,
        searchValue
      };
      fetchAPI({
        url: url,
        method: 'GET',
        params
      })
        .then(value => {
          if (dataKey) {
            setData(value.data.data[dataKey]);
          } else {
            setData(value.data.data);
          }
        });
    } else if (TypeSearch.SEARCH) {
      changeFilterData({ type: ACTIONS.ADD, payload: { type, field, value: searchValue } });
    }
  }, 500), []);

  const handleCheckBox = e => {
    const { value, refData } = e.target;
    if (e.target.checked) {
      changeFilterData({ type: ACTIONS.ADD, payload: { type, field, value, refData } });
    } else {
      changeFilterData({ type: ACTIONS.REMOVE_BY_VALUE, payload: { field, value } });
    }
  };

  const handleChangeKeySearch = (keySearch) => {
    setKeySearch(keySearch);
  };

  useEffect(() => {
    if (type === TypeSearch.SEARCH) {
      handleChangeKeySearch(filterData[field]);
    } else if (type === TypeSearch.SEARCH_CHECKBOX) {
      if (_.isEmpty(filterData[field])) {
        handleChangeKeySearch('');
      }
    }
  }, [filterData]);

  const getCheckedProp = (value) => {
    return filterData[field] && filterData[field].find((filter) => filter.value === value);
  };

  return (
    <React.Fragment>
      <Popover
        overlayClassName="fwork-overlay-filter-table"
        content={
          <div>
            {type === TypeSearch.SEARCH || type === TypeSearch.SEARCH_CHECKBOX ? <Search placeholder="Tìm kiếm" value={keySearch} onChange={e => {
              const searchValue = e.target.value;
              handleSearch(searchValue);
              handleChangeKeySearch(searchValue);
            }} /> : null}
            <div className="fwork-popover-checkbox-group">
              {_.isArray(data) && data.map(item => {
                if (_.has(item, 'value') && _.has(item, 'refData')) {
                  const { value, refData } = item;
                  return (
                    <Col span={24} key={item.value}>
                      <Checkbox
                        defaultChecked={false}
                        value={value}
                        refData={refData}
                        onChange={handleCheckBox}
                        checked={getCheckedProp(value)}
                      >{refData}</Checkbox>
                    </Col>);
                } else {
                  return (
                    <Col span={24} key={item._id}>
                      <Checkbox
                        defaultChecked={false}
                        value={item._id}
                        onChange={handleCheckBox}
                        refData={_.get(item, path)}
                        checked={getCheckedProp(item._id)}
                      >{_.get(item, path)}</Checkbox>
                    </Col>);
                }
              })
              }
            </div>
          </div>
        }
        trigger="click"
        placement="bottomLeft"
      >
        <span style={{ display: 'flex' }}>
          <span className="fwork-title-column">
            {title}
          </span>
          <img className="fwork-icon-filter-table" src={iconFilter} alt="icon filter" />
        </span>
      </Popover>
    </React.Fragment>
  );
});

PopoverSearch.propTypes = {
  field: PropTypes.string,
  url: PropTypes.string,
  path: PropTypes.array,
  dataKey: PropTypes.string,
  filterData: PropTypes.object,
  changeFilterData: PropTypes.func
};

export default PopoverSearch;
