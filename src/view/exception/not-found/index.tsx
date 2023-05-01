import React from 'react';
import NotFindImg from '@/assets/img/404.png';
import './index.less';

function NotFound() {
    return (
        <div className="m-exception-not-found">
            <img src={NotFindImg} alt="404" className="m-exception-not-found-img" />
            <div style={{ marginTop: '25px' }}>
                <div>抱歉，找不到您所访问的页面，可能页面不存在或者链接地址有误</div>
            </div>
        </div>
    );
}

export default NotFound;
