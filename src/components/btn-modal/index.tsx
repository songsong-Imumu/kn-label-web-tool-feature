/**
 * 项目按钮+弹窗组件
 */

import React from 'react';
import { notification } from 'antd';
import BtnModal, { BtnModalProps } from './common';

export type BtnModalAppProps = BtnModalProps;

const BtnModalApp = (props: BtnModalAppProps) => {
    // 默认弹窗成功提示
    const successMsg = () => {
        notification.success({
            message: '修改成功'
        });
    };
    // 取消弹窗报错信息
    const errorMsg = () => {};

    return <BtnModal successMsg={successMsg} errorMsg={errorMsg} {...props} maskClosable={false} />;
};

export default BtnModalApp;
