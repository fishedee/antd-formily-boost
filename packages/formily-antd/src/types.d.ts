//补充umi模块的声明，同时避免真的对umi模块的导入
declare module 'umi' {
    let useHistory: any;
    export { useHistory };
}
