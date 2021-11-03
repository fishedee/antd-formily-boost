import { useRef, useState } from 'react';
import { useEffect } from 'react';
import { AxiosRequestConfig } from 'axios';
import useRequest from './useRequest';
import Result, { ResultSuccess, ResultFail } from './Result';

type requestCallback = ((data: Result<any>) => void) | 'nothing';

let requestCache = new Map<string, requestCallback[]>();

type QueryCacheInfo = {
    data: any;
    expireTime: number;
};

let queryCache = new Map<string, QueryCacheInfo>();

let isOpenQueryLoadingRefresh = true;

export function setDeafultQueryLoadingRefresh(isOpen: boolean) {
    isOpenQueryLoadingRefresh = isOpen;
}

export function invalidQueryCacheByKey(prefixKey: string) {
    let cacheKeys = queryCache.keys();
    for (let key of cacheKeys) {
        if (key.startsWith(prefixKey)) {
            queryCache.delete(key);
        }
    }
}

let defaultCacheTimeInMilliSeconds = 30 * 60 * 1000;

export function setDefaultQueryCacheTime(milliSeconds: number) {
    defaultCacheTimeInMilliSeconds = milliSeconds;
}

export function clearQueryCache() {
    queryCache.clear();
}

export type UseQueryRequest = (
    config: AxiosRequestConfig,
) => Promise<Result<any>>;

export type UseQueryFetch = (data: UseQueryRequest) => Promise<void> | void;

export type UseQueryOptions = {
    firstDidNotRefresh?: boolean;
    cacheKey?: string;
    cacheTime?: number;
};

export class UseQueryConcurrentError extends Error {}

interface IDispose {
    (): void;
}

/*
 * 设计目标：
 * loading，加载展示，不能以loading直接写入到外部data字段，这样侵入性太大了。目前只能以全刷新的react方式提供useState方式
 * 冲突，同一个请求，分两次触发，先触发的请求可能后到达，从而造成并发冲突，这是能useRef的来解决。
 *       同时，我们为用户提供了axios的接口，在axios的封装接口中做了手脚，当数据返回以后，检查ref的返回值来决定是否产生了冲突。
 * 局部刷新，与ahooks，react-query等普通hook库不同的是，我们拿到ajax的数据以后，不希望以react的方式刷新页面（全页刷新），而是通过赋值到响应式数据到刷新页面（局部刷新）。
 *      与此同时，我们不希望用户传入具体的响应式数据来帮他赋值，所以，目前的接口设计是让用户传入闭包，自己拉了数据以后，自己去赋值到响应式数据。但是由于要配合冲突检查，所以ajax接口必须是useQuery提供axios接口
 * 首次刷新，我们可以通过传入firstDidNotRefresh，来控制首次是否触发refresh
 * 数据变更自动刷新，反模式，我们不能由useQuery的通过React的方式检查deps的变化来触发自动触发fetch，这样是不对的。
 *      因为不仅用户的交互会让数据变化，从而触发fetch。开发者对数据的赋值也会让数据变化，从而触发fetch，这样会产生隐晦的错误。
 * 按钮刷新，其他场景，通过onClick等方式的刷新，所以我们对外提供了fetch接口，onClick直接绑定到这个fetch接口上就可以了
 * 缓存，1.缓存是为了解决同一个页面的多个相同类型的component的数据问题，注意与useForm的缓存的不同。这里的难点在于，同一个cacheKey的多个请求可能同时发生的，需要合并请求
 *      2.缓存，是需要一个cacheKey的，也可以使用默认的cacheKey为空，与url拼接作为key
 *      3.缓存是默认的过期时间的，也可以由接口手动清理指定的缓存
 */

function useQuery(fetch: UseQueryFetch, options?: UseQueryOptions) {
    const [loading, setLoading] = useState(false);

    const ref = useRef(0);

    const firstRender = useRef(true);

    let request = useRequest();

    let manualFetch = async () => {
        const cacheRequest = async (
            config: AxiosRequestConfig,
        ): Promise<Result<any>> => {
            if (options?.cacheKey === undefined) {
                //没有缓存的情况，不需要走请求池，也不需要走缓存
                return await request(config);
            }
            //有缓存的情况
            //取缓存
            let cacheKey =
                options?.cacheKey + config.url + '_' + JSON.stringify(config);
            let cacheData = queryCache.get(cacheKey);

            if (cacheData) {
                const now = new Date().getTime();
                if (cacheData.expireTime > now) {
                    //未过期
                    return {
                        status: 'success',
                        data: cacheData.data,
                    };
                }
            }
            //获取请求池的信息
            if (requestCache.has(cacheKey) == false) {
                requestCache.set(cacheKey, []);
            }
            let requestList = requestCache.get(cacheKey);
            let isFirst = requestList?.length == 0;
            if (isFirst == false) {
                //被合并的那个
                return new Promise((resolve, reject) => {
                    //将自身放入resolve就可以返回了
                    requestList?.push(resolve);
                });
            } else {
                //首次触发的请求的那个
                requestList?.push('nothing');
                let result = await request(config);

                //先通知其他请求完成了
                let currentRequestList = requestCache.get(cacheKey)!;
                for (let i = 0; i != currentRequestList?.length; i++) {
                    let callback = currentRequestList[i];
                    if (typeof callback == 'function') {
                        callback(result);
                    }
                }
                //清空当前key的请求池
                requestCache.delete(cacheKey);

                //写入缓存
                if (result.status == 'fail') {
                    return result;
                }

                const now = new Date().getTime();
                let expireSeconds =
                    options.cacheTime || defaultCacheTimeInMilliSeconds;
                if (expireSeconds < 0) {
                    expireSeconds = 365 * 24 * 60 * 60 * 1000;
                }
                queryCache.set(cacheKey, {
                    data: result.data,
                    expireTime: now + expireSeconds,
                });
                return result;
            }
        };
        const newRequest = async (
            config: AxiosRequestConfig,
        ): Promise<Result<any>> => {
            ref.current++;
            let current = ref.current;
            if (isOpenQueryLoadingRefresh) {
                setLoading(true);
            }
            let result = await cacheRequest(config);
            if (current != ref.current) {
                return {
                    status: 'fail',
                    code: 1,
                    error: new Error('Conflit Error'),
                };
            }
            if (isOpenQueryLoadingRefresh) {
                setLoading(false);
            }
            return result;
        };
        await fetch(newRequest);
    };

    useEffect(() => {
        if (firstRender.current) {
            //第一次渲染
            if (options?.firstDidNotRefresh === true) {
                //首次不fetch
            } else {
                //其他情况fetch
                manualFetch();
            }
            firstRender.current = false;
        } else {
            //非第一次渲染
            manualFetch();
        }
        return () => {
            //当页面重刷的时候，标记以前请求失败
            ref.current++;
        };
    }, []);

    return { fetch: manualFetch, loading };
}

export default useQuery;
