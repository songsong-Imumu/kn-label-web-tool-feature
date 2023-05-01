import React, { useContext } from 'react';
import { Table, Space, Divider } from 'antd';
import IconSet from '@/components/icon';
import Ellipsis from '@/components/common/u-ellipsis';
import { GlobalContext } from '@/context';
import Export from '../modal/export';
import UpdateModal from '../modal/add';
import Del from '../modal/del';
import { delText } from '@/axios';
import View from '../modal/view/index';

export default function TextTable(props) {
    const { loading, refresh, dataSource, read, subTitle, textType } = props;
    const { dispatchText } = useContext(GlobalContext);

    const rowSelection = {
        selectedRowKeys: props.selectedKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            dispatchText?.(selectedRowKeys);
            props.setSelectedKeys(selectedRowKeys);
        },
        getCheckboxProps: record => ({
            id: record.id + ''
        })
    };

    const columns = [
        {
            title: subTitle + '名称',
            dataIndex: 'textsName',
            key: 'textsName',
            width: 140,
            read: read,
            render: (text, record) => {
                return read ? text : <View {...record} subTitle={subTitle} textType={textType} refresh={refresh} />;
            }
        },
        {
            title: subTitle + '描述',
            read: read,
            dataIndex: 'textsDescribe',
            key: 'textsDescribe',
            render: text => <Ellipsis style={{ width: 300 }}>{text || '--'}</Ellipsis>
        },
        {
            title: '包含词量 (个)',
            dataIndex: 'wordsNum',
            key: 'words',
            width: 140,
            render: (text, record) => text || '--'
        },
        {
            title: '语料容量 (字)',
            dataIndex: 'textsContent',
            key: 'textsContent',
            hidden: textType == 1,
            width: 140,
            render: (text, record) => text || '--'
        },
        {
            title: '操作',
            width: 220,
            render: (elem: any, row: any, index: number) => {
                return (
                    <Space>
                        {textType == 0 && (
                            <>
                                <UpdateModal data={row} subTitle={subTitle} textType={textType} type="EDIT" refresh={refresh}>
                                    <a>
                                        <IconSet type="icon-bianji" /> 编辑
                                    </a>
                                </UpdateModal>
                                <Divider type="vertical" />
                            </>
                        )}

                        <Export data={row} textType={textType} />
                        <Divider type="vertical" />
                        <Del textType={textType} id={row.id} func={delText} refresh={refresh} />
                    </Space>
                );
            }
        }
    ];
    return (
        <Table
            loading={loading}
            rowKey="id"
            rowSelection={rowSelection}
            dataSource={dataSource}
            columns={columns.filter(item => item.read == read && !item.hidden)}
            pagination={false}
        />
    );
}
