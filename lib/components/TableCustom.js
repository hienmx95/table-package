'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _HeaderFilter = require('./HeaderFilter');

var _HeaderFilter2 = _interopRequireDefault(_HeaderFilter);

var _PopoverSearch = require('./PopoverSearch');

var _PopoverSearch2 = _interopRequireDefault(_PopoverSearch);

var _PopoverTableConfig = require('./PopoverTableConfig');

var _PopoverTableConfig2 = _interopRequireDefault(_PopoverTableConfig);

var _lodash = require('lodash');

require('../scss/style.scss');

var _const = require('../common/const');

var _serviceWorker = require('./serviceWorker');

var _antd = require('antd');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var PAGINATION_HEIGHT = 56;
var HEADER_TABLE_HEIGHT = 48; // 40 + 8 padding
var CURRENT_DEFAULT = 1;
var PAGESIZE_DEFAULT = 20;
var TOTAL_DEFAULT = 0;
var HEADER_FILTER_HEIGHT = 32;

var compareProps = function compareProps(prevProps, nextProps) {
  if (JSON.stringify(prevProps) !== JSON.stringify(nextProps)) {
    return false;
  }
  return true;
};

var usePrevPropsAndState = function usePrevPropsAndState(props, state) {
  var prevPropsAndStateRef = (0, _react.useRef)({ props: null, state: null });
  var prevProps = prevPropsAndStateRef.current.props;
  var prevState = prevPropsAndStateRef.current.state;

  (0, _react.useEffect)(function () {
    prevPropsAndStateRef.current = { props: props, state: state };
  });

  return { prevProps: prevProps, prevState: prevState };
};

var useGetSnapshotBeforeUpdate = function useGetSnapshotBeforeUpdate(cb, props, state) {
  var _usePrevPropsAndState = usePrevPropsAndState(props, state),
      prevProps = _usePrevPropsAndState.prevProps,
      prevState = _usePrevPropsAndState.prevState;

  var snapshot = (0, _react.useRef)(null);

  var componentJustMounted = (0, _react.useRef)(true);
  (0, _react.useLayoutEffect)(function () {
    if (!componentJustMounted.current) {
      snapshot.current = cb(prevProps, prevState);
    }
    componentJustMounted.current = false;
  });

  var useComponentDidUpdate = function useComponentDidUpdate(cb) {
    (0, _react.useEffect)(function () {
      if (!componentJustMounted.current) {
        cb(prevProps, prevState, snapshot.current);
      }
    });
  };

  return useComponentDidUpdate;
};

var TableCustom = function TableCustom(props) {
  var _useState = (0, _react.useState)({
    columnsInfo: [],
    columns: [],
    searchValue: props.searchValue,
    extendCondition: props.extendCondition,
    fixedParam: props.extendCondition,
    filterData: (0, _serviceWorker.getDefaultFilterData)({ history: props.history, fixedParam: props.fixedParam, columns: props.columns })
  }),
      state = _useState[0],
      setState = _useState[1];

  var _useState2 = (0, _react.useState)(0),
      widthScreen = _useState2[0],
      setWidthScreen = _useState2[1];

  var _useState3 = (0, _react.useState)(1),
      heightScrollVertical = _useState3[0],
      setHeightScrollVertical = _useState3[1];

  var _useState4 = (0, _react.useState)([]),
      tableColumns = _useState4[0],
      setTableColumns = _useState4[1];

  (0, _react.useEffect)(function () {
    handleResize();
  }, [props.dataSource]);

  (0, _react.useEffect)(function () {
    setState(_extends({}, state, {
      searchValue: props.searchValue,
      extendCondition: props.extendCondition,
      fixedParam: props.extendCondition
    }));
  }, [props]);

  (0, _react.useEffect)(function () {
    getColumnsProps();
  }, [props.columns]);

  var useComponentDidUpdate = useGetSnapshotBeforeUpdate(function (_, prevState) {
    return !(0, _lodash.isEqual)(prevState.filterData, state.filterData) || !(0, _lodash.isEqual)(prevState.searchValue, state.searchValue) || !(0, _lodash.isEqual)(props.extendCondition, state.extendCondition);
  }, props, state);

  useComponentDidUpdate(function (prevProps, prevState, snapshot) {
    if (snapshot) {
      fetchData();
    }
  });

  (0, _react.useEffect)(function () {
    initData();
    return function () {
      window.removeEventListener('resize', handleResize);
      var bodyTable = document.querySelector('#fwork-table .ant-table-body');
      if (bodyTable) bodyTable.removeEventListener('scroll', onScrollTable);
    };
  }, []);
  var initData = function initData() {
    // add event listener
    window.addEventListener('resize', handleResize);
    var bodyTable = document.querySelector('#fwork-table .ant-table-body');
    if (bodyTable) bodyTable.addEventListener('scroll', onScrollTable);

    // set height scroll for table
    handleResize();
    fetchData();
    if (props.code) {
      getColumnsFromTableConfig();
    }
  };

  var fetchData = function fetchData() {
    var _getDefaultPagination = (0, _serviceWorker.getDefaultPagination)(props.history),
        _getDefaultPagination2 = _getDefaultPagination.current,
        current = _getDefaultPagination2 === undefined ? CURRENT_DEFAULT : _getDefaultPagination2,
        _getDefaultPagination3 = _getDefaultPagination.pageSize,
        pageSize = _getDefaultPagination3 === undefined ? PAGESIZE_DEFAULT : _getDefaultPagination3;

    var filterData = state.filterData;
    var history = props.history,
        searchValue = props.searchValue,
        extendCondition = props.extendCondition,
        fixedParam = props.fixedParam;

    (0, _serviceWorker.setUrlParams)({ history: history, filterData: filterData, searchValue: searchValue, extendCondition: extendCondition, fixedParam: fixedParam, current: current, pageSize: pageSize });
    var params = {
      searchValue: searchValue,
      extendCondition: extendCondition,
      filterData: (0, _serviceWorker.applyDataCallServer)(filterData),
      current: current,
      pageSize: pageSize
    };
    props.fetchingData(params);
  };

  var getColumnsFromTableConfig = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var columnsInfo;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _serviceWorker.getColumnsInfo)(props.code);

            case 2:
              columnsInfo = _context.sent;

              // get table_config
              setState(_extends({}, state, {
                columnsInfo: columnsInfo
              }));

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function getColumnsFromTableConfig() {
      return _ref.apply(this, arguments);
    };
  }();

  var onSortEnd = function onSortEnd(_ref2) {
    var oldIndex = _ref2.oldIndex,
        newIndex = _ref2.newIndex;
    var columnsInfo = state.columnsInfo;

    setState(_extends({}, state, {
      columnsInfo: (0, _serviceWorker.arrayMove)(columnsInfo, oldIndex, newIndex)
    }));
  };

  var setHeightTable = function setHeightTable() {
    var heightTable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    try {
      document.getElementById('fwork-table').getElementsByClassName('ant-table-body')[0].style.height = heightTable + 'px';
      // eslint-disable-next-line no-empty
    } catch (err) {}
  };

  var onScrollTable = function onScrollTable() {
    try {
      var bodyTable = document.querySelector('#fwork-table .ant-table-body');
      var headerTable = document.querySelector('#fwork-table .ant-table-header');
      var fixedLeftTable = document.querySelector('#fwork-table .ant-table-fixed-left');
      var fixedRightTable = document.querySelector('#fwork-table .ant-table-fixed-right');
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
    } catch (err) {}
  };

  var handleResize = function handleResize() {
    // calc height table
    try {
      var offsetTop = document.querySelector('#fwork-table').getBoundingClientRect().top;
      var bodyHeight = document.body.getBoundingClientRect().height;
      var heightTable = 0;
      if (_.isEmpty(state.filterData)) {
        heightTable = bodyHeight - (offsetTop + HEADER_TABLE_HEIGHT) - PAGINATION_HEIGHT;
      } else {
        heightTable = bodyHeight - (offsetTop + HEADER_TABLE_HEIGHT + HEADER_FILTER_HEIGHT) - PAGINATION_HEIGHT;
      }
      var _widthScreen = document.querySelector('#fwork-table .ant-table-body').getBoundingClientRect().width;
      setHeightScrollVertical(heightTable);
      setWidthScreen(_widthScreen);
    } catch (err) {
      setHeightScrollVertical(0);
      setHeightTable(0);
    }
  };

  var changeFilterData = function changeFilterData(_ref3) {
    var type = _ref3.type,
        payload = _ref3.payload;

    var temp = _extends({}, state.filterData);
    switch (type) {
      case _const.ACTIONS.ADD:
        {
          var _type = payload.type,
              field = payload.field,
              value = payload.value,
              refData = payload.refData;

          if (_type === _const.TypeSearch.SEARCH) {
            if (!value.length) {
              delete temp[field];
            } else {
              temp[field] = value;
            }
          } else if (_type === _const.TypeSearch.CHECKBOX || _type === _const.TypeSearch.SEARCH_CHECKBOX) {
            if (!(field in temp)) {
              temp[field] = [];
            }
            temp[field].push({ value: value, refData: refData });
          }
          setState(_extends({}, state, {
            filterData: temp
          }));
          break;
        }
      case _const.ACTIONS.REMOVE_BY_VALUE:
        {
          var _field = payload.field,
              _value = payload.value;

          if (_.isArray(temp[_field])) {
            temp[_field] = temp[_field].filter(function (item) {
              return !(item.value === _value);
            });
            if (temp[_field].length === 0) {
              delete temp[_field];
            }
          }
          setState(_extends({}, state, {
            filterData: temp
          }));
          break;
        }
      case _const.ACTIONS.REMOVE_BY_FIELD:
        {
          var _field2 = payload.field;

          delete temp[_field2];
          setState(_extends({}, state, {
            filterData: temp
          }));
          break;
        }
      case _const.ACTIONS.REMOVE_ALL:
        {
          setState(_extends({}, state, {
            filterData: {}
          }));
          break;
        }
      default:
        {
          setState(_extends({}, state, {
            filterData: temp
          }));
        }
    }
  };

  var handleTableChange = function handleTableChange(pagination) {
    handleResize();

    var _ref4 = pagination || {},
        _ref4$current = _ref4.current,
        current = _ref4$current === undefined ? CURRENT_DEFAULT : _ref4$current,
        _ref4$pageSize = _ref4.pageSize,
        pageSize = _ref4$pageSize === undefined ? PAGESIZE_DEFAULT : _ref4$pageSize;

    var filterData = state.filterData,
        searchValue = state.searchValue,
        extendCondition = state.extendCondition,
        fixedParam = state.fixedParam;

    var queryData = (0, _serviceWorker.applyDataCallServer)(filterData);
    var history = props.history;

    (0, _serviceWorker.setUrlParams)({ history: history, filterData: filterData, searchValue: searchValue, extendCondition: extendCondition, fixedParam: fixedParam, current: current, pageSize: pageSize });

    props.fetchingData({
      searchValue: searchValue,
      filterData: queryData,
      extendCondition: extendCondition,
      current: current,
      pageSize: pageSize
    });
  };

  var setColumnsInfo = function setColumnsInfo(columnsInfo) {
    setState(_extends({}, state, {
      columnsInfo: columnsInfo
    }));
  };

  var setPaddingRightHeader = function setPaddingRightHeader() {
    try {
      var headerTable = document.querySelector('#fwork-table .ant-table-header');
      var bodyTable = document.querySelector('#fwork-table .ant-table-body');

      if (bodyTable.scrollHeight > bodyTable.clientHeight) {
        headerTable.style.paddingRight = '8px';
      } else {
        headerTable.style.paddingRight = '0px';
      }
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  var getTitlePopoverSearch = function getTitlePopoverSearch() {
    return props.columns.map(function (col) {
      var title = col.title,
          filterSource = col.filterSource;


      if (!_.isEmpty(filterSource)) {
        return _extends({}, col, {
          title: _react2.default.createElement(_PopoverSearch2.default, {
            type: filterSource.type,
            field: filterSource.field,
            url: filterSource.url,
            path: filterSource.path,
            dataKey: filterSource.dataKey,
            dataSearch: filterSource.dataSearch,
            changeFilterData: changeFilterData,
            filterData: state.filterData,
            title: title
          })
        });
      } else {
        return col;
      }
    });
  };

  var getColumnsProps = function getColumnsProps() {
    var columnsInfo = state.columnsInfo;

    var columnsWithSearch = getTitlePopoverSearch();
    var columnsWidth = (0, _serviceWorker.getColumnsWidth)(props.columns, [], widthScreen);
    var newColumns = columnsWithSearch.map(function (col, index) {
      var key = col.key,
          title = col.title,
          filterSource = col.filterSource,
          configTable = col.configTable,
          _col$fixed = col.fixed,
          fixed = _col$fixed === undefined ? false : _col$fixed;

      var columnInfo = columnsInfo.find(function (o) {
        return o.key === key;
      });

      var _ref5 = columnInfo || {},
          _ref5$sort = _ref5.sort,
          sort = _ref5$sort === undefined ? -1 : _ref5$sort,
          _ref5$visible = _ref5.visible,
          visible = _ref5$visible === undefined ? true : _ref5$visible;

      var Title = function Title() {
        if (configTable) {
          return _react2.default.createElement(
            'span',
            { className: 'fwork-title-column' },
            _react2.default.createElement(_PopoverTableConfig2.default, {
              columnsInfo: columnsInfo,
              columns: props.columns,
              onSortEnd: onSortEnd,
              setColumnsInfo: setColumnsInfo
            })
          );
        } else {
          return _react2.default.createElement(
            'span',
            { className: 'fwork-title-column' },
            title
          );
        }
      };
      return _extends({}, col, {
        fixed: configTable ? 'right' : fixed,
        sort: sort,
        visible: visible,
        width: columnsWidth[index],
        ellipsis: false,
        title: !_.isEmpty(filterSource) ? title : _react2.default.createElement(Title, null)
      });
    }).filter(function (o) {
      return o.visible;
    }) // remove column disable
    .sort(function (a, b) {
      if (a.sort === -1 || b.sort === -1) return 0;
      return a.sort - b.sort;
    }); // sort column by config
    setTableColumns(newColumns);
  };

  var _ref6 = props.pagination || {},
      _ref6$pageSize = _ref6.pageSize,
      pageSize = _ref6$pageSize === undefined ? PAGESIZE_DEFAULT : _ref6$pageSize,
      _ref6$total = _ref6.total,
      total = _ref6$total === undefined ? TOTAL_DEFAULT : _ref6$total;

  setPaddingRightHeader();
  return _react2.default.createElement(
    'div',
    { id: 'fwork-table', className: 'fwork-table' },
    _react2.default.createElement(_HeaderFilter2.default, {
      filterData: state.filterData,
      changeFilterData: changeFilterData,
      columns: props.columns
    }),
    _react2.default.createElement(_antd.Table, _extends({}, props, {
      dataSource: props.dataSource,
      columns: tableColumns,
      pagination: total > pageSize ? props.pagination : false,
      scroll: {
        y: heightScrollVertical
      },
      rowKey: function rowKey(record) {
        return record._id;
      },
      onChange: handleTableChange,
      size: 'middle'
    }))
  );
};

exports.default = _react2.default.memo(TableCustom, compareProps);
module.exports = exports['default'];