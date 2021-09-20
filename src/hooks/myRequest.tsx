import Result, { ResultFail, ResultSuccess } from './Result';
import axios, { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';

const codeMessage = new Map<number, string>([
    [200, '服务器成功返回请求的数。'],
    [201, '新建或修改数据成功。'],
    [202, '一个请求已经进入后台排队（异步任务）。'],
    [204, '删除数据成功。'],
    [400, '发出的请求有错误，服务器没有进行新建或修改数据的操作。'],
    [401, '用户没有权限（令牌、用户名、密码错误）。'],
    [403, '用户得到授权，但是访问是被禁止的。'],
    [404, '发出的请求针对的是不存在的记录，服务器没有进行操作。'],
    [406, '请求的格式不可得。'],
    [410, '请求的资源被永久删除，且不会再得到的。'],
    [422, '当创建一个对象时，发生一个验证错误。'],
    [500, '服务器发生错误，请检查服务器。'],
    [502, '网关错误。'],
    [503, '服务不可用，服务器暂时过载或维护。'],
    [504, '网关超时。'],
]);

function checkStatus(response: AxiosResponse): Result<any> {
    if (response.status >= 200 && response.status < 300) {
        return {
            status: 'success',
            data: 0,
        };
    }
    const errortext: string =
        codeMessage.get(response.status) || response.statusText;

    return {
        status: 'fail',
        code: 1,
        error: new Error(
            `请求错误 ${response.status}: ${response.request}：${errortext}`,
        ),
    };
}

function checkBody(response: ResponseDataType): Result<any> {
    if (response.code == 0) {
        return {
            status: 'success',
            data: 0,
        };
    }
    return {
        status: 'fail',
        code: 1,
        error: new Error(response.msg),
    };
}

function getCookie(name: string) {
    var strcookie = document.cookie; //获取cookie字符串
    var arrcookie = strcookie.split('; '); //分割
    //遍历匹配
    for (var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split('=');
        if (arr[0] == name) {
            return arr[1];
        }
    }
    return '';
}

let requestUrlPrefixKey = '';

export function setMyRequestUrlPrefixKey(prefixKey: string) {
    requestUrlPrefixKey = prefixKey;
}

export type ResponseDataType = {
    code: number;
    msg: string;
    data: any;
};

export type RequestType = (options: AxiosRequestConfig) => Promise<Result<any>>;

const myRequest: RequestType = async (options: AxiosRequestConfig) => {
    if (!options.url || options.url == '') {
        return {
            status: 'fail',
            code: 1,
            error: new Error('url为空'),
        };
    }
    options.url = requestUrlPrefixKey + options.url;

    //添加csrf头部
    if (!options.headers) {
        options.headers = {};
    }
    options.headers['X-XSRF-TOKEN'] = getCookie('XSRF-TOKEN');

    //添加url随机数，以避免缓存
    if (!options.params) {
        options.params = {};
    }
    options.params['_t'] = new Date().valueOf();

    //转换GET请求的data参数
    if (options.method == 'GET' && options.data) {
        let queryStr = encodeURIComponent(JSON.stringify(options.data));
        if (options.url.indexOf('?') == -1) {
            options.url = options.url + '?data=' + queryStr;
        } else {
            options.url = options.url + '&data=' + queryStr;
        }
        options.data = undefined;
    }

    try {
        let response = await axios(options);

        let result = checkStatus(response);
        if (result.status == 'fail') {
            return result;
        }

        let data: ResponseDataType = response.data;
        result = checkBody(data);
        if (result.status == 'fail') {
            return result;
        }

        return {
            status: 'success',
            data: data.data,
        };
    } catch (e: any) {
        console.error(e);
        if (e.message?.indexOf('403') != -1) {
            return {
                status: 'fail',
                code: 403,
                error: new Error(e.message),
            };
        }
        return {
            status: 'fail',
            code: 1,
            error: new Error(e.message),
        };
    }
};
export default myRequest;
