import React, { ReactNode } from 'react';
import { Button } from 'antd';
import CpmModal from '@/components/cpm-modal';
import { BtnTplProps } from '@/components/btns/btn-tpl/interface';

import './index.less';

export interface BtnModalProps extends BtnTplProps {
    showModal: any;
    render: () => ReactNode;
    list?: Record<string, any>;
    isPopover?: boolean;
    children?: ReactNode;
    disabled?: boolean;
}

const BtnModal = (props: BtnModalProps) => {
    const { disabled, btnText, isPopover, render, children, isLoading, showModal, btnType, className } = props;

    return (
        <>
            <span onClick={showModal} className={className}>
                {children ? (
                    children
                ) : (
                    <Button type={btnType || 'default'} className={isPopover ? 'm-popover-btn' : ''} disabled={disabled}>
                        {btnText}
                    </Button>
                )}
            </span>
            <CpmModal {...props} title={props.title || btnText} confirmLoading={isLoading}>
                {render && render()}
            </CpmModal>
        </>
    );
};

export default BtnModal;
