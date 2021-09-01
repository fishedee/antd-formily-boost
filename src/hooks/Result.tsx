//手动方式返回，兼容性最好
//uncaught，会捕捉Formily的组件错误
//zonejs，与Antd的Select组件不兼容
//最终导致，异常处理错误的方案失败
type ResultFail = {
    status: 'fail';
    code: number;
    error: Error;
};

type ResultSuccess<T> = {
    status: 'success';
    data: T;
};

type Result<T = any> = ResultFail | ResultSuccess<T>;

export default Result;

export { ResultFail, ResultSuccess };
