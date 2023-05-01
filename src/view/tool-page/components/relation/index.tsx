import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import './index.less';

export default function RelationDicPage(props) {
    const { entitys, handleReationsLabel } = props;
    const [first, setFirst] = useState(null);
    const [second, setSecond] = useState(null);

    const [tip, setTip] = useState('请选择实体');
    const FirstRef = useRef(null);
    const SecondRef = useRef(null);

    useEffect(() => {
        if (first && second) {
            setTip('按下快捷键');
            handleReationsLabel(first.id, second.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [first, second]);

    return (
        <div className="u-handle--relaiton-label">
            <section className="relation-item">
                {entitys?.map(item => (
                    <div key={item.id} className="item">
                        <div
                            title="作为头实体"
                            className={classNames('f1', 'cyan', { active: item.label == first?.label })}
                            onClick={e => {
                                FirstRef.current = e.target;
                                setFirst(item);
                            }}
                        >
                            {item.label}
                        </div>

                        <div
                            title="作为尾实体"
                            className={classNames('f1', 'blue', { active: item.label == second?.label })}
                            onClick={e => {
                                SecondRef.current = e.target;
                                setSecond(item);
                            }}
                        >
                            {item.label}
                        </div>
                    </div>
                ))}
            </section>
            <section className="relation-choose">
                <div className={classNames('entity', { opacity: !first?.label })}>
                    <div className="name">{first?.label} </div>
                    <span>头实体</span>
                </div>
                <div>
                    &lt;--------<span className="tip">{tip}</span>--------&gt;
                </div>
                <div className={classNames('entity', { opacity: !second?.label })}>
                    <div className="name">{second?.label}</div>
                    <span>尾实体</span>
                </div>
            </section>
        </div>
    );
}
