import React from 'react';
import NotFindImg from '@/assets/img/empty/no-authority.png';

import './index.less';

function NotFound() {
    return (
        <div className="m-exception-e403">
            <img src={NotFindImg} alt="403" className="m-exception-e403-img" />
            <p>无权限访问</p>
        </div>
    );
}

export default NotFound;
