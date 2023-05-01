import React from 'react';
import { Spin } from 'antd';
import './index.less';

const ULoading = props => {
    const { spinning, isAutoHeight } = props;
    return (
        <div className={`u-loading ${isAutoHeight ? 'u-loading-no-min-height' : ''}`}>
            <Spin spinning={spinning} className="u-loading-spin" tip="正在加载...">
                {props && props.children}
            </Spin>
        </div>
    );
};

export default ULoading;
