import queryString from 'query-string';
import { fetchAPI } from '@fwork/frontend-helper';
import _ from 'lodash';

const CURRENT_DEFAULT = 1;
const PAGESIZE_DEFAULT = 20;
const COLUMN_WIDTH_DEFAULT = '100px';
const SCROLL_WIDTH = 8;
const TABLE_CONFIG_BACKEND = (process.env.FWORK_API_ENDPOINT || 'https://dev.fpt.work/api/v1') + '/table-config';

function applyDataCallServer (filterData) {
  const temp = _.cloneDeep(filterData);
  for (const key in temp) {
    if (Array.isArray(temp[key])) {
      temp[key] = temp[key].map(item => item.value);
    }
  }
  return temp;
}

function debounce (a, b, c) {
  let d, e;
  return function () {
    function h () {
      d = null;
      c || (e = a.apply(f, g));
    }
    const f = this;
    const g = arguments;
    return (
      clearTimeout(d), (d = setTimeout(h, b)), c && !d && (e = a.apply(f, g)), e
    );
  };
}

function parseData (filterData, fields) {
  const temp = _.cloneDeep(filterData);
  for (const key in temp) {
    if (Array.isArray(temp[key])) {
      temp[key] = temp[key].map(item => JSON.parse(item));
    } else if (!fields.includes(key)) {
      delete temp[key];
    }
  }
  return temp;
}

function stringifyData (filterData) {
  const temp = _.cloneDeep(filterData);
  for (const key in temp) {
    if (Array.isArray(temp[key])) {
      temp[key] = temp[key].map(item => JSON.stringify(item));
    }
  }
  return temp;
}

function getDefaultFilterData ({ history = {}, fixedParam = '', columns = [] }) {
  try {
    const fields = columns.filter(col => col.filterSource)
      .map(col => col.filterSource.field);
    const search = _.get(history, 'location.search', '');
    const searchRemoveFixedParam = _.replace(search, fixedParam, '');
    const urlParams = queryString.parse(searchRemoveFixedParam, { arrayFormat: 'bracket' });
    return parseData(urlParams, fields);
  } catch (error) {
    console.log(error);
    return {};
  }
}

function getDefaultFilterDataOnlyFixed ({ history = {}, fixedParam = '', columns = [] }) {
  try {
    const fields = columns.filter(col => col.filterSource)
      .map(col => col.filterSource.field);
    const search = _.get(history, 'location.search', '');
    const searchRemoveFixedParam = _.replace(search, fixedParam, '');
    const urlParams = queryString.parse(searchRemoveFixedParam, { arrayFormat: 'bracket' });
    return parseData(urlParams, fields);
  } catch (error) {
    console.log(error);
    return {};
  }
}

function getDefaultPagination (history = {}) {
  try {
    const search = _.get(history, 'location.search', '');
    const urlParams = queryString.parse(search, { arrayFormat: 'bracket' });
    const { pageSize = PAGESIZE_DEFAULT, current = CURRENT_DEFAULT } = urlParams;
    return { pageSize, current };
  } catch (error) {
    console.log(error);
    return { current: CURRENT_DEFAULT, pageSize: PAGESIZE_DEFAULT };
  }
}

function setUrlParams ({ history = {}, filterData = {}, searchValue = '', extendCondition = {}, fixedParam = '', current = CURRENT_DEFAULT, pageSize = PAGESIZE_DEFAULT }) {
  try {
    const params = {
      ...stringifyData(filterData),
      ...stringifyData(extendCondition),
      searchValue,
      current,
      pageSize
    };
    // remove empty param
    for (const key in params) {
      if (_.isEmpty(params[key]) && !_.isNumber(params[key])) {
        delete params[key];
      }
    }

    let urlParam = queryString.stringify(params, { arrayFormat: 'bracket' });

    if (!_.isEmpty(fixedParam)) {
      urlParam = urlParam.replace(/(?!=^.{0})/, `${fixedParam}&`);
    }
    history.push({ search: urlParam });
  } catch (error) {
    console.log(error);
  }
}

function getUrlParams (history) {
  try {
    const paramsOuter = ['pageSize', 'current', 'searchValue', 'extendCondition'];
    const search = _.get(history, 'location.search', '');
    const urlParams = queryString.parse(search, { arrayFormat: 'bracket' });
    const filterData = {};
    for (const key in urlParams) {
      if (_.isArray(urlParams[key])) {
        urlParams[key] = urlParams[key].map(item => JSON.parse(item).value);
      }
      if (['pageSize', 'current'].includes(key)) {
        urlParams[key] = parseInt(urlParams[key]);
      }
      if (!paramsOuter.includes(key)) {
        filterData[key] = urlParams[key];
        delete urlParams[key];
      }
    }

    urlParams.filterData = filterData;
    return urlParams;
  } catch (error) {
    console.log(error);
    return {};
  }
}

function isPercentWidth (width = 0) {
  return width[width.length - 1] === '%';
}
function getColumnsWidth (columns = [], oldColumnsWidth = [], widthScreen = 0) {
  widthScreen -= SCROLL_WIDTH;
  try {
    if (_.isEmpty(oldColumnsWidth)) {
      oldColumnsWidth = columns.map(col => {
        const minWidth = _.get(col, 'minWidth', COLUMN_WIDTH_DEFAULT);
        return _.get(col, 'width', minWidth);
      });
    }
    const abstractWidth = oldColumnsWidth.reduce((total, next) => {
      if (isPercentWidth(next)) {
        const percentThisColumn = parseFloat(next.substring(0, next.length - 1));
        const thisWidth = widthScreen * percentThisColumn / 100;
        return total + thisWidth;
      } else {
        return total + parseFloat(next);
      }
    }, 0);
    let columnsWidth = [];
    if (abstractWidth > widthScreen) { // case 1:
      const totalPercentColumn = oldColumnsWidth
        .filter(width => isPercentWidth(width))
        .reduce((total, next) => total + parseFloat(next.substring(0, next.length - 1)), 0);

      const totalPixel = oldColumnsWidth
        .filter(width => !isPercentWidth(width))
        .reduce((total, next) => total + parseFloat(next), 0);

      columnsWidth = columns.map((col, index) => {
        const { width = 0, minWidth = COLUMN_WIDTH_DEFAULT } = col;
        if (isPercentWidth(width)) {
          const percentThisColumn = parseFloat(width.substring(0, width.length - 1));
          const pixelWidth = (widthScreen - totalPixel) * percentThisColumn / totalPercentColumn;
          return parseFloat(pixelWidth) > parseFloat(minWidth) ? width : minWidth;
        } else {
          return parseFloat(width) > parseFloat(minWidth) ? width : minWidth;
        }
      });
    } else { // case 2:
      const rate = widthScreen / abstractWidth;
      columnsWidth = columns.map((col, index) => {
        const { width = 0, minWidth = COLUMN_WIDTH_DEFAULT } = col;
        if (isPercentWidth(width)) {
          const percentThisColumn = parseFloat(width.substring(0, width.length - 1));
          const pixelWidth = widthScreen * percentThisColumn / 100;
          const realWidth = pixelWidth * rate;
          return parseFloat(realWidth) > parseFloat(minWidth) ? width : minWidth;
        } else {
          const realWidth = parseFloat(width) * rate;
          return parseFloat(realWidth) > parseFloat(minWidth) ? realWidth : minWidth;
        }
      });
    }

    if (!_.isEqual(columnsWidth, oldColumnsWidth)) {
      return getColumnsWidth(columns, columnsWidth, widthScreen);
    }
    return columnsWidth;
  } catch (error) {
    console.log(error);
    return columns.map(col => COLUMN_WIDTH_DEFAULT);
  }
}

function arrayMove (array, oldIndex, newIndex) {
  if (!array[oldIndex] || !array[newIndex]) return array;
  let newArray = [];
  try {
    if (oldIndex < newIndex) {
      newArray = array.map((o, index) => {
        if (index > oldIndex && index <= newIndex) {
          return { ...o, sort: o.sort - 1 };
        } else if (index === oldIndex) {
          return { ...o, sort: newIndex + 1 };
        }
        return o;
      });
    } else {
      newArray = array.map((o, index) => {
        if (index < oldIndex && index >= newIndex) {
          return { ...o, sort: o.sort + 1 };
        } else if (index === oldIndex) {
          return { ...o, sort: newIndex + 1 };
        }
        return o;
      });
    }
    return newArray.sort((a, b) => a.sort - b.sort);
  } catch (error) {
    console.log(error);
    return array;
  }
}

async function getColumnsInfo (code) {
  try {
    const url = `${TABLE_CONFIG_BACKEND}`;
    const { data: resp } = await fetchAPI({
      url: url,
      method: 'GET',
      params: { tableCode: code }
    });
    if (resp.success) {
      return resp.data.columnsInfo || [];
    }
    return [];
  } catch (error) {
    return [];
  }
}

async function updateColumnsInfo (code, columnsInfo) {
  try {
    const url = `${TABLE_CONFIG_BACKEND}/${code}`;
    const { data: resp } = await fetchAPI({
      url: url,
      method: 'PATCH',
      body: { columnsInfo }
    });
    if (resp.success) {
      return resp.data.columnsInfo || [];
    }
  } catch (error) {
    return columnsInfo;
  }
}

export {
  applyDataCallServer,
  debounce,
  getDefaultFilterData,
  setUrlParams,
  getDefaultPagination,
  getUrlParams,
  getColumnsWidth,
  arrayMove,
  getColumnsInfo,
  updateColumnsInfo,
  getDefaultFilterDataOnlyFixed
};
