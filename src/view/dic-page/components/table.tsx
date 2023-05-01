import React, { useContext } from 'react';
import { Table, Space, Divider, Tag } from 'antd';
import IconSet from '@/components/icon';
import Ellipsis from '@/components/common/u-ellipsis';
import { GlobalContext } from '@/context';
import Export from '../modal/export';
import Update from '../modal/add';
import Del from '../modal/del';
import { delDic } from '@/axios';
import View from '../modal/view/index';

export default function DictTable(props) {
    const { loading, refresh, dataSource = [], read, model, subTitle, dictType } = props;
    const { dispatchDict } = useContext(GlobalContext);
    const rowSelection = {
        selectedRowKeys: props.selectedKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            dispatchDict?.(selectedRowKeys);
            props.setSelectedKeys(selectedRowKeys);
        },
        getCheckboxProps: record => ({
            id: record.id + ''
        })
    };

    const columns = [
        {
            title: subTitle + '名称',
            dataIndex: 'dictionaryName',
            key: 'dictionaryName',
            width: 140,
            read: read,
            render: (text, record) => {
                return read ? text : <View {...record} dictType={dictType} subTitle={subTitle} refresh={refresh} />;
            }
        },
        {
            title: subTitle + '描述',
            dataIndex: 'dictionaryDescribe',
            key: 'dictionaryDescribe',
            read: read,
            width: 300,
            render: text => <Ellipsis style={{ width: 300 }}>{text || '--'}</Ellipsis>
        },
        {
            title: '快捷键',
            dataIndex: 'keyName',
            key: 'keyName',
            read: read
        },
        {
            title: '标签颜色',
            dataIndex: 'color',
            key: 'color',
            read: read,
            render: text => {
                return <div style={{ background: text, width: 40, height: 8, borderRadius: 10 }} />;
            }
        },
        {
            title: '包含词量 (个)',
            dataIndex: 'wordsNum',
            key: 'words',
            width: 140
        },
        {
            title: subTitle + '容量 (字)',
            dataIndex: 'dictsContent',
            key: 'dictsContent',
            width: 140,
            hidden: dictType == 1
        },
        {
            title: '操作',
            width: 220,
            render: (text: string, record: any) => {
                return (
                    <Space>
                        <Update data={record} dictType={dictType} subTitle={subTitle} type="EDIT" refresh={refresh}>
                            <a>
                                <IconSet type="icon-bianji" /> 编辑
                            </a>
                        </Update>
                        <Divider type="vertical" />
                        <Export data={record} />
                        <Divider type="vertical" />
                        <Del dictType={dictType} id={record.id} func={delDic} refresh={refresh} />
                    </Space>
                );
            }
        }
    ];

    if (model == 'tag') {
        return (
            <>
                {dataSource.map(item => {
                    return (
                        <Tag color={item.color}>
                            {item.dictionaryName}（{item.keyName}）
                        </Tag>
                    );
                })}
            </>
        );
    }

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
