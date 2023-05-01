/**
 * 设置按钮弹窗模板
 * @param fetch      员工列表  必须
 * @param isLoading  loading  必须
 * @param hasForm    是否有from
 * @param beforeOpen 弹窗展开之前钩子,其返回值控制弹窗是否展示
 * @param onSuccess  弹窗确认成功回调
 * @param onError    弹窗确认错误回调
 */

import React, { useState } from 'react';
import { Form, Modal, message } from 'antd';
import { Store } from 'antd/es/form/interface';
import { FormInstance } from 'antd/es/form';
import { ModalFuncProps } from 'antd/es/modal';
import { BtnTplProps } from '@/components/btns/btn-tpl/interface';
import BtnModal from '@/components/btns/btn-modal';

const BtnTpl = (props: BtnTplProps) => {
    const { onSuccess, onError, cancelHandle, fetch, render, hasForm, beforeOpen, ...rest } = props;
    const [visible, setVisible] = useState(false);

    const form = hasForm ? Form.useForm()[0] : null;

    const showModal = async () => {
        try {
            // 获取beforeOpen返回值，无beforeOpen默认为true
            const res = beforeOpen ? await beforeOpen(() => setVisible(false)) : true;
            // beforeOpen返回true展示弹窗，false不展示，什么都不返回默认展示弹窗
            setVisible(res ?? true);
        } finally {
            // 重置form数据
            form && form.resetFields();
        }
    };

    const onCancel = () => {
        setVisible(false);
        cancelHandle && cancelHandle();
    };

    /**
     * 一、没有form
     * 1.请求
     * 2.setVisible(false)
     * 二、有form
     * 1.执行form.submit()
     * 2.onFinish获取form数据
     * 3.发生请求
     * 4.setVisible(false)
     */
    const onOk = () => {
        form && form.submit();
    };

    const onFinish = async (values: Store) => {
        if (!fetch) return;
        try {
            const res = await fetch(values);
            onSuccess && onSuccess(res, values);
            message.success('操作成功');
            setVisible(false);
        } catch (err) {
            // 有onError回调使用onError，若不存在同一处理code400错误
            if (onError) {
                onError(err, () => setVisible(false));
            } else {
                if (err.code === 400) {
                    const config: ModalFuncProps = { title: '操作失败', content: err.msg, okText: '关闭' };
                    onSuccess &&
                        (config.onOk = () => {
                            onSuccess();
                        });
                    Modal.error(config);
                    setVisible(false);
                }
            }
        }
    };

    return (
        <BtnModal
            {...rest}
            visible={visible}
            showModal={showModal}
            onCancel={onCancel}
            onOk={form ? onOk : onFinish}
            render={() => render && render(form as FormInstance, onFinish)}
        />
    );
};

export default BtnTpl;
