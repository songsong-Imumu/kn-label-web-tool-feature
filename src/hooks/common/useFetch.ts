import { useState, useEffect, useCallback, useRef } from 'react';
import { ResponseConfig } from '@/axios/interface';

interface UseFetchResult<R> {
    data: R | undefined;
    isLoading: boolean;
    dispatch: (params?: any) => Promise<R>;
}
/**
 * @param {fuction} url 请求方法
 * @param {obj}} params 请求参数
 * @param {bool} isImmediately 是否立即执行
 */
function useFetch<R>(url: (req: any) => Promise<R>, params?: any, isImmediately = true): UseFetchResult<R> {
    const [data, setData] = useState<R | undefined>();
    const [isLoading, setIsLoading] = useState(false);

    const cacheParams = useRef(params);

    useEffect(() => {
        cacheParams.current = params;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    // 接口请求
    const fetch = (url: (req: any) => Promise<R>, params?: any): Promise<R> => {
        setIsLoading(true);
        return new Promise((resolve, reject) => {
            url(params)
                .then((data: R) => {
                    setData(data);
                    resolve(data);
                })
                .catch((err: ResponseConfig<R>) => {
                    reject(err);
                })
                .finally(() => setIsLoading(false));
        });
    };

    /**
     * 手动触发接口请求
     * @param {obj} value 手动触发请求时可直接传入请求参数，否则取默认参数
     */
    const dispatch = useCallback((value = cacheParams.current) => fetch(url, value), [url]);

    useEffect(() => {
        isImmediately && fetch(url, cacheParams.current);
    }, [url, isImmediately]);

    return { data, isLoading, dispatch };
}

export default useFetch;
