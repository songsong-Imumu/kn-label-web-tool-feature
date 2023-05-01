import React from 'react';
import HandleTag from '../components/handle-tag';

/**
 *
 * @returns 手工标注
 */
export default function ManualNamed(props) {
    const { textType } = props;
    return (
        <section className="m-manual-name">
            <HandleTag textType={textType} key={textType} />
        </section>
    );
}
