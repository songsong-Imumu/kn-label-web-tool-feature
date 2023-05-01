import React from 'react';
import IconSet from '@/components/icon';

// 数据导出
export default function Export(props) {
    const { textType } = props;
    return (
        <a href={'/api/textCluster/export?textType=' + textType} target="_blank">
            <IconSet type="icon-daochu" /> 数据导出
        </a>
    );
}
