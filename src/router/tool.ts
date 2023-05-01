import { SYSTEM_ACTIVE, SYSTEM_ID } from '@/constants/system';
import { URLType } from './interface';
import { urlObj } from './router';

const getPageUrl = (type: keyof URLType, path, paramsObj?) => {
    const pathname = typeof path === 'string' ? path : window.location.pathname;
    const params = typeof path === 'object' ? path : paramsObj;
    return `${pathname}${urlObj[type].link}?${Object.keys(params)
        .map(item => (params[item] ? `${item}=${params[item]}` : null))
        .join('&')}`;
};

export const getBackUrl = (pathname, params?) => {
    const pathSnippets = pathname.split('/').filter(i => i);
    const pathBack = pathSnippets.slice(0, pathSnippets.length - 1);

    return params && Object.keys(params).length
        ? `/${pathBack.join('/')}?${Object.keys(params)
              .map(item => (params[item] ? `${item}=${params[item]}` : null))
              .join('&')}`
        : `/${pathBack.join('/')}`;
};

// 参数拼接
export const getPageParam = paramsObj => {
    if (!paramsObj) return '';
    return `?${Object.keys(paramsObj)
        .map(item => (paramsObj[item] ? `${item}=${paramsObj[item]}` : null))
        .join('&')}`;
};

// 返回待办
export const backCommonTodo = () => {
    history.pushState(null, '', `/${SYSTEM_ACTIVE?.[SYSTEM_ID.CPP]}/todo`);
};

export default getPageUrl;
