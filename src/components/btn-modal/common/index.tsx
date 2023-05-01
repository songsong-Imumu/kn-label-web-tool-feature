/**
 * 按钮+弹窗组件
 */

import React, { ReactNode, useState, useEffect } from 'react';
import { Button, Modal, Form, notification } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { FormInstance } from 'antd/es/form';
import { ButtonType } from 'antd/lib/button';

import './index.less';

export interface BtnModalProps extends Omit<ModalProps, 'onCancel' | 'onOk'> {
    btnText?: string; // 按钮文本（使用默认按钮生效）
    btnType?: ButtonType; // 按钮antd类型（使用默认按钮生效）
    disabled?: boolean; // 是否灰置
    children?: ReactNode; // 子节点
    render?: (val: Render) => ReactNode; // 内容渲染函数
    fetch?: (data: any, params?: any) => Promise<any>; // 确认按钮请求函数
    hasForm?: boolean; // 弹窗是否使用form
    onSuccess?: Function; // 确认后请求成功回调
    onError?: (err: any, close: Function) => void; // 确认后请求失败回调
    beforeOpen?: (close: Function) => Promise<any> | any; // 打开弹窗前的请求
    className?: string; // 样式类名
    footer?: ((params: FooterParams) => JSX.Element) | false; // 底部按钮自定义函数
    successMsg?: (res: any) => void; // 确认后请求成功提示
    errorMsg?: (err: any) => void; // 确认后请求失败提示
    confirmCancel?: (close: Function) => void; // 自定义的取消按钮二次确认，配置后cancelSecondConfirm和cancelSecondConfirmText失效
    cancelSecondConfirm?: boolean; // 开启默认的取消按钮二次确认
    cancelSecondConfirmText?: string; // 取消按钮二次确认自定义title
    isPopover?: boolean;
}

interface Render {
    form: FormInstance<any> | undefined; // form表单实例
    onCancel: () => void; // 关闭弹窗方法
    onOk: () => void; // 有form时校验并触发onFinish，无form应直接使用onFinish
    onFinish: (values: any) => Promise<void>; // 确认按钮请求方法
    setParams: (val: any[]) => void; // 设置弹窗组件暂存值
    params: any; // 弹窗组件暂存数据
    loading: boolean; // 提交按钮loading
}

interface FooterParams {
    onOk: () => void; // 有form时校验并触发onFinish，无form应直接使用onFinish
    onFinish: (values: any) => Promise<void>; // 确认按钮提交函数
    onCancel: () => void; // 关闭弹窗函数
    loading: boolean; // 是否加载中
    params: any; // 弹窗组件暂存数据
}

const BtnModal = (props: BtnModalProps) => {
    const {
        btnText,
        btnType = 'default',
        disabled,
        children,
        render,
        fetch,
        hasForm,
        onSuccess,
        onError,
        beforeOpen,
        className,
        title,
        footer,
        successMsg,
        errorMsg,
        confirmCancel,
        cancelSecondConfirm,
        cancelSecondConfirmText,
        isPopover,
        visible: _visible
    } = props;
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [params, setParamsState] = useState<any>();

    const form = hasForm ? Form.useForm()[0] : null;

    const showModal = async () => {
        try {
            // 获取beforeOpen返回值，无beforeOpen默认为true
            const res = beforeOpen ? await beforeOpen(() => setVisible(false)) : true;
            // beforeOpen返回true展示弹窗，false不展示，什么都不返回默认展示弹窗
            setVisible(typeof res === 'undefined' ? true : res);
        } catch {
            notification.error({
                message: '接口异常'
            });
        } finally {
            // 重置form数据
            form && form.resetFields();
            setParamsState(undefined);
        }
    };

    // 默认的取消按钮二次确认
    const defaultConfirmCancel = (close: (...args: any[]) => any) => {
        Modal.confirm({
            title: cancelSecondConfirmText || '确定要放弃吗？',
            content: '所有编辑都不会被保存',
            okText: '放弃',
            onOk: close
        });
    };

    const onCancel = () => {
        if (confirmCancel || cancelSecondConfirm) {
            const confirmCancelFn = confirmCancel || defaultConfirmCancel;
            confirmCancelFn(() => setVisible(false));
            return;
        }
        setVisible(false);
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
    const onFinish = async (values: any) => {
        if (!fetch) return;
        try {
            setLoading(true);
            const res = await fetch(values, params);
            onSuccess && onSuccess(res, values);
            successMsg
                ? successMsg(res)
                : notification.success({
                      message: '操作成功'
                  });
            setVisible(false);
        } catch (err) {
            // 有onError回调使用onError，若不存在统一处理
            if (onError) {
                onError(err, () => setVisible(false));
            } else {
                errorMsg
                    ? errorMsg(err)
                    : notification.error({
                          message: '操作失败'
                      });
                setVisible(false);
            }
        } finally {
            setLoading(false);
        }
    };
    const onOk = () => {
        form && form.submit();
    };

    // 暂存弹窗实际列表
    const setParams = val => {
        setParamsState(val);
    };

    useEffect(() => {
        setVisible(_visible);
    }, [_visible]);

    return (
        <>
            <span onClick={showModal} className={className}>
                {children || (
                    <Button type={isPopover ? 'default' : btnType} className={isPopover ? 'm-popover-btn' : ''} disabled={disabled}>
                        {btnText}
                    </Button>
                )}
            </span>
            <Modal
                {...props}
                onOk={hasForm ? onOk : onFinish}
                visible={visible}
                title={title || btnText}
                confirmLoading={loading}
                onCancel={onCancel}
                {...(footer
                    ? {
                          footer: footer({
                              onOk,
                              onFinish,
                              onCancel,
                              loading,
                              params
                          })
                      }
                    : footer === null
                    ? null
                    : {})}
            >
                {render && render({ form, onOk, onFinish, onCancel, params, setParams, loading })}
            </Modal>
        </>
    );
};

export default BtnModal;
