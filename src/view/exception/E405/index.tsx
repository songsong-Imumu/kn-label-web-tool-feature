import React from 'react';
import NotFindImg from '@/assets/img/empty/no-authority.png';
import './index.less';

function NotFound() {
    return (
        <div className="m-exception-e405">
            <img src={NotFindImg} alt="405" className="m-exception-e405-img" />
            <p style={{ marginTop: '20px' }}>抱歉，您无权访问该系统，请进行刷新重试</p>
        </div>
    );
}

export default NotFound;
