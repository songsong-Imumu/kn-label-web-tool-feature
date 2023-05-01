import React from 'react';
import IconSet from '@/components/icon';

// 导出
export default function Export(props) {
    const { data, textType } = props;
    return (
        <a href={'/api/textData/export/' + data.id + '?textType=' + textType} target="_blank">
            <IconSet type="icon-daochu" /> 导出
        </a>
    );
}
