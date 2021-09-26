import { IFormProps } from '@formily/core';
import useForm, { createFormProps } from './useForm';
import useQueryTable, {
    UseQueryTableProps,
    UseQueryTableOptions,
} from './useQueryTable';

//就是一个简单的组合，将useForm与useQueryTable组合在一起而已，功能包括：
//* 赋值默认的QueryTable需要的属性
//* 打开cacheKey的功能
function useQueryTableBoost(
    ajaxUrl: string,
    form: IFormProps<UseQueryTableProps> = {},
    options?: UseQueryTableOptions,
) {
    const formInfo = useForm(
        {
            ...form,
            values: {
                filter: {},
                paginaction: { current: 1, pageSize: 10, total: 0 },
                list: [],
            },
        },
        {
            cacheKey: 'useQueryTableBoost.' + ajaxUrl,
        },
    );
    const queryTableBoostInfo = useQueryTable(ajaxUrl, formInfo.form, options);
    return {
        ...formInfo,
        ...queryTableBoostInfo,
    };
}

export default useQueryTableBoost;
