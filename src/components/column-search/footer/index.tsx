import React from 'react';
import { Space, Button } from 'antd';

interface Props {
    confirm: Function;
    clearFilters: Function | undefined;
    selectedKeys: any;
}

const Footer = (props: Props) => {
    const { confirm, clearFilters, selectedKeys } = props;
    return (
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button
                disabled={!selectedKeys?.length}
                onClick={() => {
                    clearFilters && clearFilters();
                }}
                size="small"
                type="link"
            >
                重置
            </Button>
            <Button type="primary" onClick={() => confirm && confirm()} size="small">
                查询
            </Button>
        </Space>
    );
};

export default Footer;
