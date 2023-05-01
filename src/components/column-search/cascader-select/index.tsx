import React from 'react';
import { Cascader } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { FilterSelectProps } from '../interface';
import Footer from '../footer';

const TableColumnCascader = ({ list = [], opts = {}, filteredValue }: FilterSelectProps) => {
  const { fieldNames: { label = 'label' } = {} } = opts;
  return {
    ...(typeof filteredValue === 'string' ? { filteredValue: filteredValue ? [filteredValue] : [] } : {}),
    ...{
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
        <div style={{ padding: 8 }}>
          <Cascader
            placeholder="请选择"
            changeOnSelect
            options={list}
            value={selectedKeys}
            onChange={(value, selectedOptions) => setSelectedKeys(value ? value : [])}
            showSearch={{
              filter: (inputValue, path) =>
                path.some((option: Record<string, any>) => option[label].toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
            }}
            expandTrigger="hover"
            {...opts}
            style={{ marginBottom: 8, display: 'block', width: 200 }}
          />
          <Footer confirm={confirm} clearFilters={clearFilters} selectedKeys={selectedKeys} />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#e6231f' : undefined }} />
    }
  };
};

export default TableColumnCascader;
