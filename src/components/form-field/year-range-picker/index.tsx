import React from 'react';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { PickerPropsType } from './interface';
import './index.less';

const { RangePicker } = DatePicker;
const defaultName = {
    begin: 'beginYear',
    end: 'endYear'
};

const YearRangePicker = (props: PickerPropsType) => {
    const { value, onChange, fieldName = defaultName, ...rest } = props;
    const disabledDate = (current: Moment) => {
        return current.year() < 2016 || current.year() > moment().year();
    };
    const begin = fieldName.begin;
    const end = fieldName.end;
    const formatInputValue = (value: any) => (value ? [moment().year(value[begin]), moment().year(value[end])] : value);
    const formatOutputValue = (value: Moment[] | null) => (value ? { [begin]: moment(value[0]).year(), [end]: moment(value[1]).year() } : value);
    const onRangePickerChange = momentArr => {
        onChange && onChange(formatOutputValue(momentArr));
    };
    return (
        <RangePicker
            picker="year"
            disabledDate={disabledDate}
            defaultPickerValue={[moment().subtract(10, 'years'), moment().subtract(10, 'years')]}
            allowClear={false}
            {...rest}
            value={formatInputValue(value)}
            onChange={onRangePickerChange}
        />
    );
};

export default YearRangePicker;
