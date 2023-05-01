import { Store } from 'antd/es/form/interface';
import { FormInstance } from 'antd/es/form';

type OnFinishType = (values: Store) => void;
// content
export interface ContentFormProps {
    onFinish: OnFinishType;
    form: FormInstance;
    label?: string;
    period?: string;
    list?: Record<string, any>[];
    required?: boolean;
    userId?: string;
    annualOnly?: boolean;
    extra?: string;
}
