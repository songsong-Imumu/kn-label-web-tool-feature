/* eslint-disable react/require-default-props */
import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';

interface Props {
    type: string;
    mode?: 'svg' | 'span';
    style?: React.CSSProperties;
    className?: string;
    onClick?: (event: React.MouseEvent) => void;
}

const IconSvg = createFromIconfontCN({
    scriptUrl: ['//at.alicdn.com/t/font_3133245_0f67slbrl6r9.js']
});

const IconFont = (props: Props) => {
    const { type, mode = 'svg', ...res } = props;
    return mode === 'svg' ? <IconSvg type={type} {...res} /> : <span className={`iconfont ${type}`} {...res} />;
};

export default IconFont;
