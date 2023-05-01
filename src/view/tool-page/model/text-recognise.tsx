import React, { useState, useContext } from 'react';
import { Form, Button, Select, message, Slider } from 'antd';
import useFetch from '@/hooks/common/useFetch';
import { GlobalContext } from '@/context';
import Table from '../components/table-list/index';
import { postModelMark, getModelSample } from '@/axios';

const { Option } = Select;
/**
 *
 * @returns 语料识别
 */
export default function TextRecognition(props) {
    const { textType } = props;
    const { refreshState } = useContext(GlobalContext);
    const [sliderValue, setSliderValue] = useState(1);
    const [update, setUpdate] = useState(0);
    const { dispatch, isLoading } = useFetch(postModelMark, null, false);
    const { dispatch: dispatchGetModelSample } = useFetch(getModelSample, null, false);

    const onFinish = values => {
        dispatch({
            ...values,
            textType,
            dictIds: localStorage.getItem('dictIds-' + textType)?.split(','),
            textIds: localStorage.getItem('textIds-' + textType)?.split(',')
        }).then(res => {
            refreshState();
            setUpdate(update + 1);
            message.success('操作成功');
        });
    };

    /**
     * 采样
     */
    const onSample = () => {
        console.log('采样');
        if (sliderValue) {
            dispatchGetModelSample({ rate: sliderValue / 100, textType }).then(res => {
                localStorage.setItem('labelState', 'model');
                refreshState();
                message.success('采样成功');
            });
        }
    };

    return (
        <div className="m-text-recognition">
            <section className="header">
                <div className="u-sample">
                    <div className="u-sample-content">
                        <span>采样率：</span>
                        <Slider min={1} max={100} value={sliderValue} onChange={v => setSliderValue(v)} />
                        <span>{sliderValue} %</span>
                    </div>
                    <Button type="primary" onClick={onSample}>
                        采样
                    </Button>
                </div>
                <Form
                    name="basic"
                    className="u-form"
                    layout="inline"
                    initialValues={{ model: 'BiLSTM' }}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onFinish}
                >
                    <Form.Item label="模型" name="model" rules={[{ required: true, message: '请输入' }]}>
                        <Select style={{ width: 120 }}>
                            <Option value="BiLSTM">BiLSTM</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button loading={isLoading} type="primary" htmlType="submit">
                            识别
                        </Button>
                    </Form.Item>
                </Form>
            </section>
            <section className="u-content">
                <Table type="pre" shouldUpdate={update} textType={textType} />
            </section>
        </div>
    );
}
