import React, { Component } from 'react';
import {
  Popover,
  Row,
  Checkbox,
  Button
} from 'antd';
import Search from 'antd/lib/input/Search';
import IconSetting from '../assets/icons/icon_setting.svg';
import IconDragHandle from '../assets/icons/icon_drag_handle.svg';
import { SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
import { debounce } from './serviceWorker';

class PopoverTableConfig extends Component {
  constructor (props) {
    super(props);
    this.state = {
      searchValue: ''
    };
  }

  onChangeTableConfig = (checkedValues) => {
    const { columnsInfo, setColumnsInfo } = this.props;
    const newColumnsInfo = columnsInfo.map(item => ({ ...item, visible: checkedValues.includes(item.key) }));
    setColumnsInfo(newColumnsInfo);
  }

  handleShowAll = () => {
    const { columnsInfo, setColumnsInfo } = this.props;
    const newColumnsInfo = columnsInfo.map(item => ({ ...item, visible: true }));
    setColumnsInfo(newColumnsInfo);
  }

  handleSearch = debounce(searchValue => {
    this.setState({ searchValue });
  }, 300);

  render () {
    const { columnsInfo = [], onSortEnd, columns = [] } = this.props;
    const { searchValue = '' } = this.state;

    const DragHandle = sortableHandle(() => <img src={IconDragHandle} />);
    const SortableItem = SortableElement(({ value }) => {
      // only enable drag when search value empty
      const { title = '', default: disabled, key } = value;
      const hidden = !title.toUpperCase().includes(searchValue.toUpperCase());
      return (<Row style={{ display: hidden ? 'none' : 'block' }}>
        {_.isEmpty(searchValue) && <DragHandle />}
        <Checkbox value={key} disabled={disabled}>{title}</Checkbox>
      </Row>);
    });

    const Item = ({ value }) => {
      const { title = '', default: disabled, key } = value;
      const hidden = !title.toUpperCase().includes(searchValue.toUpperCase());
      return (<Row style={{ display: hidden ? 'none' : 'block', paddingLeft: '27px' }}>
        <Checkbox value={key} disabled={disabled}>{title}</Checkbox>
      </Row>);
    };

    const SortableList = SortableContainer(({ columnsInfo, columns }) => {
      return (
        <Checkbox.Group
          value={columnsInfo.filter(item => item.visible).map(item => item.key)}
          style={{ width: '100%' }}
          onChange={this.onChangeTableConfig}
        >
          {columnsInfo
            .map((value, index) => {
              const col = columns.find(col => col.key === value.key) || {};
              const { configTable = false, fixed = false } = col;
              return ((configTable || fixed)
                ? <Item key={value.key} value={value}/>
                : <SortableItem key={value.key} index={index} value={value}/>);
            })}
        </Checkbox.Group>
      );
    });

    return (
      <React.Fragment>
        <Popover
          overlayClassName="fwork-config-table"
          placement="bottomRight"
          title={(<div className="fwork-table-config-title">
            <span className="fwork-title-left">Ẩn hiện/cột</span>
            <span className="fwork-title-right"><a onClick={this.handleShowAll} >Hiện tất cả</a></span>
          </div>)}
          trigger="click"
          content={
            <div>
              <Search placeholder="Nhập thông tin tìm kiếm..." allowClear={true} onChange={e => {
                const searchValue = e.target.value;
                this.handleSearch(searchValue);
              }} />
              <SortableList axis="y" columnsInfo={columnsInfo} columns={columns} onSortEnd={onSortEnd} useDragHandle={true} />
            </div>
          } >
          <Button className="fwork-table-config-button">
            <img src={IconSetting} />
          </Button>
        </Popover>
      </React.Fragment>
    );
  }
}

export default PopoverTableConfig;
