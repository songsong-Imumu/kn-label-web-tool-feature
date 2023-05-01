import React, { useContext } from 'react';
import { Button, Modal } from 'antd';
import { ConfirmModalProps } from '@/components/btns/btn-confirm/interface';
import { ResponseConfig } from '@/axios/interface';
import { GlobalContext } from '@/context';

const ConfirmBtn = (props: ConfirmModalProps) => {
    const { dispatch: changeToNumber } = useContext(GlobalContext);
    const handlePass = async () => {
        const flag = props.beforeSubmit ? await props.beforeSubmit() : true;
        if (flag) {
            Modal.confirm({
                title: props.btnText,
                content: props.children,
                onOk: () => {
                    return props
                        .fetchData()
                        .then(() => {
                            props.onSuccess && props.onSuccess();
                            changeToNumber({ type: 'SET_QEURY_TASK' });
                        })
                        .catch((err: ResponseConfig<any>) => {
                            props.onError && props.onError(err);
                        });
                }
            });
        }
    };
    return (
        <Button onClick={handlePass} type={props.btnType || 'primary'} disabled={props.disabled}>
            {props.btnText}
        </Button>
    );
};

export default ConfirmBtn;
