import React, { useState, useEffect } from 'react';
import ECharts from './echart-base';
import 'echarts-wordcloud';
import useFetch from '@/hooks/common/useFetch';
import { getWordCloudByClusterId } from '@/axios';

export const WordCloudOptions = {
    type: 'wordCloud',
    shape: 'circle',
    sizeRange: [12, 35],
    rotationRange: [0, 0],
    width: '100%',
    height: '100%',
    top: '10%',
    bottom: '10%',
    drawOutOfBound: false,
    gridSize: 8,
    textStyle: {
        normal: {
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            // Color can be a callback function or a color string
            color: function() {
                // Random color
                return 'rgb(' + [Math.round(Math.random() * 160), Math.round(Math.random() * 160), Math.round(Math.random() * 160)].join(',') + ')';
            }
        },
        emphasis: {
            shadowBlur: 1,
            shadowColor: '#333'
        }
    }
};
const initial = { data: [], error: undefined, loading: true };

export default function WordsCloudEcharts(props) {
    const { clusterId, textType } = props;
    const [wordData, setWordData] = useState(initial);
    const { data: wordsCloudData, dispatch, isLoading } = useFetch(getWordCloudByClusterId, null, false);

    const getWordCloud = data => {
        const cloudOptions = {
            tooltip: {
                show: true
            },
            // toolbox: PieToolbox,
            series: [
                {
                    ...WordCloudOptions,
                    data: data.map(item => {
                        item.name = item.word;
                        return item;
                    })
                }
            ]
        };

        setWordData({
            data: cloudOptions,
            error: false,
            loading: false
        });
    };

    useEffect(() => {
        if (wordsCloudData) {
            getWordCloud(wordsCloudData);
        }
    }, [wordsCloudData]);

    useEffect(() => {
        dispatch({ clusterId, textType });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clusterId]);

    return <ECharts loading={isLoading} options={wordData.data} />;
}
