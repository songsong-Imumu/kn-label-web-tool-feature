/**
 * 搜素部分样式控制
 */

import React, { useState } from 'react';
import { Row, Col, Button, Form } from 'antd';
import { FormInstance, FormProps } from 'antd/lib/form';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import './index.less';

interface Props extends FormProps {
    mode?: 'common' | 'expandable'; // expandable展开模式
    form: FormInstance;
    itemSpan?: number;
    itemHeight?: number;
    gutter?: number;
    children: React.ReactNode;
    onSearch?: () => void;
    onReset?: () => void;
}

const FormSearch = (props: Props) => {
    const { itemSpan = 8, itemHeight = 56, mode = 'common', form, onSearch, onReset, gutter = 60, children, ...rest } = props;
    const [expand, setExpand] = useState(false);

    return (
        <div className="m-form-search">
            <Row className="m-form-search-content">
                <Col className="m-form" style={expand ? { height: 'auto' } : { height: itemHeight, overflow: 'hidden' }}>
                    <Form form={form} {...rest} style={{ marginRight: 60 }}>
                        <Row gutter={gutter}>
                            {React.Children.map(props.children, (itemNode, index) => (
                                <Col span={itemSpan} style={{ height: itemHeight }}>
                                    {itemNode}
                                </Col>
                            ))}
                        </Row>
                    </Form>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        onClick={() => {
                            onSearch && onSearch();
                        }}
                    >
                        查询
                    </Button>
                    <Button
                        onClick={() => {
                            onReset && onReset();
                        }}
                    >
                        重置
                    </Button>
                    {mode === 'expandable' && (
                        <a
                            onClick={() => {
                                setExpand(pre => !pre);
                            }}
                        >
                            {expand ? (
                                <>
                                    收起 <UpOutlined />
                                </>
                            ) : (
                                <>
                                    展开 <DownOutlined />
                                </>
                            )}
                        </a>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default FormSearch;
