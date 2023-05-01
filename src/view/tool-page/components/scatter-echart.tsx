import React, { useState, useEffect, useRef, useContext } from 'react';
import ECharts from './echart-base';
import { ScatterContext } from '@/context';

const initial = { data: null, error: undefined, loading: true } as any;

export default function ScatterEcharts(props) {
    const { data } = props;
    const cluster = useRef<number>(0);
    const [wordData, setWordData] = useState(initial);
    const { updateCluster } = useContext(ScatterContext);

    const getWordCloud = data => {
        var DIENSIION_CLUSTER_INDEX = 2;
        var COLOR_ALL = ['#37A2DA', '#e06343', '#37a354', '#b5bd48', '#8378EA', '#96BFFF', '#b55dba'];
        var pieces = [] as any;
        for (var i = 0; i < cluster.current; i++) {
            pieces.push({
                value: i,
                label: 'cluster ' + i,
                color: COLOR_ALL[i]
            });
        }

        const Option = {
            tooltip: {
                position: 'top'
            },
            visualMap: {
                type: 'piecewise',
                top: 'middle',
                min: 0,
                max: cluster.current,
                left: 10,
                splitNumber: cluster.current,
                dimension: DIENSIION_CLUSTER_INDEX,
                pieces: pieces
            },
            grid: {
                left: 120
            },
            xAxis: {
                show: false
            },
            yAxis: {
                show: false
            },
            series: {
                type: 'scatter',
                encode: { tooltip: [0, 1] },
                symbolSize: 15,
                itemStyle: {
                    borderColor: '#555'
                },
                datasetIndex: 1
            }
        };
        const cloudOptions = {
            ...Option,
            tooltip: {
                show: true
            },
            dataset: [
                {
                    source: data
                },
                {
                    transform: {
                        type: 'ecStat:clustering',
                        config: {
                            clusterCount: cluster.current,
                            outputType: 'single',
                            outputClusterIndexDimension: DIENSIION_CLUSTER_INDEX
                        }
                    }
                }
            ]
        };

        setWordData({
            data: cloudOptions,
            error: false,
            loading: false
        });
    };

    // 点击的是哪一个
    const onClick = params => {
        updateCluster(data[params.dataIndex].clusterId);
    };

    const formatData = data => {
        let number = 0;
        data = data.map(item => {
            if (item.clusterId > number) {
                number = item.clusterId;
            }
            item = item.vector;
            return item;
        });
        return {
            number: number + 1,
            dataSrc: data
        };
    };

    useEffect(() => {
        if (data) {
            const { dataSrc, number } = formatData(data);
            cluster.current = number;
            getWordCloud(dataSrc);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return <ECharts options={wordData.data} callback={onClick} />;
}
