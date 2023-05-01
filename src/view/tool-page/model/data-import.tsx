import React, { useState, useEffect } from 'react';
import { Tabs, Alert } from 'antd';
import DicTable from '@/view/dic-page';
import TextTable from '@/view/text-page';

const { TabPane } = Tabs;

/**
 *
 * @returns 数据导入
 */

export default function DataImport(props) {
    const { textType } = props;

    const [activeKey, setActiveKey] = useState('1');
    const [dicLength, setDicLength] = useState(0);
    const [textLength, setTextLength] = useState(0);

    const onChangeTabs = v => {
        setActiveKey(v);
    };

    useEffect(() => {
        var dictIds = localStorage.getItem('dictIds-' + textType)?.split(',');
        var textIds = localStorage.getItem('textIds-' + textType)?.split(',');
        setDicLength(dictIds?.length);
        setTextLength(textIds?.length);
    }, [textType]);

    return (
        <div className="m-data-import">
            <section>
                <Alert message={`字典选中：${dicLength} 个; 语料选中：${textLength} 个`} type="success" />
            </section>
            <section>
                <Tabs defaultActiveKey={activeKey} onChange={onChangeTabs}>
                    <TabPane tab="字典" key="1">
                        <DicTable read setDicLength={setDicLength} />
                    </TabPane>
                    <TabPane tab="语料" key="2">
                        <TextTable read setTextLength={setTextLength} />
                    </TabPane>
                </Tabs>
            </section>
        </div>
    );
}
