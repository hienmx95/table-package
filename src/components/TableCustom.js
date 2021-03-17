import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import HeaderFilter from './HeaderFilter';
import PopoverSearch from './PopoverSearch';
import PopoverTableConfig from './PopoverTableConfig';
import { isEqual } from 'lodash';
import '../scss/style.scss';
import { ACTIONS, TypeSearch } from '../common/const';
import {
  applyDataCallServer,
  arrayMove,
  getColumnsInfo,
  getDefaultFilterData,
  getDefaultPagination,
  setUrlParams,
  getColumnsWidth
} from './serviceWorker';
import { Table } from 'antd';

const PAGINATION_HEIGHT = 56;
const HEADER_TABLE_HEIGHT = 48; // 40 + 8 padding
const CURRENT_DEFAULT = 1;
const PAGESIZE_DEFAULT = 20;
const TOTAL_DEFAULT = 0;
const HEADER_FILTER_HEIGHT = 32;

const compareProps = (prevProps, nextProps) => {
  if (JSON.stringify(prevProps) !== JSON.stringify(nextProps)) {
    return false;
  }
  return true;
};

const usePrevPropsAndState = (props, state) => {
  const prevPropsAndStateRef = useRef({ props: null, state: null });
  const prevProps = prevPropsAndStateRef.current.props;
  const prevState = prevPropsAndStateRef.current.state;

  useEffect(() => {
    prevPropsAndStateRef.current = { props, state };
  });

  return { prevProps, prevState };
};

const useGetSnapshotBeforeUpdate = (cb, props, state) => {
  const { prevProps, prevState } = usePrevPropsAndState(props, state);
  const snapshot = useRef(null);

  const componentJustMounted = useRef(true);
  useLayoutEffect(() => {
    if (!componentJustMounted.current) {
      snapshot.current = cb(prevProps, prevState);
    }
    componentJustMounted.current = false;
  });

  const useComponentDidUpdate = cb => {
    useEffect(() => {
      if (!componentJustMounted.current) {
        cb(prevProps, prevState, snapshot.current);
      }
    });
  };

  return useComponentDidUpdate;
};

const TableCustom = (props) => {
  const [state, setState] = useState({
    columnsInfo: [],
    columns: [],
    searchValue: props.searchValue,
    extendCondition: props.extendCondition,
    fixedParam: props.extendCondition,
    filterData: getDefaultFilterData({ history: props.history, fixedParam: props.fixedParam, columns: props.columns })
  });
  const [widthScreen, setWidthScreen] = useState(0);
  const [heightScrollVertical, setHeightScrollVertical] = useState(1);
  const [tableColumns, setTableColumns] = useState([]);

  useEffect(() => {
    handleResize();
  }, [props.dataSource]);

  useEffect(() => {
    setState({
      ...state,
      searchValue: props.searchValue,
      extendCondition: props.extendCondition,
      fixedParam: props.extendCondition
    });
  }, [props]);

  useEffect(() => {
    getColumnsProps();
  }, [props.columns]);

  const useComponentDidUpdate = useGetSnapshotBeforeUpdate(
    (_, prevState) => {
      return !isEqual(prevState.filterData, state.filterData) || !isEqual(prevState.searchValue, state.searchValue) ||
        !isEqual(props.extendCondition, state.extendCondition);
    },
    props,
    state
  );

  useComponentDidUpdate((prevProps, prevState, snapshot) => {
    if (snapshot) {
      fetchData();
    }
  });

  useEffect(() => {
    initData();
    return () => {
      window.removeEventListener('resize', handleResize);
      const bodyTable = document.querySelector('#fwork-table .ant-table-body');
      if (bodyTable) bodyTable.removeEventListener('scroll', onScrollTable);
    };
  }, []);
  const initData = () => {
    // add event listener
    window.addEventListener('resize', handleResize);
    const bodyTable = document.querySelector('#fwork-table .ant-table-body');
    if (bodyTable) bodyTable.addEventListener('scroll', onScrollTable);

    // set height scroll for table
    handleResize();
    fetchData();
    if (props.code) {
      getColumnsFromTableConfig();
    }
  };

  const fetchData = () => {
    const { current = CURRENT_DEFAULT, pageSize = PAGESIZE_DEFAULT } = getDefaultPagination(props.history);
    const { filterData } = state;
    const { history, searchValue, extendCondition, fixedParam } = props;
    setUrlParams({ history, filterData, searchValue, extendCondition, fixedParam, current, pageSize });
    const params = {
      searchValue,
      extendCondition,
      filterData: applyDataCallServer(filterData),
      current,
      pageSize
    };
    props.fetchingData(params);
  };

  const getColumnsFromTableConfig = async () => {
    const columnsInfo = await getColumnsInfo(props.code);
    // get table_config
    setState({
      ...state,
      columnsInfo
    });
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const { columnsInfo } = state;
    setState({
      ...state,
      columnsInfo: arrayMove(columnsInfo, oldIndex, newIndex)
    });
  };

  const setHeightTable = (heightTable = 0) => {
    try {
      document
        .getElementById('fwork-table')
        .getElementsByClassName('ant-table-body')[0]
        .style.height = `${heightTable}px`;
      // eslint-disable-next-line no-empty
    } catch (err) {

    }
  };

  const onScrollTable = () => {
    try {
      const bodyTable = document.querySelector('#fwork-table .ant-table-body');
      const headerTable = document.querySelector('#fwork-table .ant-table-header');
      const fixedLeftTable = document.querySelector('#fwork-table .ant-table-fixed-left');
      const fixedRightTable = document.querySelector('#fwork-table .ant-table-fixed-right');
      headerTable.scrollLeft = bodyTable.scrollLeft;

      if (bodyTable.scrollLeft === 0) {
        // is left
        if (fixedLeftTable) fixedLeftTable.style.boxShadow = 'none';
        if (fixedRightTable) fixedRightTable.style.boxShadow = '-6px 0 6px -4px rgba(0,0,0,.15)';
      } else if (bodyTable.scrollLeft === bodyTable.scrollWidth - bodyTable.clientWidth) {
        // is right
        if (fixedRightTable) fixedRightTable.style.boxShadow = 'none';
        if (fixedLeftTable) fixedLeftTable.style.boxShadow = '6px 0 6px -4px rgba(0,0,0,.15)';
      } else {
        if (fixedLeftTable) fixedLeftTable.style.boxShadow = '6px 0 6px -4px rgba(0,0,0,.15)';
        if (fixedRightTable) fixedRightTable.style.boxShadow = '-6px 0 6px -4px rgba(0,0,0,.15)';
      }
      // eslint-disable-next-line no-empty
    } catch (err) {

    }
  };

  const handleResize = () => { // calc height table
    try {
      const offsetTop = document.querySelector('#fwork-table').getBoundingClientRect().top;
      const bodyHeight = document.body.getBoundingClientRect().height;
      let heightTable = 0;
      if (_.isEmpty(state.filterData)) {
        heightTable = bodyHeight - (offsetTop + HEADER_TABLE_HEIGHT) - PAGINATION_HEIGHT;
      } else {
        heightTable = bodyHeight - (offsetTop + HEADER_TABLE_HEIGHT + HEADER_FILTER_HEIGHT) - PAGINATION_HEIGHT;
      }
      const widthScreen = document.querySelector('#fwork-table .ant-table-body').getBoundingClientRect().width;
      setHeightScrollVertical(heightTable);
      setWidthScreen(widthScreen);
    } catch (err) {
      setHeightScrollVertical(0);
      setHeightTable(0);
    }
  };

  const changeFilterData = ({ type, payload }) => {
    const temp = {
      ...state.filterData
    };
    switch (type) {
      case ACTIONS.ADD: {
        const { type, field, value, refData } = payload;
        if (type === TypeSearch.SEARCH) {
          if (!value.length) {
            delete temp[field];
          } else {
            temp[field] = value;
          }
        } else if (type === TypeSearch.CHECKBOX || type === TypeSearch.SEARCH_CHECKBOX) {
          if (!(field in temp)) {
            temp[field] = [];
          }
          temp[field].push({ value, refData });
        }
        setState({
          ...state,
          filterData: temp
        });
        break;
      }
      case ACTIONS.REMOVE_BY_VALUE: {
        const { field, value } = payload;
        if (_.isArray(temp[field])) {
          temp[field] = temp[field].filter(item => !(item.value === value));
          if (temp[field].length === 0) {
            delete temp[field];
          }
        }
        setState({
          ...state,
          filterData: temp
        });
        break;
      }
      case ACTIONS.REMOVE_BY_FIELD: {
        const { field } = payload;
        delete temp[field];
        setState({
          ...state,
          filterData: temp
        });
        break;
      }
      case ACTIONS.REMOVE_ALL: {
        setState({
          ...state,
          filterData: {}
        });
        break;
      }
      default: {
        setState({
          ...state,
          filterData: temp
        });
      }
    }
  };

  const handleTableChange = (pagination) => {
    handleResize();
    const { current = CURRENT_DEFAULT, pageSize = PAGESIZE_DEFAULT } = pagination || {};
    const { filterData, searchValue, extendCondition, fixedParam } = state;
    const queryData = applyDataCallServer(filterData);
    const { history } = props;
    setUrlParams({ history, filterData, searchValue, extendCondition, fixedParam, current, pageSize });

    props.fetchingData({
      searchValue,
      filterData: queryData,
      extendCondition,
      current: current,
      pageSize: pageSize
    });
  };

  const setColumnsInfo = (columnsInfo) => {
    setState({
      ...state,
      columnsInfo: columnsInfo
    });
  };

  const setPaddingRightHeader = () => {
    try {
      const headerTable = document.querySelector('#fwork-table .ant-table-header');
      const bodyTable = document.querySelector('#fwork-table .ant-table-body');

      if (bodyTable.scrollHeight > bodyTable.clientHeight) {
        headerTable.style.paddingRight = '8px';
      } else {
        headerTable.style.paddingRight = '0px';
      }
      // eslint-disable-next-line no-empty
    } catch (error) {

    }
  };

  const getTitlePopoverSearch = () => {
    return props.columns.map(col => {
      const { title, filterSource } = col;

      if (!_.isEmpty(filterSource)) {
        return {
          ...col,
          title: (<PopoverSearch
            type={filterSource.type}
            field={filterSource.field}
            url={filterSource.url}
            path={filterSource.path}
            dataKey={filterSource.dataKey}
            dataSearch={filterSource.dataSearch}
            changeFilterData={changeFilterData}
            filterData={state.filterData}
            title={title}
          />)
        };
      } else {
        return col;
      }
    });
  };

  const getColumnsProps = () => {
    const { columnsInfo } = state;
    const columnsWithSearch = getTitlePopoverSearch();
    const columnsWidth = getColumnsWidth(props.columns, [], widthScreen);
    const newColumns = columnsWithSearch.map((col, index) => {
      const { key, title, filterSource, configTable, fixed = false } = col;
      const columnInfo = columnsInfo.find(o => o.key === key);
      const { sort = -1, visible = true } = columnInfo || {};

      const Title = () => {
        if (configTable) {
          return (<span className="fwork-title-column">
            <PopoverTableConfig
              columnsInfo={columnsInfo}
              columns={props.columns}
              onSortEnd={onSortEnd}
              setColumnsInfo={setColumnsInfo}
            />
          </span>);
        } else {
          return (<span className="fwork-title-column">
            {title}
          </span>);
        }
      };
      return {
        ...col,
        fixed: configTable ? 'right' : fixed,
        sort,
        visible,
        width: columnsWidth[index],
        ellipsis: false,
        title: !_.isEmpty(filterSource) ? title : <Title/>
      };
    })
      .filter(o => o.visible) // remove column disable
      .sort((a, b) => {
        if (a.sort === -1 || b.sort === -1) return 0;
        return a.sort - b.sort;
      }); // sort column by config
    setTableColumns(newColumns);
  };

  const { pageSize = PAGESIZE_DEFAULT, total = TOTAL_DEFAULT } = props.pagination || {};
  setPaddingRightHeader();
  return (
    <div id="fwork-table" className="fwork-table">
      <HeaderFilter
        filterData={state.filterData}
        changeFilterData={changeFilterData}
        columns={props.columns}
      />
      <Table
        {
          ...props
        }
        dataSource={props.dataSource}
        columns={tableColumns}
        pagination={(total > pageSize) ? props.pagination : false}
        scroll={{
          y: heightScrollVertical
        }}
        rowKey={record => record._id}
        onChange={handleTableChange}
        size="middle"
      />
    </div>
  );
};

export default React.memo(TableCustom, compareProps);
