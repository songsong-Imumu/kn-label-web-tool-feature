import { ReactNode } from 'react';
import { FormInstance } from 'antd/es/form';
import { Store } from 'antd/es/form/interface';
import { ModalProps } from 'antd/lib/modal';
import { ButtonType } from 'antd/lib/button';

// 按钮模板props类型
export interface BtnTplProps extends ModalProps {
    btnText?: string;
    warnText?: string;
    statusChangeType?: string | null;
    form?: FormInstance;
    render?: (form: FormInstance, onFinish: (values: Store) => void) => ReactNode;
    fetch?: (data: Store) => Promise<any>;
    isLoading?: boolean;
    cancelSecondConfirm?: boolean;
    hasForm?: boolean;
    onSuccess?: Function;
    onError?: Function;
    beforeOpen?: Function;
    children?: ReactNode;
    btnType?: ButtonType;
    cancelHandle?: Function;
}

export interface BtnModalProps extends BtnTplProps {
    showModal: any;
    children?: ReactNode;
}
