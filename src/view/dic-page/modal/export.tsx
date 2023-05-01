import React from 'react';
import IconSet from '@/components/icon';

// 导出
export default function Export(props) {
    const { data } = props;
    return (
        <a href={'/api/dictData/export/' + data.id} target="_blank">
            <IconSet type="icon-daochu" /> 导出
        </a>
    );
}
