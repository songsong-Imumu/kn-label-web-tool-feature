import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { FilterDropdownProps } from 'antd/es/table/interface';
import Footer from '../footer';
import { CommonProps } from '../interface';

const TableColumnInput = (props: CommonProps) => {
    const { opts = {}, filteredValue } = props || {};
    return {
        ...(typeof filteredValue === 'string' ? { filteredValue: filteredValue ? [filteredValue] : [] } : {}),
        ...{
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="请输入"
                        value={selectedKeys[0]}
                        onChange={value => {
                            setSelectedKeys(value ? [value.target.value] : []);
                        }}
                        style={{ marginBottom: 8, display: 'block', width: 200 }}
                        {...opts}
                    />
                    <Footer confirm={confirm} clearFilters={clearFilters} selectedKeys={selectedKeys} />
                </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#e6231f' : undefined }} />
        }
    };
};

export default TableColumnInput;
