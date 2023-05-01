import React from 'react';
import { Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { FilterSelectProps } from '../interface';
import Footer from '../footer';

const TableColumnSelect = ({ list = [], opts = {}, filteredValue }: FilterSelectProps) => {
    const { mode } = opts;
    return {
        ...(typeof filteredValue === 'string' ? { filteredValue: filteredValue ? [filteredValue] : [] } : {}),
        ...{
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
                <div style={{ padding: 8 }}>
                    <Select
                        showSearch
                        placeholder="请选择"
                        value={mode ? selectedKeys : selectedKeys[0]}
                        onChange={value => {
                            setSelectedKeys(value ? (mode ? value : [value]) : []);
                        }}
                        optionFilterProp="children"
                        filterOption={(input, option: any) => option.children.indexOf(input) >= 0}
                        style={{ marginBottom: 8, display: 'block', width: 200 }}
                        {...(opts || {})}
                    >
                        {list.map((item: any) => (
                            <Select.Option key={item.id} value={item.id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                    <Footer confirm={confirm} clearFilters={clearFilters} selectedKeys={selectedKeys} />
                </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#e6231f' : undefined }} />
        }
    };
};

export default TableColumnSelect;
