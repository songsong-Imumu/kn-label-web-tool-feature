/**
 *  选择当天的时间范围
 *
 * @value Array ['2021-09-11 7:00' , '2021-09-12 8:00']
 */

import React, { useState, useEffect } from 'react';
import { DatePicker, TimePicker, Space } from 'antd';
import { useControllableValue } from 'ahooks';
import moment from 'moment';

const DATE_FORMAT = 'YYYY-MM-DD';
const TIME_FORMAT = 'HH:mm';

const SameDate = props => {
    const { dateFormat = DATE_FORMAT, timeFormat = TIME_FORMAT, timeRangeOptions = {}, dateOptions = {} } = props;
    const [value, setValue] = useControllableValue(props);
    const [date, setDate] = useState<any>(null);

    const onDateChange = date => {
        setDate(date);
        if (!date) {
            return setValue(date);
        }
        if (value) {
            const arr = value.map(item => `${moment(date).format(DATE_FORMAT)} ${moment(item).format(TIME_FORMAT)}`);
            setValue(arr);
        }
    };

    useEffect(() => {
        setDate(value?.length ? moment(value[0]) : null);
    }, [value]);

    const onTimeChange = timeRange => {
        const formatDate = moment(date).format(dateFormat);
        const valueRange = timeRange
            ? [moment(timeRange[0]).format(timeFormat), moment(timeRange[1]).format(timeFormat)].map(time => `${formatDate} ${time}`)
            : timeRange;
        setValue(valueRange);
    };

    return (
        <Space>
            <DatePicker value={date} onChange={onDateChange} {...dateOptions} />
            <TimePicker.RangePicker
                disabled={!date}
                value={value && [moment(value[0]), moment(value[1])]}
                onChange={value => {
                    onTimeChange(value);
                }}
                format={timeFormat}
                {...timeRangeOptions}
            />
        </Space>
    );
};

export default SameDate;
