import { ReactChild } from 'react';
import { ButtonType } from 'antd/es/button/button';

export interface ConfirmModalProps {
    onSuccess: Function;
    beforeSubmit?: Function;
    onError: Function;
    btnText?: string;
    children?: ReactChild;
    fetchData: Function;
    btnType?: ButtonType;
    disabled: boolean;
}
