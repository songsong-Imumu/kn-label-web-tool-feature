import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import cx from 'classnames';
import ecStat from 'echarts-stat';

const resizeObserver = new window.ResizeObserver(entries => {
    entries.map(({ target }) => {
        const instance = echarts.getInstanceByDom(target);
        if (instance) {
            instance.resize();
        }
    });
});

function ECharts(props) {
    const { options, style, className, loading, message, callback } = props;
    const [chart, setChart] = useState(null);
    const chartRef = useRef<any>();

    useEffect(() => {
        if (options) {
            const chart = echarts.init(chartRef.current, 'westeros'); // echarts theme
            echarts.registerTransform(ecStat.transform.clustering); //散点图
            chart.setOption({ ...options, resizeObserver }, true); // second param is for 'noMerge'
            setChart(chart);
            chart.on('click', function(params) {
                console.log(params);
                callback && callback(params);
            });
            if (resizeObserver) resizeObserver.observe(chartRef.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options]);

    useEffect(() => {
        if (!chart) {
            return;
        }
        if (loading) {
            chart.showLoading();
            return;
        }

        chart.hideLoading();
    }, [chart, loading]);

    useEffect(() => {
        if (chart && options && message) {
            chart.clear();
        }
    }, [chart, message, options]);

    const newStyle = {
        height: 350,
        ...style
    };

    if (!options) return null;
    return (
        <div className="echarts-parent" style={{ background: '#f5f5f5', marginBottom: '8px' }}>
            <div ref={chartRef} style={newStyle} className={cx('echarts-react', className)} />
            {message ? <div className="no-data">{message}</div> : null}
        </div>
    );
}

export default React.memo(ECharts);
