import { RangePickerProps } from 'antd/lib/date-picker';

export interface FieldNameType {
    begin: string;
    end: string;
}

export interface ValueType {
    [propName: string]: number;
}

export interface PickerPropsType extends Omit<RangePickerProps, 'value' | 'onChange'> {
    onChange?: (value: ValueType | null) => void;
    value?: ValueType;
    fieldName?: FieldNameType;
}
