import React, { useState, useLayoutEffect, useRef } from 'react';
import { TooltipProps } from 'antd/lib/tooltip';
import { Tooltip } from 'antd';

interface IEllipsisProps extends Omit<TooltipProps, 'className' | 'style' | 'children'> {
    className?: string;
    style?: React.CSSProperties;
    width?: number | string;
    line?: number;
    children?: React.ReactNode;
}

// 单行溢出
const SingleLineStyle: React.CSSProperties = {
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'keep-all',
    wordWrap: 'normal',
    whiteSpace: 'nowrap'
};

// 多行溢出
const setMultipleLineStyle = (line: number): React.CSSProperties => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: line,
    WebkitBoxOrient: 'vertical'
});

// 指定宽度
const setWidthStyle = (width: number | string): React.CSSProperties => ({
    display: 'inline-block',
    maxWidth: width,
    marginRight: 10,
    verticalAlign: 'middle',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'keep-all',
    wordWrap: 'normal',
    whiteSpace: 'nowrap'
});

export default (props: IEllipsisProps) => {
    const { className = '', style, width, children, line = 1, ...rest } = props;
    const ref = useRef<HTMLDivElement>(null);
    const [showTip, setShowTip] = useState(false);
    const [maxWidth, setMaxWidth] = useState(200);

    useLayoutEffect(() => {
        if (!ref.current) return;
        let condition = line === 1 ? ref.current.clientWidth < ref.current.scrollWidth : true;
        if (condition && (ref.current.clientWidth !== maxWidth || !showTip)) {
            setShowTip(true);
            setMaxWidth(ref.current.clientWidth);
        }
    }, [line, maxWidth, showTip]);

    return (
        <div
            className={`u-ellipsis ${className}`}
            style={width ? { ...setWidthStyle(width), ...style } : line === 1 ? { ...SingleLineStyle, ...style } : style}
            ref={ref}
        >
            {showTip ? (
                <Tooltip placement="topLeft" title={children} overlayStyle={{ maxWidth: maxWidth * 1.5 }} {...rest}>
                    <span style={line > 1 ? setMultipleLineStyle(line) : {}}>{children}</span>
                </Tooltip>
            ) : (
                children
            )}
        </div>
    );
};
