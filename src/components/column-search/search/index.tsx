import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { StaffSelect } from '@/components/select';
import Footer from '../footer';
import { FilterSelectProps } from '../interface';

const TableColumnSearch = ({ opts, filteredValue } = {} as FilterSelectProps) => ({
    ...(typeof filteredValue === 'string' ? { filteredValue: filteredValue ? [filteredValue] : [] } : {}),
    ...{
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
            <div style={{ padding: 8 }}>
                <StaffSelect
                    placeholder="请输入"
                    value={selectedKeys[0]}
                    onChange={value => setSelectedKeys(value ? [value] : [])}
                    style={{ marginBottom: 8, display: 'block', width: 200 }}
                    {...(opts || {})}
                />
                <Footer confirm={confirm} clearFilters={clearFilters} selectedKeys={selectedKeys} />
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#e6231f' : undefined }} />
    }
});

export default TableColumnSearch;
