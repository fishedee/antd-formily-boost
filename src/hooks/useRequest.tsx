import axios, { AxiosRequestConfig } from 'axios';
import Result, { ResultFail } from './Result';

export type RequestHandler = (
    options: AxiosRequestConfig,
) => Promise<Result<any>>;

type ErrorHandler = (result: ResultFail) => void;

let requestErrorHandler: ErrorHandler = (result: ResultFail) => {
    console.error(result.error);
};

export function replaceErrorHandler(handler: ErrorHandler) {
    requestErrorHandler = handler;
}

let requestHandler: RequestHandler = async (
    config: AxiosRequestConfig,
): Promise<Result<any>> => {
    try {
        let result: any = await axios(config);
        return {
            status: 'success',
            data: result,
        };
    } catch (e: any) {
        return {
            status: 'fail',
            code: 1,
            error: e,
        };
    }
};

export function replaceRequestHandler(handler: RequestHandler) {
    requestHandler = handler;
}
export type UseRequestOptions = {};

/*
 * 设计目标，这个是所有请求的基础
 * 统一ajax输出，
 * 默认的全局错误捕捉
 */
function useRequest(options?: UseRequestOptions) {
    const newHandler: RequestHandler = async (
        config: AxiosRequestConfig,
    ): Promise<Result<any>> => {
        let result = await requestHandler(config);
        if (result.status == 'success') {
            return result;
        }
        requestErrorHandler(result);
        return result;
    };
    return newHandler;
}

export default useRequest;
