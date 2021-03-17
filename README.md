# React table package
## Installation

```
$ npm install git+ssh://git@118.68.218.91:fpt.work/package/table-package.git
```

## Example

``` javascript
import React, {Component} from 'react'
import {TableCustom} from '@fwork/table-custom'
import history from 'src/services/common/history';

class Fwork extends Component {

  constructor() {
    super();
  }

  render() {
    return (<div>
      <TableCustom
        history={history} // history of this service
        fixedParam='tab=notification-script'
        columns={columsResource} 
        dataSource={resources}  // dataSource mapping from redux of this component
        pagination={paginationResource} // pagination mapping from redux of this component
        loading={loading} // loading mapping from redux of this component
        fetchingData={fetchResources} // fetching method from action of this component
        searchValue={this.state.searchValue}
        extendCondition={this.state.extendCondition}
      />
    </div>)
  }
}

``` columns inherit antd and must be defined type of filter data ```

// Type 1: Search

{
  title: 'Tài nguyên',
  filterSource: {
    field: 'name',
    type: TypeSearch.SEARCH // value == 1
  },
  dataIndex: 'name',
  width: '15%',
  minWidth: '200px', // if want to set minWidth for colum or default is 100px
  render:  ...
}

// Type 2: Checkbox

{
  title: 'Trạng thái',
  dataIndex: 'status',
  filterSource: {
    type: TypeSearch.CHECKBOX, // value == 2
    field: 'status',
    dataSearch: [{ value: true, refData: 'Active' }, { value: false, refData: 'Inactive' }]
  },
  width: '10%',
  render: ...
}

// Type 3: Search + Checkbox

{
  title: 'Nhóm tài nguyên',
  filterSource: {
    url: api.resourceGroup, // url fetch value cho từng popover search
    path: ['name'], // path để get giá trị hiển thị của từng columns
    field: 'group', // field name của popover
    dataKey: 'resourceGroups', // dataKeys lấy giữ liệu trả về
    type: TypeSearch.SEARCH_CHECKBOX  // value == 3
    
  },
  dataIndex: 'group.name',
  width: '20%',
  render: ...
},

// column nào không cần filter thì k defined object filterSource
// TableCustom keep state filterData: 
{
  ownerUser: [
    { refData: 'Nguyễn Văn A', value: '5ebdf0bbe59d3d0b0e6df613' },
    { refData: 'Nguyễn Văn A', value: '5ebdf0bbe59d3d0b0e6df613' }
  ],
  status: ['active', 'inactive'],
  name: 'Nguyễn ...'
}




